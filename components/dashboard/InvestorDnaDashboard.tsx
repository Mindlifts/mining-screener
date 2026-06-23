"use client";

import { useEffect, useMemo, useState } from "react";
import {
  commodities,
  commodityPrices,
  companies,
  type Commodity,
  type Company,
  type DevelopmentStage
} from "@/data/mining-universe";
import { ModeNavigation } from "@/components/dashboard/ModeNavigation";
import { MobileScreenerCards } from "@/components/dashboard/MobileScreenerCards";
import {
  CompanyCell,
  ScorePill,
  ScreenerTable,
  type Column,
  type EnrichedCompany,
  type SortDirection,
  type SortKey
} from "@/components/dashboard/ScreenerTable";
import {
  ComparisonPanel,
  ConsensusPanel,
  OpportunityPanel
} from "@/components/dashboard/Panels";
import {
  defaultCustomWeights,
  getInvestorModeConfig,
  scoreCompanies,
  type InvestorMode,
  type ScoreFactor,
  type ScoreWeights
} from "@/lib/scoring";
import {
  formatMoney,
  formatMultiple,
  formatNumber,
  formatPercent
} from "@/components/dashboard/formatters";

const customFactors: Array<{ key: ScoreFactor; label: string }> = [
  { key: "survival", label: "Survival" },
  { key: "torque", label: "Torque" },
  { key: "valuation", label: "Valuation" },
  { key: "management", label: "Management" },
  { key: "jurisdiction", label: "Jurisdiction" },
  { key: "catalysts", label: "Catalysts" },
  { key: "macro", label: "Macro" }
];

