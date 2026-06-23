"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  commodities,
  commodityPrices,
  companies,
  type Commodity,
  type Company,
  type DevelopmentStage
} from "@/lib/data";
import { scoreCompanies, type CompanyScore } from "@/lib/scoring";

type SortKey =
  | "total"
  | "marketCap"
  | "enterpriseValue"
  | "evEbitda"
  | "fcfYield"
  | "aisc"
  | "reserveLife"
  | "insiderOwnership"
  | "dividendYield";

type SortDirection = "asc" | "desc";

type EnrichedCompany = {
  company: Company;
  score: CompanyScore;
};

const moneyFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1
});

const numberFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 1
});

function formatMoney(value: number) {
  return `$${moneyFormatter.format(value * 1_000_000)}`;
}

function formatPercent(value: number | null) {
  return value === null ? "N/A" : `${numberFormatter.format(value)}%`;
}

function formatMultiple(value: number | null) {
  return value === null ? "N/A" : `${numberFormatter.format(value)}x`;
}

function metricValue(company: Company, score: CompanyScore, key: SortKey) {
  if (key === "total") return score.total;
  return company[key] ?? Number.NEGATIVE_INFINITY;
}

function ShellCard({
  children,
  className = ""
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <section className={`rounded-lg border border-zincLine bg-zincPanel/85 ${className}`}>{children}</section>;
}

function CommodityTabs({
  activeCommodity,
  onSelect
}: {
  activeCommodity: Commodity;
  onSelect: (commodity: Commodity) => void;
}) {
  return (
    <div className="overflow-x-auto border-b border-zincLine">
      <div className="flex min-w-max">
        {commodities.map((commodity) => {
          const price = commodityPrices.find((item) => item.commodity === commodity);
          return (
            <button
              key={commodity}
              type="button"
              onClick={() => onSelect(commodity)}
              className={`border-r border-zincLine px-4 py-3 text-left transition hover:bg-zinc-900 ${
                activeCommodity === commodity ? "bg-zinc-100 text-zinc-950" : "text-zinc-300"
              }`}
            >
              <span className="block text-xs font-semibold uppercase tracking-wide">{commodity}</span>
              <span className="mt-1 block font-mono text-xs">
                {price ? `${price.price.toLocaleString("en-US")} ${price.unit}` : "N/A"}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ScoreBar({ value }: { value: number }) {
  const tone = value >= 75 ? "bg-terminalGreen" : value >= 55 ? "bg-caution" : "bg-red-400";

  return (
    <div className="flex items-center justify-end gap-2">
      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-zinc-800">
        <div className={`h-full ${tone}`} style={{ width: `${value}%` }} />
      </div>
      <span className="w-8 text-right font-mono">{value}</span>
    </div>
  );
}

function SortButton({
  label,
  sortKey,
  activeSort,
  direction,
  onSort
}: {
  label: string;
  sortKey: SortKey;
  activeSort: SortKey;
  direction: SortDirection;
  onSort: (key: SortKey) => void;
}) {
  const isActive = activeSort === sortKey;

  return (
    <button
      type="button"
      onClick={() => onSort(sortKey)}
      className="flex w-full items-center justify-end gap-1 text-right font-medium uppercase tracking-wide text-zinc-500 hover:text-zinc-100"
    >
      <span>{label}</span>
      <span className="w-3 text-zinc-400">{isActive ? (direction === "asc" ? "↑" : "↓") : ""}</span>
    </button>
  );
}

function RankingTable({
  rows,
  sortKey,
  sortDirection,
  onSort
}: {
  rows: EnrichedCompany[];
  sortKey: SortKey;
  sortDirection: SortDirection;
  onSort: (key: SortKey) => void;
}) {
  return (
    <ShellCard className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1120px] border-collapse text-xs">
          <thead>
            <tr className="border-b border-zincLine bg-zinc-950/80 text-zinc-500">
              <th className="px-3 py-2 text-left font-medium uppercase tracking-wide">Company</th>
              <th className="px-3 py-2 text-left font-medium uppercase tracking-wide">Ticker</th>
              <th className="px-3 py-2 text-left font-medium uppercase tracking-wide">Exch</th>
              <th className="px-3 py-2 text-left font-medium uppercase tracking-wide">Stage</th>
              <th className="px-3 py-2 text-left font-medium uppercase tracking-wide">Jurisdiction</th>
              <th className="px-3 py-2">
                <SortButton label="Mkt Cap" sortKey="marketCap" activeSort={sortKey} direction={sortDirection} onSort={onSort} />
              </th>
              <th className="px-3 py-2">
                <SortButton label="EV" sortKey="enterpriseValue" activeSort={sortKey} direction={sortDirection} onSort={onSort} />
              </th>
              <th className="px-3 py-2">
                <SortButton label="EV/EBITDA" sortKey="evEbitda" activeSort={sortKey} direction={sortDirection} onSort={onSort} />
              </th>
              <th className="px-3 py-2">
                <SortButton label="FCF Yield" sortKey="fcfYield" activeSort={sortKey} direction={sortDirection} onSort={onSort} />
              </th>
              <th className="px-3 py-2">
                <SortButton label="AISC" sortKey="aisc" activeSort={sortKey} direction={sortDirection} onSort={onSort} />
              </th>
              <th className="px-3 py-2">
                <SortButton label="Res Life" sortKey="reserveLife" activeSort={sortKey} direction={sortDirection} onSort={onSort} />
              </th>
              <th className="px-3 py-2">
                <SortButton label="Insider" sortKey="insiderOwnership" activeSort={sortKey} direction={sortDirection} onSort={onSort} />
              </th>
              <th className="px-3 py-2">
                <SortButton label="Div" sortKey="dividendYield" activeSort={sortKey} direction={sortDirection} onSort={onSort} />
              </th>
              <th className="px-3 py-2">
                <SortButton label="Score" sortKey="total" activeSort={sortKey} direction={sortDirection} onSort={onSort} />
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ company, score }) => (
              <tr key={company.slug} className="border-b border-zincLine/80 text-zinc-200 last:border-0 hover:bg-zinc-900/80">
                <td className="max-w-[220px] px-3 py-3">
                  <Link href={`/companies/${company.slug}`} className="font-medium text-zinc-50 hover:text-terminalGreen">
                    {company.company}
                  </Link>
                  <p className="mt-1 text-[11px] text-zinc-500">{company.country}</p>
                </td>
                <td className="px-3 py-3 font-mono text-caution">{company.ticker}</td>
                <td className="px-3 py-3 text-zinc-400">{company.exchange}</td>
                <td className="px-3 py-3">
                  <span className="rounded border border-zincLine px-2 py-1 text-[11px] text-zinc-300">{company.stage}</span>
                </td>
                <td className="px-3 py-3 text-zinc-300">
                  {company.jurisdiction}
                  <p className="mt-1 text-[11px] text-zinc-500">{company.jurisdictionRisk} risk</p>
                </td>
                <td className="px-3 py-3 text-right font-mono">{formatMoney(company.marketCap)}</td>
                <td className="px-3 py-3 text-right font-mono">{formatMoney(company.enterpriseValue)}</td>
                <td className="px-3 py-3 text-right font-mono">{formatMultiple(company.evEbitda)}</td>
                <td className="px-3 py-3 text-right font-mono">{formatPercent(company.fcfYield)}</td>
                <td className="px-3 py-3 text-right font-mono">
                  {company.aisc === null ? "N/A" : numberFormatter.format(company.aisc)}
                </td>
                <td className="px-3 py-3 text-right font-mono">{company.reserveLife}y</td>
                <td className="px-3 py-3 text-right font-mono">{formatPercent(company.insiderOwnership)}</td>
                <td className="px-3 py-3 text-right font-mono">{formatPercent(company.dividendYield)}</td>
                <td className="px-3 py-3">
                  <ScoreBar value={score.total} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ShellCard>
  );
}

export function Dashboard() {
  const [activeCommodity, setActiveCommodity] = useState<Commodity>("Silver");
  const [search, setSearch] = useState("");
  const [jurisdiction, setJurisdiction] = useState("All");
  const [exchange, setExchange] = useState("All");
  const [stage, setStage] = useState<DevelopmentStage | "All">("All");
  const [sortKey, setSortKey] = useState<SortKey>("total");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const scoredCompanies = useMemo(() => scoreCompanies(companies), []);

  const jurisdictions = useMemo(
    () => ["All", ...Array.from(new Set(companies.map((company) => company.jurisdiction))).sort()],
    []
  );
  const exchanges = useMemo(
    () => ["All", ...Array.from(new Set(companies.map((company) => company.exchange))).sort()],
    []
  );

  const rows = useMemo(() => {
    const query = search.trim().toLowerCase();

    return scoredCompanies
      .filter(({ company }) => company.commodity === activeCommodity)
      .filter(({ company }) => (query ? `${company.company} ${company.ticker}`.toLowerCase().includes(query) : true))
      .filter(({ company }) => (jurisdiction === "All" ? true : company.jurisdiction === jurisdiction))
      .filter(({ company }) => (exchange === "All" ? true : company.exchange === exchange))
      .filter(({ company }) => (stage === "All" ? true : company.stage === stage))
      .sort((a, b) => {
        const left = metricValue(a.company, a.score, sortKey);
        const right = metricValue(b.company, b.score, sortKey);
        return sortDirection === "asc" ? left - right : right - left;
      });
  }, [activeCommodity, exchange, jurisdiction, scoredCompanies, search, sortDirection, sortKey, stage]);

  const currentPrice = commodityPrices.find((price) => price.commodity === activeCommodity);
  const undervalued = rows
    .filter(({ company }) => company.evEbitda !== null || company.fcfYield !== null)
    .slice()
    .sort((a, b) => b.score.valuation - a.score.valuation)
    .slice(0, 3);
  const riskFlags = rows.flatMap(({ company }) =>
    company.riskFlags.slice(0, 2).map((flag) => ({
      flag,
      company
    }))
  );
  const watchlist = rows.slice(0, 5);

  function handleSort(nextKey: SortKey) {
    if (nextKey === sortKey) {
      setSortDirection((current) => (current === "asc" ? "desc" : "asc"));
      return;
    }

    setSortKey(nextKey);
    setSortDirection(nextKey === "aisc" || nextKey === "evEbitda" ? "asc" : "desc");
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-4 px-3 py-3 sm:px-5 lg:px-6">
        <header className="flex flex-col gap-3 border-b border-zincLine pb-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-terminalGreen">Mining Intelligence v2</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-50 sm:text-3xl">
              Global Mining Equity Screener
            </h1>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs sm:min-w-[420px]">
            <div className="border border-zincLine bg-zincPanel px-3 py-2">
              <p className="text-zinc-500">Coverage</p>
              <p className="mt-1 font-mono text-zinc-50">{companies.length} names</p>
            </div>
            <div className="border border-zincLine bg-zincPanel px-3 py-2">
              <p className="text-zinc-500">Active</p>
              <p className="mt-1 font-mono text-zinc-50">{activeCommodity}</p>
            </div>
            <div className="border border-zincLine bg-zincPanel px-3 py-2">
              <p className="text-zinc-500">Mode</p>
              <p className="mt-1 font-mono text-caution">Sample</p>
            </div>
          </div>
        </header>

        <ShellCard className="overflow-hidden">
          <CommodityTabs activeCommodity={activeCommodity} onSelect={setActiveCommodity} />
          <div className="grid gap-0 divide-y divide-zincLine lg:grid-cols-[1fr_300px] lg:divide-x lg:divide-y-0">
            <div className="grid gap-3 p-3 sm:grid-cols-2 xl:grid-cols-4">
              <label className="sm:col-span-2">
                <span className="mb-1 block text-xs uppercase tracking-wide text-zinc-500">Search</span>
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Company or ticker"
                  className="h-10 w-full rounded border border-zincLine bg-zinc-950 px-3 text-sm text-zinc-100 outline-none ring-terminalGreen/40 placeholder:text-zinc-600 focus:ring-2"
                />
              </label>
              <label>
                <span className="mb-1 block text-xs uppercase tracking-wide text-zinc-500">Jurisdiction</span>
                <select
                  value={jurisdiction}
                  onChange={(event) => setJurisdiction(event.target.value)}
                  className="h-10 w-full rounded border border-zincLine bg-zinc-950 px-3 text-sm text-zinc-100 outline-none focus:ring-2 focus:ring-terminalGreen/40"
                >
                  {jurisdictions.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>
              <label>
                <span className="mb-1 block text-xs uppercase tracking-wide text-zinc-500">Exchange</span>
                <select
                  value={exchange}
                  onChange={(event) => setExchange(event.target.value)}
                  className="h-10 w-full rounded border border-zincLine bg-zinc-950 px-3 text-sm text-zinc-100 outline-none focus:ring-2 focus:ring-terminalGreen/40"
                >
                  {exchanges.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>
              <label>
                <span className="mb-1 block text-xs uppercase tracking-wide text-zinc-500">Stage</span>
                <select
                  value={stage}
                  onChange={(event) => setStage(event.target.value as DevelopmentStage | "All")}
                  className="h-10 w-full rounded border border-zincLine bg-zinc-950 px-3 text-sm text-zinc-100 outline-none focus:ring-2 focus:ring-terminalGreen/40"
                >
                  <option>All</option>
                  <option>Producer</option>
                  <option>Developer</option>
                </select>
              </label>
            </div>
            <div className="p-3">
              <p className="text-xs uppercase tracking-wide text-zinc-500">Commodity tape</p>
              <div className="mt-2 flex items-end justify-between">
                <div>
                  <p className="font-mono text-2xl text-zinc-50">
                    {currentPrice ? currentPrice.price.toLocaleString("en-US") : "N/A"}
                  </p>
                  <p className="mt-1 text-xs text-zinc-500">{currentPrice?.unit}</p>
                </div>
                <p className={`font-mono text-sm ${currentPrice && currentPrice.changePercent >= 0 ? "text-terminalGreen" : "text-red-300"}`}>
                  {currentPrice ? `${currentPrice.changePercent > 0 ? "+" : ""}${currentPrice.changePercent}%` : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </ShellCard>

        <section className="grid gap-4 xl:grid-cols-[1fr_340px]">
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-zinc-50">{activeCommodity} rankings</h2>
                <p className="mt-1 text-xs text-zinc-500">Sortable valuation, quality, risk, and ownership metrics.</p>
              </div>
              <span className="border border-zincLine px-3 py-1 font-mono text-xs text-zinc-400">{rows.length} rows</span>
            </div>
            <RankingTable rows={rows} sortKey={sortKey} sortDirection={sortDirection} onSort={handleSort} />
          </div>

          <aside className="space-y-4">
            <ShellCard className="p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-zinc-50">Watchlist</h2>
                <span className="font-mono text-xs text-zinc-500">Top ranked</span>
              </div>
              <div className="mt-4 space-y-3">
                {watchlist.map(({ company, score }) => (
                  <Link key={company.slug} href={`/companies/${company.slug}`} className="flex items-center justify-between gap-3 hover:text-terminalGreen">
                    <span>
                      <span className="block text-sm font-medium text-zinc-100">{company.ticker}</span>
                      <span className="block text-xs text-zinc-500">{company.company}</span>
                    </span>
                    <span className="font-mono text-sm text-terminalGreen">{score.total}</span>
                  </Link>
                ))}
              </div>
            </ShellCard>

            <ShellCard className="p-4">
              <h2 className="text-sm font-semibold text-zinc-50">Top Undervalued</h2>
              <div className="mt-4 space-y-3">
                {undervalued.map(({ company, score }) => (
                  <div key={company.slug} className="border-b border-zincLine pb-3 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between gap-3">
                      <Link href={`/companies/${company.slug}`} className="text-sm font-medium text-zinc-100 hover:text-terminalGreen">
                        {company.ticker}
                      </Link>
                      <span className="font-mono text-sm text-caution">{score.valuation}</span>
                    </div>
                    <p className="mt-1 text-xs text-zinc-500">
                      {formatMultiple(company.evEbitda)} EV/EBITDA · {formatPercent(company.fcfYield)} FCF yield
                    </p>
                  </div>
                ))}
              </div>
            </ShellCard>

            <ShellCard className="p-4">
              <h2 className="text-sm font-semibold text-zinc-50">Risk Flags</h2>
              <div className="mt-4 space-y-3">
                {riskFlags.slice(0, 6).map(({ company, flag }) => (
                  <div key={`${company.slug}-${flag}`} className="border-l-2 border-red-400/70 pl-3">
                    <p className="text-sm text-zinc-200">{flag}</p>
                    <p className="mt-1 font-mono text-xs text-zinc-500">{company.ticker} · {company.jurisdiction}</p>
                  </div>
                ))}
              </div>
            </ShellCard>
          </aside>
        </section>
      </div>
    </main>
  );
}
