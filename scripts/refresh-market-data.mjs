import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const universePath = path.join(rootDir, "data", "mining-universe.ts");
const officialCachePath = path.join(rootDir, "data", "official-cache.json");
const marketCachePath = path.join(rootDir, "data", "market-data-cache.json");
const commodityCachePath = path.join(rootDir, "data", "commodity-price-cache.json");
const oneDayMs = 24 * 60 * 60 * 1000;
const force = process.argv.includes("--force");
const yahooHost = "https://query2.finance.yahoo.com/v8/finance/chart";

const commoditySymbols = [
  { commodity: "Gold", symbol: "GC=F", sourceLabel: "Yahoo Finance delayed COMEX gold futures" },
  { commodity: "Silver", symbol: "SI=F", sourceLabel: "Yahoo Finance delayed COMEX silver futures" },
  { commodity: "Copper", symbol: "HG=F", sourceLabel: "Yahoo Finance delayed COMEX copper futures" },
  { commodity: "Oil & Gas", symbol: "CL=F", sourceLabel: "Yahoo Finance delayed NYMEX WTI futures" },
  // Yahoo exposes these as alternative/delayed symbols and they can go stale.
  // Keep the timestamp in the cache so the UI can avoid presenting them as live.
  { commodity: "Uranium", symbol: "UX=F", sourceLabel: "Yahoo Finance uranium futures/alternative symbol", allowStale: true },
  { commodity: "Coal", symbol: "MTF=F", sourceLabel: "Yahoo Finance coal futures/alternative symbol", allowStale: true }
];

function nowIso() {
  return new Date().toISOString();
}

async function readJson(filePath) {
  return JSON.parse(await fs.readFile(filePath, "utf8"));
}

async function readJsonIfExists(filePath, fallback) {
  try {
    return await readJson(filePath);
  } catch {
    return fallback;
  }
}

