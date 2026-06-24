"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AbsurdMetricComparisonTable } from "@/components/absurd/AbsurdMetricComparisonTable";
import { AbsurdMetricGrid } from "@/components/absurd/AbsurdMetricGrid";
import { AbsurdMetricRadarChart } from "@/components/absurd/AbsurdMetricRadarChart";
import { commodities } from "@/data/mining-universe";
import { calculateAbsurdMetrics } from "@/lib/absurdMetrics";
import type { AbsurdMetricResult } from "@/types/absurdMetrics";
import type { Commodity, Company } from "@/types/company";

function PanelTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="border-b border-[#1d3038] bg-[#0b1920] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#45c7c4]">
      {children}
    </h2>
  );
}

function MethodologyRail() {
  return (
    <aside className="min-w-0 border border-[#20313a] bg-[#081117]">
      <PanelTitle>Implementation overview</PanelTitle>
      <div className="space-y-4 p-3 text-[10px] leading-4 text-zinc-500">
        <p>
          Existing fundamentals feed automatic factors. Mining-specific evidence is added manually or through future asset APIs.
        </p>
        <div className="border-t border-[#1d2930] pt-3">
          <p className="font-semibold uppercase text-[#45c7c4]">Calculation flow</p>
          <div className="mt-3 space-y-2">
            {[
              ["01", "Source data", "Filings, market cache, project facts"],
              ["02", "Metric engine", "Normalize and score daily"],
              ["03", "Confidence", "Penalize incomplete evidence"],
              ["04", "Investor view", "Rank, compare and alert"]
            ].map(([number, title, detail]) => (
              <div key={number} className="grid grid-cols-[28px_minmax(0,1fr)] gap-2 border border-[#1d2a31] bg-[#0a151b] p-2">
                <span className="grid h-7 w-7 place-items-center border border-[#2c4650] font-mono text-[#45c7c4]">{number}</span>
                <span>
                  <span className="block font-semibold text-zinc-300">{title}</span>
                  <span className="mt-0.5 block text-zinc-600">{detail}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="border-t border-[#1d2930] pt-3">
          <p className="font-semibold uppercase text-[#45c7c4]">Evidence rules</p>
          <ul className="mt-2 space-y-1.5">
            <li>• No invented project distances</li>
            <li>• Manual assumptions stay labelled</li>
            <li>• Missing inputs reduce confidence</li>
            <li>• Lower-is-better metrics invert in composites</li>
          </ul>
        </div>
        <div className="border-t border-[#1d2930] pt-3">
          <p className="font-semibold uppercase text-[#45c7c4]">Priority</p>
          <ol className="mt-2 space-y-1 font-mono text-zinc-600">
            <li>1. Sleeping Giant</li>
            <li>2. Financing runway</li>
            <li>3. Complexity and hype</li>
            <li>4. Infrastructure inputs</li>
          </ol>
        </div>
      </div>
    </aside>
  );
}

function OpportunityRail({
  company,
  metrics
}: {
  company: Company;
  metrics: AbsurdMetricResult[];
}) {
  const scored = metrics.filter((metric) => metric.score !== null);
  const best = scored.slice().sort((a, b) => {
    const left = a.isHigherBetter ? a.score! : 100 - a.score!;
    const right = b.isHigherBetter ? b.score! : 100 - b.score!;
    return right - left;
  }).slice(0, 3);
  const redFlags = scored.filter((metric) => {
    const normalized = metric.isHigherBetter ? metric.score! : 100 - metric.score!;
    return normalized < 45;
  }).slice(0, 3);

  return (
    <aside className="min-w-0 space-y-2">
      <section className="border border-[#20313a] bg-[#081117]">
        <PanelTitle>Integration throughout app</PanelTitle>
        <div className="space-y-3 p-3 text-[10px]">
          <div className="border border-[#1d2a31] bg-[#0a151b] p-2">
            <p className="text-zinc-600">Company overview</p>
            <p className="mt-1 font-semibold text-zinc-200">{company.company}</p>
            <p className="mt-1 font-mono text-[#45c7c4]">{company.ticker} · {company.exchange}</p>
          </div>
          <div className="border border-[#1d2a31] bg-[#0a151b] p-2">
            <p className="text-zinc-600">Metric coverage</p>
            <p className="mt-1 font-mono text-lg text-terminalGreen">{metrics.length}/10</p>
            <p className="text-zinc-600">enabled analytics</p>
          </div>
          <Link href={`/companies/${company.slug}#absurd-metrics`} className="block border border-[#2c4650] px-2 py-2 text-center font-semibold uppercase text-[#45c7c4] hover:bg-[#10222a]">
            Open company view
          </Link>
        </div>
      </section>

      <section className="border border-[#20313a] bg-[#081117]">
        <PanelTitle>Opportunity alerts</PanelTitle>
        <div className="divide-y divide-[#1d2a31]">
          {best.map((metric) => (
            <div key={metric.id} className="p-3">
              <p className="font-semibold uppercase text-terminalGreen">{metric.shortName} alert</p>
              <p className="mt-1 text-[10px] text-zinc-500">{metric.label} · score {metric.score}</p>
            </div>
          ))}
          {!best.length ? <p className="p-3 text-[10px] text-zinc-600">No scored alerts.</p> : null}
        </div>
      </section>

      <section className="border border-[#20313a] bg-[#081117]">
        <PanelTitle>Risk monitor</PanelTitle>
        <div className="divide-y divide-[#1d2a31]">
          {redFlags.map((metric) => (
            <div key={metric.id} className="p-3">
              <p className="font-semibold uppercase text-red-300">{metric.shortName}</p>
              <p className="mt-1 text-[10px] text-zinc-500">{metric.label} · {metric.confidence} confidence</p>
            </div>
          ))}
          {!redFlags.length ? <p className="p-3 text-[10px] text-zinc-600">No severe metric flags.</p> : null}
        </div>
      </section>
    </aside>
  );
}

export function AbsurdMetricsExplorer({ companies }: { companies: Company[] }) {
  const [search, setSearch] = useState("");
  const [commodity, setCommodity] = useState<Commodity | "All">("All");
  const [selectedSlug, setSelectedSlug] = useState(companies[0]?.slug ?? "");

  const ranked = useMemo(
    () =>
      companies
        .map((company) => {
          const metrics = calculateAbsurdMetrics(company);
          const giant = metrics.find((metric) => metric.id === "sleeping-giant");
          return { company, metrics, giant };
        })
        .sort((a, b) => (b.giant?.score ?? -1) - (a.giant?.score ?? -1)),
    [companies]
  );

  const filtered = ranked.filter(({ company }) => {
    const matchesSearch = `${company.company} ${company.ticker}`.toLowerCase().includes(search.trim().toLowerCase());
    return matchesSearch && (commodity === "All" || company.commodity === commodity);
  });
  const selected = ranked.find(({ company }) => company.slug === selectedSlug) ?? filtered[0] ?? ranked[0];
  const comparison = filtered.slice(0, 3).map(({ company }) => company);

  return (
    <div className="space-y-2">
      <section className="grid min-w-0 grid-cols-1 gap-2 border border-[#20313a] bg-[#081117] p-2 md:grid-cols-[minmax(0,1fr)_190px_240px]">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search company or ticker"
          aria-label="Search companies"
          className="h-9 min-w-0 border border-[#25343d] bg-[#060d12] px-3 text-xs text-zinc-100 outline-none placeholder:text-zinc-700 focus:border-[#45c7c4]"
        />
        <select
          value={commodity}
          onChange={(event) => setCommodity(event.target.value as Commodity | "All")}
          aria-label="Commodity"
          className="h-9 min-w-0 border border-[#25343d] bg-[#060d12] px-2 text-xs text-zinc-200 outline-none focus:border-[#45c7c4]"
        >
          <option>All</option>
          {commodities.map((item) => <option key={item}>{item}</option>)}
        </select>
        <select
          value={selected?.company.slug}
          onChange={(event) => setSelectedSlug(event.target.value)}
          aria-label="Selected company"
          className="h-9 min-w-0 border border-[#25343d] bg-[#060d12] px-2 font-mono text-xs text-caution outline-none focus:border-[#45c7c4]"
        >
          {filtered.map(({ company, giant }) => (
            <option key={company.slug} value={company.slug}>
              {company.ticker} · {company.company} · {giant?.score ?? "—"}
            </option>
          ))}
        </select>
      </section>

      {selected ? (
        <>
          <section className="grid min-w-0 grid-cols-1 gap-2 2xl:grid-cols-[210px_minmax(0,1fr)_230px]">
            <div className="hidden min-w-0 2xl:block">
              <MethodologyRail />
            </div>

            <div className="min-w-0 border border-[#20313a] bg-[#071016] p-1">
              <div className="flex min-w-0 flex-col gap-2 border-b border-[#20313a] bg-[#0a171e] px-3 py-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#45c7c4]">The 10 metrics dashboard</p>
                  <p className="mt-1 truncate text-sm font-semibold text-zinc-100">
                    {selected.company.company}
                    <span className="ml-2 font-mono text-caution">{selected.company.ticker}</span>
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[9px] uppercase text-zinc-600">Sleeping Giant</span>
                  <span className="font-mono text-2xl text-terminalGreen">{selected.giant?.score ?? "—"}</span>
                </div>
              </div>
              <AbsurdMetricGrid metrics={selected.metrics} />
            </div>

            <div className="hidden min-w-0 2xl:block">
              <OpportunityRail company={selected.company} metrics={selected.metrics} />
            </div>
          </section>

          <section className="grid min-w-0 grid-cols-1 gap-2 2xl:hidden lg:grid-cols-2">
            <MethodologyRail />
            <OpportunityRail company={selected.company} metrics={selected.metrics} />
          </section>

          <section className="grid min-w-0 grid-cols-1 gap-2 xl:grid-cols-[310px_minmax(0,1fr)]">
            <AbsurdMetricRadarChart metrics={selected.metrics} />
            {comparison.length ? <AbsurdMetricComparisonTable companies={comparison} /> : null}
          </section>
        </>
      ) : (
        <div className="border border-[#20313a] bg-[#081117] p-8 text-center text-sm text-zinc-600">
          No companies match the current filters.
        </div>
      )}
    </div>
  );
}
