"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { CompanyScore, InvestorMode } from "@/lib/scoring";
import { formatMoney, formatMultiple, formatNumber, formatPercent } from "@/components/dashboard/formatters";
import { ScorePill, type EnrichedCompany } from "@/components/dashboard/ScreenerTable";

function ModeMetrics({ row, activeMode }: { row: EnrichedCompany; activeMode: InvestorMode }) {
  const { company, score } = row;

  if (activeMode === "Rick Rule") {
    return [
      ["Survival", score.survival],
      ["Balance", score.balanceSheet],
      ["Cost", score.cost],
      ["MoS", company.marginOfSafety]
    ];
  }

  if (activeMode === "Eric Sprott") {
    return [
      ["Torque", score.torque],
      ["Leverage", company.commodityLeverage],
      ["Insider", `${formatPercent(company.insiderOwnership)}`],
      ["Catalysts", score.catalysts]
    ];
  }

  if (activeMode === "Ross Beaty") {
    return [
      ["Mgmt", score.management],
      ["Execution", company.executionTrackRecord],
      ["Builder", company.mineBuildingTrackRecord],
      ["Capital", company.capitalAllocation]
    ];
  }

  if (activeMode === "Tavi Costa") {
    return [
      ["Macro", score.macro],
      ["Cycle", score.commodityCycle],
      ["Real Rates", company.realRatesSensitivity],
      ["Beta", company.commodityLeverage]
    ];
  }

  if (activeMode === "Lobo Tigre") {
    return [
      ["Value", score.valuation],
      ["NAV Disc", `${company.navDiscount}%`],
      ["EV/Res", company.evResource],
      ["Contrarian", score.contrarian]
    ];
  }

  return [
    ["Total", score.total],
    ["Survival", score.survival],
    ["Torque", score.torque],
    ["Macro", score.macro]
  ];
}

function DetailGrid({ row }: { row: EnrichedCompany }) {
  const { company, score } = row;
  const details = [
    ["Market Cap", formatMoney(company.marketCap)],
    ["EV", formatMoney(company.enterpriseValue)],
    ["EV/EBITDA", formatMultiple(company.evEbitda)],
    ["FCF Yield", formatPercent(company.fcfYield)],
    ["AISC", `${formatNumber(company.aisc)} ${company.aiscUnit}`],
    ["Reserve Life", `${company.reserveLife}y`],
    ["Net Debt", formatMoney(company.netDebt)],
    ["Jurisdiction", `${company.jurisdictionRisk} · ${score.jurisdiction}`]
  ];

  return (
    <div className="mt-4 grid grid-cols-1 gap-2 border-t border-zincLine pt-4 text-xs sm:grid-cols-2">
      {details.map(([label, value]) => (
        <div key={label} className="min-w-0 rounded border border-zincLine bg-zinc-950/70 p-2">
          <p className="truncate uppercase tracking-wide text-zinc-500">{label}</p>
          <p className="mt-1 break-words font-mono text-zinc-100">{value}</p>
        </div>
      ))}
    </div>
  );
}

export function MobileScreenerCards({
  rows,
  activeMode,
  primaryLabel,
  primaryScore
}: {
  rows: EnrichedCompany[];
  activeMode: InvestorMode;
  primaryLabel: string;
  primaryScore: keyof CompanyScore;
}) {
  const pageSize = 6;
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);

  useEffect(() => {
    setVisibleCount(pageSize);
    setExpandedSlug(null);
  }, [rows, activeMode]);

  const visibleRows = rows.slice(0, visibleCount);
  const hasMore = visibleCount < rows.length;

  return (
    <section className="w-full max-w-full space-y-3 overflow-hidden lg:hidden">
      <div className="flex min-w-0 items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-zinc-50">Mobile screener</h2>
          <p className="mt-1 text-xs text-zinc-500">Compact cards sorted by {primaryLabel}.</p>
        </div>
        <span className="shrink-0 border border-zincLine px-3 py-1 font-mono text-xs text-zinc-400">{rows.length} rows</span>
      </div>

      <div className="space-y-3">
        {visibleRows.map((row) => {
          const { company, score } = row;
          const isExpanded = expandedSlug === company.slug;

          return (
            <article key={company.slug} className="w-full max-w-full overflow-hidden rounded-lg border border-zincLine bg-zincPanel/85 p-4">
              <div className="flex min-w-0 items-start justify-between gap-3">
                <div className="min-w-0">
                  <Link href={`/companies/${company.slug}`} className="block truncate text-base font-semibold text-zinc-50">
                    {company.company}
                  </Link>
                  <p className="mt-1 font-mono text-xs text-caution">
                    {company.ticker} · {company.exchange} · {company.commodity}
                  </p>
                  <p className="mt-1 truncate text-xs text-zinc-500">
                    {company.stage} · {company.jurisdiction}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-[11px] uppercase tracking-wide text-zinc-500">{primaryLabel}</p>
                  <ScorePill value={score[primaryScore]} strong />
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {ModeMetrics({ row, activeMode }).map(([label, value]) => (
                  <div key={label} className="min-w-0 rounded border border-zincLine bg-zinc-950/70 p-2">
                    <p className="truncate text-[11px] uppercase tracking-wide text-zinc-500">{label}</p>
                    <p className="mt-1 break-words font-mono text-sm text-zinc-100">{value}</p>
                  </div>
                ))}
              </div>

              {isExpanded ? <DetailGrid row={row} /> : null}

              <button
                type="button"
                onClick={() => setExpandedSlug(isExpanded ? null : company.slug)}
                className="mt-4 h-9 w-full rounded border border-zincLine bg-zinc-950 text-xs font-semibold uppercase tracking-wide text-zinc-300 transition hover:border-zinc-600 hover:text-zinc-50"
              >
                {isExpanded ? "Hide details" : "Expand details"}
              </button>
            </article>
          );
        })}
      </div>

      {hasMore ? (
        <button
          type="button"
          onClick={() => setVisibleCount((current) => Math.min(current + pageSize, rows.length))}
          className="h-11 w-full rounded-lg border border-zincLine bg-zincPanel text-sm font-semibold text-zinc-100 transition hover:border-terminalGreen/60"
        >
          Show more
        </button>
      ) : null}
    </section>
  );
}