function ShellCard({
  children,
  className = ""
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <section className={`w-full max-w-full overflow-hidden rounded-lg border border-zincLine bg-zincPanel/85 ${className}`}>{children}</section>;
}

function metricValue(company: Company, score: EnrichedCompany["score"], key: SortKey) {
  if (key in score) return score[key as keyof typeof score];
  const value = company[key as keyof Company];
  return typeof value === "number" ? value : Number.NEGATIVE_INFINITY;
}

function getColumns(activeMode: InvestorMode): Column[] {
  const modeConfig = getInvestorModeConfig(activeMode);
  const primaryColumn: Column = {
    key: modeConfig.primaryScore,
    label: modeConfig.shortLabel,
    align: "right",
    render: ({ score }) => <ScorePill value={score[modeConfig.primaryScore]} strong />
  };
  const base: Column[] = [
    { key: "marketCap", label: "Company", align: "left", render: ({ company }) => <CompanyCell company={company} /> },
    {
      key: "commodity",
      label: "Asset",
      align: "left",
      render: ({ company }) => (
        <span>
          <span className="block text-zinc-300">{company.commodity}</span>
          <span className="mt-1 block text-[11px] text-zinc-500">{company.stage} · {company.jurisdictionRisk} risk</span>
        </span>
      )
    },
    primaryColumn
  ];

  if (activeMode === "Rick Rule") {
    return [
      ...base,
      { key: "balanceSheet", label: "Bal Sheet", align: "right", render: ({ score }) => <ScorePill value={score.balanceSheet} /> },
      { key: "cost", label: "Cost", align: "right", render: ({ score }) => <ScorePill value={score.cost} /> },
      { key: "jurisdiction", label: "Jur", align: "right", render: ({ score }) => <ScorePill value={score.jurisdiction} /> },
      { key: "reserveLife", label: "Res Life", align: "right", render: ({ company }) => <span className="font-mono">{company.reserveLife}y</span> },
      { key: "netDebt", label: "Net Debt", align: "right", render: ({ company }) => <span className="font-mono">{formatMoney(company.netDebt)}</span> },
      { key: "marginOfSafety", label: "MoS", align: "right", render: ({ company }) => <span className="font-mono">{company.marginOfSafety}</span> }
    ];
  }

  if (activeMode === "Eric Sprott") {
    return [
      ...base,
      { key: "commodityLeverage", label: "Leverage", align: "right", render: ({ company }) => <span className="font-mono">{company.commodityLeverage}</span> },
      { key: "insiderOwnership", label: "Insider", align: "right", render: ({ company }) => <span className="font-mono">{formatPercent(company.insiderOwnership)}</span> },
      { key: "catalysts", label: "Catalysts", align: "right", render: ({ score }) => <ScorePill value={score.catalysts} /> },
      { key: "resourceScale", label: "Resource", align: "right", render: ({ company }) => <span className="font-mono">{company.resourceScale}</span> },
      { key: "marketCap", label: "Mkt Cap", align: "right", render: ({ company }) => <span className="font-mono">{formatMoney(company.marketCap)}</span> },
      { key: "torque", label: "10x", align: "right", render: ({ score }) => <ScorePill value={score.torque} /> }
    ];
  }

  if (activeMode === "Ross Beaty") {
    return [
      ...base,
      { key: "managementQuality", label: "Mgmt", align: "right", render: ({ company }) => <span className="font-mono">{company.managementQuality}</span> },
      { key: "executionTrackRecord", label: "Execution", align: "right", render: ({ company }) => <span className="font-mono">{company.executionTrackRecord}</span> },
      { key: "mineBuildingTrackRecord", label: "Builder", align: "right", render: ({ company }) => <span className="font-mono">{company.mineBuildingTrackRecord}</span> },
      { key: "capitalAllocation", label: "Capital", align: "right", render: ({ company }) => <span className="font-mono">{company.capitalAllocation}</span> },
      { key: "reserveLife", label: "Res Life", align: "right", render: ({ company }) => <span className="font-mono">{company.reserveLife}y</span> },
      { key: "management", label: "DNA", align: "right", render: ({ score }) => <ScorePill value={score.management} /> }
    ];
  }

  if (activeMode === "Tavi Costa") {
    return [
      ...base,
      { key: "macroCycleScore", label: "Macro", align: "right", render: ({ company }) => <span className="font-mono">{company.macroCycleScore}</span> },
      { key: "commodityCycle", label: "Cycle", align: "right", render: ({ score }) => <ScorePill value={score.commodityCycle} /> },
      { key: "realRatesSensitivity", label: "Real Rates", align: "right", render: ({ company }) => <span className="font-mono">{company.realRatesSensitivity}</span> },
      { key: "commodityLeverage", label: "Beta", align: "right", render: ({ company }) => <span className="font-mono">{company.commodityLeverage}</span> },
      { key: "fcfYield", label: "FCF", align: "right", render: ({ company }) => <span className="font-mono">{formatPercent(company.fcfYield)}</span> },
      { key: "marketCap", label: "Liquidity", align: "right", render: ({ company }) => <span className="font-mono">{formatMoney(company.marketCap)}</span> }
    ];
  }

  if (activeMode === "Lobo Tigre") {
    return [
      ...base,
      { key: "navDiscount", label: "NAV Disc", align: "right", render: ({ company }) => <span className="font-mono">{company.navDiscount}%</span> },
      { key: "evResource", label: "EV/Resource", align: "right", render: ({ company }) => <span className="font-mono">{company.evResource}</span> },
      { key: "neglectedScore", label: "Neglected", align: "right", render: ({ company }) => <span className="font-mono">{company.neglectedScore}</span> },
      { key: "contrarian", label: "Contrarian", align: "right", render: ({ score }) => <ScorePill value={score.contrarian} /> },
      { key: "evEbitda", label: "EV/EBITDA", align: "right", render: ({ company }) => <span className="font-mono">{formatMultiple(company.evEbitda)}</span> },
      { key: "marginOfSafety", label: "MoS", align: "right", render: ({ company }) => <span className="font-mono">{company.marginOfSafety}</span> }
    ];
  }

  return [
    ...base,
    { key: "survival", label: "Survival", align: "right", render: ({ score }) => <ScorePill value={score.survival} /> },
    { key: "torque", label: "Torque", align: "right", render: ({ score }) => <ScorePill value={score.torque} /> },
    { key: "valuation", label: "Value", align: "right", render: ({ score }) => <ScorePill value={score.valuation} /> },
    { key: "management", label: "Mgmt", align: "right", render: ({ score }) => <ScorePill value={score.management} /> },
    { key: "macro", label: "Macro", align: "right", render: ({ score }) => <ScorePill value={score.macro} /> },
    { key: "catalysts", label: "Catalysts", align: "right", render: ({ score }) => <ScorePill value={score.catalysts} /> }
  ];
}

function CustomWeightPanel({
  weights,
  onChange
}: {
  weights: ScoreWeights;
  onChange: (weights: ScoreWeights) => void;
}) {
  return (
    <ShellCard className="p-4">
      <h2 className="text-sm font-semibold text-zinc-50">Custom Weight Builder</h2>
      <p className="mt-1 text-xs text-zinc-500">Adjust factor weights to build a personalized investor DNA ranking.</p>
      <div className="mt-4 grid min-w-0 grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-7">
        {customFactors.map((factor) => (
          <label key={factor.key} className="min-w-0 rounded border border-zincLine bg-zinc-950/70 p-3">
            <span className="flex min-w-0 items-center justify-between gap-2 text-xs">
              <span className="truncate uppercase tracking-wide text-zinc-500">{factor.label}</span>
              <span className="font-mono text-zinc-100">{weights[factor.key]}</span>
            </span>
            <input
              type="range"
              min="0"
              max="40"
              value={weights[factor.key]}
              onChange={(event) => onChange({ ...weights, [factor.key]: Number(event.target.value) })}
              className="mt-3 w-full accent-[#9de58b]"
            />
          </label>
        ))}
      </div>
    </ShellCard>
  );
}

export function InvestorDnaDashboard() {
  const [activeMode, setActiveMode] = useState<InvestorMode>("Rick Rule");
  const [commodity, setCommodity] = useState<Commodity | "All">("All");
  const [stage, setStage] = useState<DevelopmentStage | "All">("Producer");
  const [exchange, setExchange] = useState("All");
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("survival");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [customWeights, setCustomWeights] = useState<ScoreWeights>(defaultCustomWeights);

  const modeConfig = getInvestorModeConfig(activeMode);

  useEffect(() => {
    const nextConfig = getInvestorModeConfig(activeMode);
    setCommodity(nextConfig.defaultCommodity);
    setStage(nextConfig.defaultStage);
    setExchange("All");
    setSortKey(nextConfig.defaultSort);
    setSortDirection("desc");
  }, [activeMode]);

  const scoredCompanies = useMemo(
    () => scoreCompanies(companies, activeMode, customWeights),
    [activeMode, customWeights]
  );
  const columns = useMemo(() => getColumns(activeMode), [activeMode]);
  const exchanges = useMemo(
    () => ["All", ...Array.from(new Set(companies.map((company) => company.exchange))).sort()],
    []
  );

  const rows = useMemo(() => {
    const query = search.trim().toLowerCase();

    return scoredCompanies
      .filter(({ company }) => (commodity === "All" ? true : company.commodity === commodity))
      .filter(({ company }) => (stage === "All" ? true : company.stage === stage))
      .filter(({ company }) => (exchange === "All" ? true : company.exchange === exchange))
      .filter(({ company }) => (query ? `${company.company} ${company.ticker}`.toLowerCase().includes(query) : true))
      .filter(({ score }) => (modeConfig.minBalanceSheet ? score.balanceSheet >= modeConfig.minBalanceSheet : true))
      .sort((a, b) => {
        const left = metricValue(a.company, a.score, sortKey);
        const right = metricValue(b.company, b.score, sortKey);
        return sortDirection === "asc" ? left - right : right - left;
      });
  }, [commodity, exchange, modeConfig.minBalanceSheet, scoredCompanies, search, sortDirection, sortKey, stage]);

  const topRows = rows
    .slice()
    .sort((a, b) => b.score[modeConfig.primaryScore] - a.score[modeConfig.primaryScore]);

  function handleSort(nextKey: SortKey) {
    if (nextKey === sortKey) {
      setSortDirection((current) => (current === "asc" ? "desc" : "asc"));
      return;
    }

    setSortKey(nextKey);
    setSortDirection(nextKey === "netDebt" || nextKey === "evResource" || nextKey === "evEbitda" ? "asc" : "desc");
  }

  return (
    <main className="min-h-screen w-full max-w-full overflow-x-hidden bg-zinc-950 text-zinc-100">
      <div className="mx-auto flex w-full max-w-[1540px] flex-col gap-4 overflow-hidden px-3 py-3 sm:px-5 lg:px-6">
        <header className="space-y-4 border-b border-zincLine pb-4">
          <div className="flex min-w-0 flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-terminalGreen">
                Version 3 · Investor DNA Platform
              </p>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-50 sm:text-3xl">
                Mining Framework Screener
              </h1>
            </div>
            <div className="grid w-full min-w-0 grid-cols-1 gap-2 text-xs sm:grid-cols-3 xl:max-w-[460px]">
              <div className="min-w-0 border border-zincLine bg-zincPanel px-3 py-2">
                <p className="text-zinc-500">Universe</p>
                <p className="mt-1 font-mono text-zinc-50">{companies.length} names</p>
              </div>
              <div className="min-w-0 border border-zincLine bg-zincPanel px-3 py-2">
                <p className="text-zinc-500">Visible</p>
                <p className="mt-1 font-mono text-zinc-50">{rows.length}</p>
              </div>
              <div className="min-w-0 border border-zincLine bg-zincPanel px-3 py-2">
                <p className="text-zinc-500">Data</p>
                <p className="mt-1 truncate font-mono text-caution">Mock API-ready</p>
              </div>
            </div>
          </div>
          <ModeNavigation activeMode={activeMode} onSelect={setActiveMode} />
        </header>

        <ShellCard className="p-4 transition-all duration-300">
          <div className="grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(280px,380px)] xl:items-center">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded border border-terminalGreen/40 bg-terminalGreen/10 px-2 py-1 text-xs font-semibold uppercase tracking-wide text-terminalGreen">
                  {activeMode}
                </span>
                <span className="rounded border border-zincLine px-2 py-1 font-mono text-xs text-zinc-400">
                  Ranking: {modeConfig.shortLabel}
                </span>
                {modeConfig.minBalanceSheet ? (
                  <span className="rounded border border-caution/40 bg-caution/10 px-2 py-1 text-xs text-caution">
                    Weak balance sheets excluded
                  </span>
                ) : null}
              </div>
              <p className="mt-3 max-w-4xl text-sm leading-6 text-zinc-300">{modeConfig.explanation}</p>
            </div>
            <div className="grid min-w-0 grid-cols-1 gap-2 text-xs sm:grid-cols-2">
              {commodityPrices.map((price) => (
                <div key={price.commodity} className="min-w-0 border border-zincLine bg-zinc-950 px-3 py-2">
                  <p className="truncate text-zinc-500">{price.commodity}</p>
                  <p className="mt-1 font-mono text-zinc-50">{price.price.toLocaleString("en-US")}</p>
                  <p className={`mt-1 font-mono ${price.changePercent >= 0 ? "text-terminalGreen" : "text-red-300"}`}>
                    {price.changePercent > 0 ? "+" : ""}
                    {price.changePercent}%
                  </p>
                </div>
              ))}
            </div>
          </div>
        </ShellCard>

        {activeMode === "Custom" ? <CustomWeightPanel weights={customWeights} onChange={setCustomWeights} /> : null}

        <ShellCard className="sticky top-0 z-20 p-3 shadow-glow lg:static lg:shadow-none">
          <div className="grid min-w-0 grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
            <label className="min-w-0 md:col-span-2">
              <span className="mb-1 block text-xs uppercase tracking-wide text-zinc-500">Search</span>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Company or ticker"
                className="h-10 w-full rounded border border-zincLine bg-zinc-950 px-3 text-sm text-zinc-100 outline-none ring-terminalGreen/40 transition placeholder:text-zinc-600 focus:ring-2"
              />
            </label>
            <label className="min-w-0">
              <span className="mb-1 block text-xs uppercase tracking-wide text-zinc-500">Commodity</span>
              <select
                value={commodity}
                onChange={(event) => setCommodity(event.target.value as Commodity | "All")}
                className="h-10 w-full rounded border border-zincLine bg-zinc-950 px-3 text-sm text-zinc-100 outline-none transition focus:ring-2 focus:ring-terminalGreen/40"
              >
                <option>All</option>
                {commodities.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <label className="min-w-0">
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
            <label className="min-w-0">
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
          </div>
        </ShellCard>

        <section className="grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(300px,360px)]">
          <div className="min-w-0 space-y-3">
            <MobileScreenerCards
              rows={rows}
              activeMode={activeMode}
              primaryLabel={modeConfig.shortLabel}
              primaryScore={modeConfig.primaryScore}
            />

            <div className="hidden items-center justify-between gap-3 lg:flex">
              <div>
                <h2 className="text-base font-semibold text-zinc-50">{activeMode} ranking table</h2>
                <p className="mt-1 text-xs text-zinc-500">
                  Mode-specific factors, table columns, and default rankings driven by the active investor framework.
                </p>
              </div>
              <span className="border border-zincLine px-3 py-1 font-mono text-xs text-zinc-400">{rows.length} rows</span>
            </div>
            <div className="hidden lg:block">
              <ScreenerTable
                rows={rows}
                columns={columns}
                sortKey={sortKey}
                sortDirection={sortDirection}
                onSort={handleSort}
              />
            </div>
          </div>

          <aside className="min-w-0 space-y-4">
            <OpportunityPanel
              rows={topRows}
              title={modeConfig.topListTitle}
              subtitle={modeConfig.topListDescription}
              activeMode={activeMode}
            />
            <ConsensusPanel companies={companies} customWeights={customWeights} />
            <ComparisonPanel rows={rows} />
          </aside>
        </section>
      </div>
    </main>
  );
}
