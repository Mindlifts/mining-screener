"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AbsurdMetricComparisonTable } from "@/components/absurd/AbsurdMetricComparisonTable";
import { AbsurdMetricGrid } from "@/components/absurd/AbsurdMetricGrid";
import { AbsurdMetricRadarChart } from "@/components/absurd/AbsurdMetricRadarChart";
import { commodities } from "@/data/mining-universe";
import { calculateAbsurdMetrics } from "@/lib/absurdMetrics";
import type { Commodity, Company } from "@/types/company";

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
    const matchesCommodity = commodity === "All" || company.commodity === commodity;
    return matchesSearch && matchesCommodity;
  });

  const selected = ranked.find(({ company }) => company.slug === selectedSlug) ?? filtered[0] ?? ranked[0];
  const comparison = filtered.slice(0, 3).map(({ company }) => company);

  return (
    <>
      <section className="sticky top-0 z-30 grid min-w-0 grid-cols-1 gap-3 rounded-lg border border-zincLine bg-zincPanel/95 p-3 shadow-glow backdrop-blur md:grid-cols-[minmax(0,1fr)_220px] lg:static lg:shadow-none">
        <label className="min-w-0">
          <span className="sr-only">Search companies</span>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search company or ticker"
            className="h-10 w-full rounded border border-zincLine bg-zinc-950 px-3 text-sm text-zinc-100 outline-none placeholder:text-zinc-700 focus:border-caution/60"
          />
        </label>
        <label className="min-w-0">
          <span className="sr-only">Commodity</span>
          <select
            value={commodity}
            onChange={(event) => setCommodity(event.target.value as Commodity | "All")}
            className="h-10 w-full rounded border border-zincLine bg-zinc-950 px-3 text-sm text-zinc-100 outline-none focus:border-caution/60"
          >
            <option>All</option>
            {commodities.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
      </section>

      <section className="grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-[300px_minmax(0,1fr)]">
        <aside className="min-w-0 overflow-hidden rounded-lg border border-zincLine bg-zincPanel/75 xl:max-h-[760px] xl:overflow-y-auto">
          <header className="sticky top-0 z-10 border-b border-zincLine bg-zincPanel p-4">
            <h2 className="text-sm font-semibold text-zinc-50">Sleeping giants</h2>
            <p className="mt-1 text-xs text-zinc-600">Ranked by headline composite.</p>
          </header>
          <div>
            {filtered.map(({ company, giant }) => (
              <button
                key={company.slug}
                type="button"
                onClick={() => setSelectedSlug(company.slug)}
                className={`flex w-full min-w-0 items-center justify-between gap-3 border-b border-zincLine px-4 py-3 text-left transition last:border-0 ${
                  selected?.company.slug === company.slug ? "bg-zinc-800" : "hover:bg-zinc-900"
                }`}
              >
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-zinc-100">{company.company}</span>
                  <span className="mt-1 block font-mono text-[11px] text-caution">{company.ticker} · {company.commodity}</span>
                </span>
                <span className="shrink-0 font-mono text-xl text-terminalGreen">{giant?.score ?? "—"}</span>
              </button>
            ))}
          </div>
        </aside>

        {selected ? (
          <div className="min-w-0 space-y-4">
            <section className="flex min-w-0 flex-col gap-4 rounded-lg border border-zincLine bg-zincPanel/70 p-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="min-w-0">
                <p className="font-mono text-xs text-caution">{selected.company.ticker} · {selected.company.exchange}</p>
                <h2 className="mt-2 break-words text-2xl font-semibold text-zinc-50">{selected.company.company}</h2>
                <p className="mt-2 text-xs text-zinc-500">
                  {selected.company.commodity} · {selected.company.status} · updated {selected.company.lastUpdated}
                </p>
              </div>
              <Link href={`/companies/${selected.company.slug}#absurd-metrics`} className="shrink-0 rounded border border-zincLine px-3 py-2 text-xs font-semibold uppercase tracking-wide text-zinc-300 hover:border-caution/50 hover:text-caution">
                Company detail
              </Link>
            </section>

            <div className="grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
              <div className="min-w-0">
                <AbsurdMetricGrid metrics={selected.metrics} />
              </div>
              <AbsurdMetricRadarChart metrics={selected.metrics} />
            </div>
          </div>
        ) : null}
      </section>

      {comparison.length ? <AbsurdMetricComparisonTable companies={comparison} /> : null}
    </>
  );
}