function parseUniverse(source) {
  const companies = [];
  const matches = source.matchAll(/\{\s*slug:\s*"([^"]+)",[\s\S]*?company:\s*"([^"]+)",[\s\S]*?ticker:\s*"([^"]+)",[\s\S]*?exchange:\s*"([^"]+)",[\s\S]*?marketCap:\s*([0-9.]+)/g);

  for (const match of matches) {
    companies.push({
      slug: match[1],
      company: match[2],
      ticker: match[3],
      exchange: match[4],
      sampleMarketCap: Number(match[5])
    });
  }

  return companies;
}

function chartUrl(symbol) {
  return `${yahooHost}/${encodeURIComponent(symbol)}?range=5d&interval=1d`;
}

async function fetchChart(symbol) {
  const response = await fetch(chartUrl(symbol), {
    headers: {
      "User-Agent": "Mozilla/5.0 mining-screener daily-cache",
      Accept: "application/json"
    }
  });

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText} for ${symbol}`);
  }

  const payload = await response.json();
  const result = payload.chart?.result?.[0];
  const error = payload.chart?.error;

  if (error) throw new Error(`${error.code ?? "chart-error"} ${error.description ?? ""}`.trim());
  if (!result?.meta) throw new Error(`No chart metadata returned for ${symbol}`);

  return result;
}

function getLatestClose(result) {
  const quote = result.indicators?.quote?.[0] ?? {};
  const closes = result.indicators?.adjclose?.[0]?.adjclose ?? quote.close ?? [];
  const timestamps = result.timestamp ?? [];

  for (let index = closes.length - 1; index >= 0; index -= 1) {
    const close = closes[index];
    if (typeof close === "number" && Number.isFinite(close)) {
      return {
        close,
        timestamp: timestamps[index] ? new Date(timestamps[index] * 1000).toISOString() : undefined
      };
    }
  }

  const regularMarketPrice = result.meta?.regularMarketPrice;
  if (typeof regularMarketPrice === "number" && Number.isFinite(regularMarketPrice)) {
    return {
      close: regularMarketPrice,
      timestamp: result.meta?.regularMarketTime ? new Date(result.meta.regularMarketTime * 1000).toISOString() : undefined
    };
  }

  throw new Error(`No usable close price returned for ${result.meta?.symbol ?? "symbol"}`);
}

function getChangePercent(result, close) {
  const previousClose = result.meta?.chartPreviousClose;
  if (typeof previousClose !== "number" || previousClose === 0) return 0;
  return Math.round(((close - previousClose) / previousClose) * 1000) / 10;
}

function millions(value) {
  return Math.round((value / 1_000_000) * 10) / 10;
}

function roundMetric(value) {
  return Math.round(value * 10) / 10;
}

function roundPrice(value) {
  return Math.round(value * 100) / 100;
}

async function refresh() {
  const marketCache = await readJsonIfExists(marketCachePath, { generatedAt: null, records: {} });
  const generatedAt = marketCache.generatedAt ? Date.parse(marketCache.generatedAt) : 0;

  if (!force && generatedAt && Date.now() - generatedAt < oneDayMs) {
    console.log(`Market cache is still fresh: ${marketCache.generatedAt}`);
    return;
  }

  const universeSource = await fs.readFile(universePath, "utf8");
  const officialCache = await readJsonIfExists(officialCachePath, { records: {} });
  const companies = parseUniverse(universeSource);
  const marketRecords = {};
  const commodityRecords = {};

  for (const company of companies) {
    await new Promise((resolve) => setTimeout(resolve, 110));
    const sourceUrl = chartUrl(company.ticker);

    try {
      const result = await fetchChart(company.ticker);
      const { close, timestamp } = getLatestClose(result);
      const officialShares = officialCache.records?.[company.slug]?.metrics?.sharesOutstanding;
      const sharesOutstanding = typeof officialShares === "number" ? officialShares : undefined;
      const metrics = {
        sharePrice: roundPrice(close)
      };
      const warnings = [];

      if (sharesOutstanding) {
        const calculatedMarketCap = millions(close * sharesOutstanding);
        const ratioToSample = company.sampleMarketCap > 0 ? calculatedMarketCap / company.sampleMarketCap : 1;

        if (ratioToSample >= 0.1 && ratioToSample <= 10) {
          metrics.sharesOutstanding = sharesOutstanding;
          metrics.marketCap = calculatedMarketCap;
        } else {
          warnings.push(
            `Rejected calculated market cap ${calculatedMarketCap} because it is inconsistent with the existing universe scale. Check share class, ADR ratio, and issuer mapping before enabling.`
          );
        }
      } else {
        warnings.push("Market cap not recalculated because no official shares outstanding value is available.");
      }

      marketRecords[company.slug] = {
        source: "Yahoo Finance delayed chart + official share count when available",
        sourceUrl,
        currency: result.meta?.currency ?? "USD",
        quoteTime: timestamp,
        refreshedAt: nowIso(),
        metrics,
        warnings
      };
    } catch (error) {
      marketRecords[company.slug] = {
        source: "Yahoo Finance delayed chart",
        sourceUrl,
        currency: "USD",
        refreshedAt: nowIso(),
        metrics: {},
        warnings: [error instanceof Error ? error.message : String(error)]
      };
    }
  }

  for (const item of commoditySymbols) {
    await new Promise((resolve) => setTimeout(resolve, 110));

    try {
      const result = await fetchChart(item.symbol);
      const { close, timestamp } = getLatestClose(result);
      const changePercent = getChangePercent(result, close);
      const quoteMs = timestamp ? Date.parse(timestamp) : 0;
      const stale = Boolean(item.allowStale && quoteMs && Date.now() - quoteMs > 7 * oneDayMs);

      commodityRecords[item.commodity] = {
        price: roundPrice(close),
        changePercent,
        source: item.sourceLabel,
        sourceUrl: chartUrl(item.symbol),
        quoteTime: timestamp,
        refreshedAt: nowIso(),
        stale
      };
    } catch (error) {
      commodityRecords[item.commodity] = {
        price: 0,
        changePercent: 0,
        source: item.sourceLabel,
        sourceUrl: chartUrl(item.symbol),
        refreshedAt: nowIso(),
        stale: true,
        warnings: [error instanceof Error ? error.message : String(error)]
      };
    }
  }

  const generated = nowIso();

  await fs.writeFile(
    marketCachePath,
    `${JSON.stringify(
      {
        generatedAt: generated,
        expiresAt: new Date(Date.now() + oneDayMs).toISOString(),
        sourcePolicy:
          "Daily delayed prices are refreshed at most once per day from Yahoo Finance chart data. Market cap is recalculated only when an official SEC shares-outstanding fact exists; otherwise the static universe value remains in use.",
        records: marketRecords
      },
      null,
      2
    )}\n`
  );

  await fs.writeFile(
    commodityCachePath,
    `${JSON.stringify(
      {
        generatedAt: generated,
        expiresAt: new Date(Date.now() + oneDayMs).toISOString(),
        sourcePolicy:
          "Commodity tiles use delayed futures/alternative symbols where free chart data is available. Stale alternative symbols are retained with quote timestamps and should be replaced with licensed commodity feeds for production use.",
        records: commodityRecords
      },
      null,
      2
    )}\n`
  );

  console.log(`Market cache refreshed for ${Object.keys(marketRecords).length} companies and ${Object.keys(commodityRecords).length} commodity series.`);
}

refresh().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
