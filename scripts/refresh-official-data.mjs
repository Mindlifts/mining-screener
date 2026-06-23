import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const cachePath = path.join(rootDir, "data", "official-cache.json");
const sourcesPath = path.join(rootDir, "data", "company-sources.json");
const oneDayMs = 24 * 60 * 60 * 1000;
const userAgent = process.env.SEC_USER_AGENT ?? "mining-screener research contact@example.com";
const force = process.argv.includes("--force");

function nowIso() {
  return new Date().toISOString();
}

async function readJson(filePath) {
  return JSON.parse(await fs.readFile(filePath, "utf8"));
}

async function secFetch(url) {
  const response = await fetch(url, {
    headers: {
      "User-Agent": userAgent,
      Accept: "application/json"
    }
  });

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText} for ${url}`);
  }

  return response.json();
}

function normalizeTicker(ticker) {
  return ticker.split(".")[0].replace(/[^A-Z0-9]/gi, "").toUpperCase();
}

function cikToPadded(cik) {
  return String(cik).padStart(10, "0");
}

function latestFact(facts, taxonomy, names, unit = "USD") {
  for (const name of names) {
    const fact = facts?.[taxonomy]?.[name];
    const values = fact?.units?.[unit];
    if (!values?.length) continue;

    const filedValues = values
      .filter((item) => typeof item.val === "number" && item.filed)
      .sort((a, b) => String(b.filed).localeCompare(String(a.filed)));

    if (filedValues.length) return filedValues[0];
  }

  return null;
}

function millions(value) {
  return Math.round((value / 1_000_000) * 10) / 10;
}

function deriveMetrics(companyFacts) {
  const facts = companyFacts.facts ?? {};
  const revenue =
    latestFact(facts, "us-gaap", ["RevenueFromContractWithCustomerExcludingAssessedTax", "SalesRevenueNet", "Revenues"]) ??
    latestFact(facts, "ifrs-full", ["Revenue"]);
  const cash =
    latestFact(facts, "us-gaap", ["CashAndCashEquivalentsAtCarryingValue", "CashCashEquivalentsRestrictedCashAndRestrictedCashEquivalents"]) ??
    latestFact(facts, "ifrs-full", ["CashAndCashEquivalents"]);
  const debt =
    latestFact(facts, "us-gaap", ["LongTermDebtAndFinanceLeaseObligationsCurrent", "LongTermDebtCurrent"]) ??
    latestFact(facts, "ifrs-full", ["CurrentBorrowings"]);
  const longDebt =
    latestFact(facts, "us-gaap", ["LongTermDebtAndFinanceLeaseObligationsNoncurrent", "LongTermDebtNoncurrent"]) ??
    latestFact(facts, "ifrs-full", ["NoncurrentBorrowings"]);

  const metrics = {};
  const warnings = [];

  if (revenue) metrics.revenue = millions(revenue.val);
  if (cash) metrics.cash = millions(cash.val);
  if (cash && (debt || longDebt)) {
    metrics.netDebt = millions((debt?.val ?? 0) + (longDebt?.val ?? 0) - cash.val);
  }

  if (!revenue) warnings.push("No standard revenue fact found in SEC companyfacts.");
  if (!cash) warnings.push("No standard cash fact found in SEC companyfacts.");

  const filedAt = [revenue?.filed, cash?.filed, debt?.filed, longDebt?.filed].filter(Boolean).sort().at(-1);

  return { metrics, warnings, filedAt };
}

async function getTickerMap() {
  const rows = await secFetch("https://www.sec.gov/files/company_tickers_exchange.json");
  const fields = rows.fields ?? [];
  const data = rows.data ?? [];
  const tickerIndex = fields.indexOf("ticker");
  const cikIndex = fields.indexOf("cik");
  const exchangeIndex = fields.indexOf("exchange");
  const map = new Map();

  for (const row of data) {
    const ticker = normalizeTicker(row[tickerIndex]);
    if (!ticker) continue;
    map.set(ticker, {
      cik: row[cikIndex],
      exchange: row[exchangeIndex]
    });
  }

  return map;
}

async function refresh() {
  const cache = await readJson(cachePath);
  const generatedAt = cache.generatedAt ? Date.parse(cache.generatedAt) : 0;

  if (!force && generatedAt && Date.now() - generatedAt < oneDayMs) {
    console.log(`Official cache is still fresh: ${cache.generatedAt}`);
    return;
  }

  const sourceRegistry = await readJson(sourcesPath);
  const tickerMap = await getTickerMap();
  const records = {};

  for (const source of sourceRegistry.companies) {
    if (source.regulator !== "SEC") continue;

    const ticker = normalizeTicker(source.ticker);
    const mapping = tickerMap.get(ticker);
    if (!mapping?.cik) {
      records[source.slug] = {
        source: "SEC EDGAR",
        sourceUrl: source.officialFilingsUrl,
        regulator: source.regulator,
        refreshedAt: nowIso(),
        metrics: {},
        warnings: [`No SEC ticker mapping found for ${source.ticker}.`]
      };
      continue;
    }

    await new Promise((resolve) => setTimeout(resolve, 140));
    const cik = cikToPadded(mapping.cik);
    const sourceUrl = `https://data.sec.gov/api/xbrl/companyfacts/CIK${cik}.json`;

    try {
      const companyFacts = await secFetch(sourceUrl);
      const derived = deriveMetrics(companyFacts);
      records[source.slug] = {
        source: "SEC EDGAR companyfacts",
        sourceUrl,
        regulator: source.regulator,
        filedAt: derived.filedAt,
        refreshedAt: nowIso(),
        metrics: derived.metrics,
        warnings: derived.warnings
      };
    } catch (error) {
      records[source.slug] = {
        source: "SEC EDGAR companyfacts",
        sourceUrl,
        regulator: source.regulator,
        refreshedAt: nowIso(),
        metrics: {},
        warnings: [error instanceof Error ? error.message : String(error)]
      };
    }
  }

  const refreshed = {
    generatedAt: nowIso(),
    expiresAt: new Date(Date.now() + oneDayMs).toISOString(),
    sourcePolicy:
      "Official/regulatory filings are refreshed at most once daily. Market-derived metrics remain mock or vendor-provided unless a licensed delayed market data provider is configured.",
    records
  };

  await fs.writeFile(cachePath, `${JSON.stringify(refreshed, null, 2)}\n`);
  console.log(`Official cache refreshed for ${Object.keys(records).length} SEC-backed records.`);
}

refresh().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
