"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  commodities,
  commodityPrices,
  companies,
  type Commodity,
  type Company,
  type DevelopmentStage
} from "@/lib/data";
import {
  getInvestorModeConfig,
  investorModes,
  scoreCompanies,
  type CompanyScore,
  type InvestorMode
} from "@/lib/scoring";

type SortKey =
  | keyof Pick<
      Company,
      | "marketCap"
      | "enterpriseValue"
      | "evEbitda"
      | "fcfYield"
      | "aisc"
      | "reserveLife"
      | "insiderOwnership"
      | "dividendYield"
      | "cash"
      | "netDebt"
      | "production"
    >
  | keyof CompanyScore;

type SortDirection = "asc" | "desc";

type EnrichedCompany = {
  company: Company;
  score: CompanyScore;
};

type Column = {
  key: SortKey;
  label: string;
  align?: "left" | "right";
  render: (row: EnrichedCompany) => React.ReactNode;
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

function formatNumber(value: number | null) {
  return value === null ? "N/A" : numberFormatter.format(value);
}

function metricValue(company: Company, score: CompanyScore, key: SortKey) {
  if (key in score) return score[key as keyof CompanyScore];
  const value = company[key as keyof Company];
  return typeof value === "number" ? value : Number.NEGATIVE_INFINITY;
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

function ScoreBar({ value, strong = false }: { value: number; strong?: boolean }) {
  const tone = value >= 75 ? "bg-terminalGreen" : value >= 55 ? "bg-caution" : "bg-red-400";

  return (
    <div className="flex items-center justify-end gap-2">
      <div className={`${strong ? "w-20" : "w-16"} h-1.5 overflow-hidden rounded-full bg-zinc-800`}>
        <div className={`h-full ${tone} transition-all duration-300`} style={{ width: `${value}%` }} />
      </div>
      <span className={`${strong ? "text-zinc-50" : "text-zinc-200"} w-8 text-right font-mono`}>{value}</span>
    </div>
  );
}

function ModeSwitch({
  activeMode,
  onSelect
}: {
  activeMode: InvestorMode;
  onSelect: (mode: InvestorMode) => void;
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-3">
      {investorModes.map((item) => (
        <button
          key={item.mode}
          type="button"
          onClick={() => onSelect(item.mode)}
          className={`rounded-lg border px-4 py-3 text-left transition duration-200 ${
            activeMode === item.mode
              ? "border-terminalGreen/70 bg-terminalGreen/10 text-zinc-50 shadow-glow"
              : "border-zincLine bg-zinc-950/70 text-zinc-400 hover:border-zinc-600 hover:bg-zinc-900"
          }`}
        >
          <span className="block text-sm font-semibold">{item.mode}</span>
          <span className="mt-1 block text-xs text-zinc-500">{item.shortLabel} lens</span>
        </button>
      ))}
    </div>
  );
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
              className={`border-r border-zincLine px-4 py-3 text-left transition duration-200 hover:bg-zinc-900 ${
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

function getColumns(mode: InvestorMode): Column[] {
  const scoreColumn = getInvestorModeConfig(mode);
  const primaryColumn: Column = {
    key: scoreColumn.primaryScore,
    label: scoreColumn.primaryScoreLabel,
    align: "right",
    render: ({ score }) => <ScoreBar value={score[scoreColumn.primaryScore]} strong />
  };

  const sharedStart: Column[] = [
    {
      key: "marketCap",
      label: "Company",
      align: "left",
      render: ({ company }) => (
        <div className="max-w-[220px]">
          <Link href={`/companies/${company.slug}`} className="font-medium text-zinc-50 hover:text-terminalGreen">
            {company.company}
          </Link>
          <p className="mt-1 font-mono text-[11px] text-caution">{company.ticker} · {company.exchange}</p>
        </div>
      )
    },
    {
      key: "jurisdiction",
      label: "Jurisdiction",
      align: "left",
      render: ({ company }) => (
        <span>
          <span className="block text-zinc-300">{company.jurisdiction}</span>
          <span className="mt-1 block text-[11px] text-zinc-500">{company.stage} · {company.jurisdictionRisk} risk</span>
        </span>
      )
    } as Column,
    primaryColumn
  ];

  if (mode === "Rick Rule") {
    return [
      ...sharedStart,
      {
        key: "balanceSheet",
        label: "Bal Sheet",
        align: "right",
        render: ({ score }) => <ScoreBar value={score.balanceSheet} />
      },
      {
        key: "cost",
        label: "Cost",
        align: "right",
        render: ({ score }) => <ScoreBar value={score.cost} />
      },
      {
        key: "jurisdiction",
        label: "Jur Score",
        align: "right",
        render: ({ score }) => <ScoreBar value={score.jurisdiction} />
      },
      {
        key: "reserveLife",
        label: "Res Life",
        align: "right",
        render: ({ company }) => <span className="font-mono">{company.reserveLife}y</span>
      },
      {
        key: "netDebt",
        label: "Net Debt",
        align: "right",
        render: ({ company }) => <span className="font-mono">{formatMoney(company.netDebt)}</span>
      },
      {
        key: "aisc",
        label: "AISC",
        align: "right",
        render: ({ company }) => <span className="font-mono">{formatNumber(company.aisc)}</span>
      }
    ];
  }

  if (mode === "Eric Sprott") {
    return [
      ...sharedStart,
      {
        key: "growth",
        label: "Growth",
        align: "right",
        render: ({ score }) => <ScoreBar value={score.growth} />
      },
      {
        key: "insiderOwnership",
        label: "Insider",
        align: "right",
        render: ({ company }) => <span className="font-mono">{formatPercent(company.insiderOwnership)}</span>
      },
      {
        key: "catalysts",
        label: "Catalysts",
        align: "right",
        render: ({ score }) => <ScoreBar value={score.catalysts} />
      },
      {
        key: "marketCap",
        label: "Mkt Cap",
        align: "right",
        render: ({ company }) => <span className="font-mono">{formatMoney(company.marketCap)}</span>
      },
      {
        key: "evEbitda",
        label: "EV/EBITDA",
        align: "right",
        render: ({ company }) => <span className="font-mono">{formatMultiple(company.evEbitda)}</span>
      },
      {
        key: "production",
        label: "Output",
        align: "right",
        render: ({ company }) => (
          <span className="font-mono">
            {formatNumber(company.production)} {company.productionUnit}
          </span>
        )
      }
    ];
  }

  return [
    ...sharedStart,
    {
      key: "evEbitda",
      label: "EV/EBITDA",
      align: "right",
      render: ({ company }) => <span className="font-mono">{formatMultiple(company.evEbitda)}</span>
    },
    {
      key: "fcfYield",
      label: "FCF Yield",
      align: "right",
      render: ({ company }) => <span className="font-mono">{formatPercent(company.fcfYield)}</span>
    },
    {
      key: "aisc",
      label: "AISC",
      align: "right",
      render: ({ company }) => <span className="font-mono">{formatNumber(company.aisc)}</span>
    },
    {
      key: "reserveLife",
      label: "Res Life",
      align: "right",
      render: ({ company }) => <span className="font-mono">{company.reserveLife}y</span>
    },
    {
      key: "insiderOwnership",
      label: "Insider",
      align: "right",
      render: ({ company }) => <span className="font-mono">{formatPercent(company.insiderOwnership)}</span>
    },
    {
      key: "dividendYield",
      label: "Div",
      align: "right",
      render: ({ company }) => <span className="font-mono">{formatPercent(company.dividendYield)}</span>
    }
  ];
}

function RankingTable({
  rows,
  columns,
  sortKey,
  sortDirection,
  onSort
}: {
  rows: EnrichedCompany[];
  columns: Column[];
  sortKey: SortKey;
  sortDirection: SortDirection;
  onSort: (key: SortKey) => void;
}) {
  return (
    <ShellCard className="overflow-hidden transition-all duration-300">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1040px] border-collapse text-xs">
          <thead>
            <tr className="border-b border-zincLine bg-zinc-950/80 text-zinc-500">
              {columns.map((column) => (
                <th
                  key={`${column.key}-${column.label}`}
                  className={`px-3 py-2 ${column.align === "left" ? "text-left" : "text-right"}`}
                >
                  {column.align === "left" ? (
                    <span className="font-medium uppercase tracking-wide text-zinc-500">{column.label}</span>
                  ) : (
                    <SortButton
                      label={column.label}
                      sortKey={column.key}
                      activeSort={sortKey}
                      direction={sortDirection}
                      onSort={onSort}
                    />
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.company.slug}
                className="border-b border-zincLine/80 text-zinc-200 transition-colors duration-150 last:border-0 hover:bg-zinc-900/80"
              >
                {columns.map((column) => (
                  <td
                    key={`${row.company.slug}-${column.key}-${column.label}`}
                    className={`px-3 py-3 ${column.align === "left" ? "text-left" : "text-right"}`}
                  >
                    {column.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ShellCard>
  );
}

export function Dashboard() {
  const [activeMode, setActiveMode] = useState<InvestorMode>("Default");
  const modeConfig = getInvestorModeConfig(activeMode);
  const [activeCommodity, setActiveCommodity] = useState<Commodity>("Silver");
  const [search, setSearch] = useState("");
  const [jurisdiction, setJurisdiction] = useState("All");
  const [exchange, setExchange] = useState("All");
  const [stage, setStage] = useState<DevelopmentStage | "All">(modeConfig.defaultStage);
  const [sortKey, setSortKey] = useState<SortKey>(modeConfig.primaryScore);
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  useEffect(() => {
    const nextConfig = getInvestorModeConfig(activeMode);
    setStage(nextConfig.defaultStage);
    setJurisdiction("All");
    setExchange("All");
    setSortKey(nextConfig.primaryScore);
    setSortDirection("desc");
  }, [activeMode]);

  const scoredCompanies = useMemo(() => scoreCompanies(companies, activeMode), [activeMode]);
  const columns = useMemo(() => getColumns(activeMode), [activeMode]);

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
      .filter(({ score }) => (modeConfig.filterWeakBalanceSheets ? score.balanceSheet >= 55 : true))
      .sort((a, b) => {
        const left = metricValue(a.company, a.score, sortKey);
        const right = metricValue(b.company, b.score, sortKey);
        return sortDirection === "asc" ? left - right : right - left;
      });
  }, [
    activeCommodity,
    exchange,
    jurisdiction,
    modeConfig.filterWeakBalanceSheets,
    scoredCompanies,
    search,
    sortDirection,
    sortKey,
    stage
  ]);

  const currentPrice = commodityPrices.find((price) => price.commodity === activeCommodity);
  const watchlist = rows.slice(0, 5);
  const highlighted = rows
    .slice()
    .sort((a, b) => {
      const key = modeConfig.primaryScore;
      return b.score[key] - a.score[key];
    })
    .slice(0, 3);
  const riskFlags = rows.flatMap(({ company }) =>
    company.riskFlags.slice(0, 2).map((flag) => ({
      flag,
      company
    }))
  );

  function handleSort(nextKey: SortKey) {
    if (nextKey === sortKey) {
      setSortDirection((current) => (current === "asc" ? "desc" : "asc"));
      return;
    }

    setSortKey(nextKey);
    setSortDirection(nextKey === "aisc" || nextKey === "evEbitda" || nextKey === "netDebt" ? "asc" : "desc");
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-4 px-3 py-3 sm:px-5 lg:px-6">
        <header className="flex flex-col gap-4 border-b border-zincLine pb-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-terminalGreen">Mining Intelligence v2</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-50 sm:text-3xl">
              Global Mining Equity Screener
            </h1>
          </div>
          <div className="w-full xl:max-w-[620px]">
            <ModeSwitch activeMode={activeMode} onSelect={setActiveMode} />
          </div>
        </header>

        <ShellCard className="p-4 transition-all duration-300">
          <div className="grid gap-4 lg:grid-cols-[1fr_360px] lg:items-center">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded border border-terminalGreen/40 bg-terminalGreen/10 px-2 py-1 text-xs font-semibold uppercase tracking-wide text-terminalGreen">
                  {activeMode}
                </span>
                <span className="rounded border border-zincLine px-2 py-1 font-mono text-xs text-zinc-400">
                  {modeConfig.primaryScoreLabel} ranked
                </span>
                {modeConfig.filterWeakBalanceSheets ? (
                  <span className="rounded border border-caution/40 bg-caution/10 px-2 py-1 text-xs text-caution">
                    Weak balance sheets excluded
                  </span>
                ) : null}
              </div>
              <p className="mt-3 max-w-4xl text-sm leading-6 text-zinc-300">{modeConfig.explanation}</p>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="border border-zincLine bg-zinc-950 px-3 py-2">
                <p className="text-zinc-500">Coverage</p>
                <p className="mt-1 font-mono text-zinc-50">{companies.length} names</p>
              </div>
              <div className="border border-zincLine bg-zinc-950 px-3 py-2">
                <p className="text-zinc-500">Rows</p>
                <p className="mt-1 font-mono text-zinc-50">{rows.length}</p>
              </div>
              <div className="border border-zincLine bg-zinc-950 px-3 py-2">
                <p className="text-zinc-500">Default</p>
                <p className="mt-1 font-mono text-caution">{modeConfig.defaultStage}</p>
              </div>
            </div>
          </div>
        </ShellCard>

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
                  className="h-10 w-full rounded border border-zincLine bg-zinc-950 px-3 text-sm text-zinc-100 outline-none ring-terminalGreen/40 transition placeholder:text-zinc-600 focus:ring-2"
                />
              </label>
              <label>
                <span className="mb-1 block text-xs uppercase tracking-wide text-zinc-500">Jurisdiction</span>
                <select
                  value={jurisdiction}
                  onChange={(event) => setJurisdiction(event.target.value)}
                  className="h-10 w-full rounded border border-zincLine bg-zinc-950 px-3 text-sm text-zinc-100 outline-none transition focus:ring-2 focus:ring-terminalGreen/40"
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
                  className="h-10 w-full rounded border border-zincLine bg-zinc-950 px-3 text-sm text-zinc-100 outline-none transition focus:ring-2 focus:ring-terminalGreen/40"
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
                  className="h-10 w-full rounded border border-zincLine bg-zinc-950 px-3 text-sm text-zinc-100 outline-none transition focus:ring-2 focus:ring-terminalGreen/40"
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
                <p className="mt-1 text-xs text-zinc-500">{modeConfig.tableDescription}</p>
              </div>
              <span className="border border-zincLine px-3 py-1 font-mono text-xs text-zinc-400">{rows.length} rows</span>
            </div>
            <RankingTable rows={rows} columns={columns} sortKey={sortKey} sortDirection={sortDirection} onSort={handleSort} />
          </div>

          <aside className="space-y-4">
            <ShellCard className="p-4 transition-all duration-300">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-zinc-50">Watchlist</h2>
                <span className="font-mono text-xs text-zinc-500">{modeConfig.primaryScoreLabel}</span>
              </div>
              <div className="mt-4 space-y-3">
                {watchlist.map(({ company, score }) => (
                  <Link key={company.slug} href={`/companies/${company.slug}`} className="flex items-center justify-between gap-3 hover:text-terminalGreen">
                    <span>
                      <span className="block text-sm font-medium text-zinc-100">{company.ticker}</span>
                      <span className="block text-xs text-zinc-500">{company.company}</span>
                    </span>
                    <span className="font-mono text-sm text-terminalGreen">{score[modeConfig.primaryScore]}</span>
                  </Link>
                ))}
              </div>
            </ShellCard>

            <ShellCard className="p-4 transition-all duration-300">
              <h2 className="text-sm font-semibold text-zinc-50">{modeConfig.topListTitle}</h2>
              <p className="mt-1 text-xs text-zinc-500">{modeConfig.topListDescription}</p>
              <div className="mt-4 space-y-3">
                {highlighted.map(({ company, score }) => (
                  <div key={company.slug} className="border-b border-zincLine pb-3 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between gap-3">
                      <Link href={`/companies/${company.slug}`} className="text-sm font-medium text-zinc-100 hover:text-terminalGreen">
                        {company.ticker}
                      </Link>
                      <span className="font-mono text-sm text-caution">{score[modeConfig.primaryScore]}</span>
                    </div>
                    <p className="mt-1 text-xs text-zinc-500">
                      {activeMode === "Rick Rule"
                        ? `${score.balanceSheet} balance · ${score.cost} cost · ${company.reserveLife}y reserves`
                        : activeMode === "Eric Sprott"
                          ? `${score.growth} growth · ${score.catalysts} catalysts · ${formatPercent(company.insiderOwnership)} insider`
                          : `${formatMultiple(company.evEbitda)} EV/EBITDA · ${formatPercent(company.fcfYield)} FCF yield`}
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
                    <p className="mt-1 font-mono text-xs text-zinc-500">
                      {company.ticker} · {company.jurisdiction}
                    </p>
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
