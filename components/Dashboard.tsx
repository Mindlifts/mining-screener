"use client";

import { useMemo, useState } from "react";
import {
  commodities,
  commodityPrices,
  companies,
  type Commodity,
  type Company
} from "@/lib/data";

const formatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1
});

function PriceCard({
  commodity,
  isActive,
  onSelect
}: {
  commodity: Commodity;
  isActive: boolean;
  onSelect: (commodity: Commodity) => void;
}) {
  const price = commodityPrices.find((item) => item.commodity === commodity);

  if (!price) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={() => onSelect(commodity)}
      className={`rounded-lg border p-4 text-left transition ${
        isActive
          ? "border-terminalGreen/70 bg-terminalGreen/10 shadow-glow"
          : "border-zincLine bg-zincPanel/80 hover:border-zinc-500"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-zinc-500">{price.commodity}</p>
          <p className="mt-2 text-2xl font-semibold text-zinc-50">{price.price}</p>
        </div>
        <span
          className={`rounded-md px-2 py-1 text-xs font-semibold ${
            price.tone === "positive"
              ? "bg-terminalGreen/15 text-terminalGreen"
              : "bg-red-500/15 text-red-300"
          }`}
        >
          {price.change}
        </span>
      </div>
      <p className="mt-3 text-xs text-zinc-500">{price.unit}</p>
    </button>
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
    <div className="overflow-x-auto">
      <div className="flex min-w-max gap-2 rounded-lg border border-zincLine bg-zinc-950/60 p-1">
        {commodities.map((commodity) => (
          <button
            key={commodity}
            type="button"
            onClick={() => onSelect(commodity)}
            className={`rounded-md px-4 py-2 text-sm font-medium transition ${
              activeCommodity === commodity
                ? "bg-zinc-100 text-zinc-950"
                : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
            }`}
          >
            {commodity}
          </button>
        ))}
      </div>
    </div>
  );
}

function CompanyTable({ rows }: { rows: Company[] }) {
  return (
    <div className="overflow-hidden rounded-lg border border-zincLine bg-zincPanel/80 shadow-glow">
      <div className="overflow-x-auto">
        <table className="min-w-[760px] w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-zincLine bg-zinc-950/70 text-left text-xs uppercase tracking-wide text-zinc-500">
              <th className="px-4 py-3 font-medium">Company</th>
              <th className="px-4 py-3 font-medium">Ticker</th>
              <th className="px-4 py-3 font-medium">Commodity</th>
              <th className="px-4 py-3 text-right font-medium">Market Cap</th>
              <th className="px-4 py-3 text-right font-medium">EV/EBITDA</th>
              <th className="px-4 py-3 text-right font-medium">FCF Yield</th>
              <th className="px-4 py-3 font-medium">Jurisdiction</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((company) => (
              <tr
                key={company.ticker}
                className="border-b border-zincLine/80 text-zinc-200 last:border-0 hover:bg-zinc-900/80"
              >
                <td className="px-4 py-4 font-medium text-zinc-50">{company.company}</td>
                <td className="px-4 py-4 font-mono text-caution">{company.ticker}</td>
                <td className="px-4 py-4">{company.commodity}</td>
                <td className="px-4 py-4 text-right font-mono">{company.marketCap}</td>
                <td className="px-4 py-4 text-right font-mono">
                  {company.evToEbitda > 0 ? formatter.format(company.evToEbitda) : "N/A"}
                </td>
                <td className="px-4 py-4 text-right font-mono">{company.fcfYield}</td>
                <td className="px-4 py-4 text-zinc-300">{company.jurisdiction}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function Dashboard() {
  const [activeCommodity, setActiveCommodity] = useState<Commodity>("Silver");

  const filteredCompanies = useMemo(
    () => companies.filter((company) => company.commodity === activeCommodity),
    [activeCommodity]
  );

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-4 py-5 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-4 border-b border-zincLine pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-terminalGreen">Mining equities</p>
          <h1 className="mt-2 text-3xl font-semibold text-zinc-50 sm:text-4xl">
            Mining Intelligence Dashboard
          </h1>
        </div>
        <div className="grid grid-cols-2 gap-3 text-xs text-zinc-400 sm:text-right">
          <div>
            <p className="text-zinc-500">Coverage</p>
            <p className="mt-1 font-mono text-zinc-100">{companies.length} names</p>
          </div>
          <div>
            <p className="text-zinc-500">Data mode</p>
            <p className="mt-1 font-mono text-caution">Sample</p>
          </div>
        </div>
      </header>

      <CommodityTabs activeCommodity={activeCommodity} onSelect={setActiveCommodity} />

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {commodities.map((commodity) => (
          <PriceCard
            key={commodity}
            commodity={commodity}
            isActive={activeCommodity === commodity}
            onSelect={setActiveCommodity}
          />
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-[1fr_280px]">
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-zinc-50">{activeCommodity} companies</h2>
              <p className="mt-1 text-sm text-zinc-500">
                Comparable valuation snapshot using temporary sample data.
              </p>
            </div>
            <span className="rounded-md border border-zincLine px-3 py-1 text-xs text-zinc-400">
              {filteredCompanies.length} rows
            </span>
          </div>
          <CompanyTable rows={filteredCompanies} />
        </div>

        <aside className="rounded-lg border border-zincLine bg-zincPanel/80 p-4 shadow-glow">
          <p className="text-xs uppercase tracking-wide text-zinc-500">Watchlist focus</p>
          <div className="mt-4 space-y-3">
            {filteredCompanies.map((company) => (
              <div key={company.ticker} className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-zinc-100">{company.ticker}</p>
                  <p className="text-xs text-zinc-500">{company.jurisdiction}</p>
                </div>
                <p className="font-mono text-sm text-terminalGreen">{company.fcfYield}</p>
              </div>
            ))}
          </div>
        </aside>
      </section>
    </main>
  );
}
