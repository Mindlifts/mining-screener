import Link from "next/link";
import { calculateAbsurdMetrics } from "@/lib/absurdMetrics";
import type { Company } from "@/types/company";
import type { AbsurdMetricId } from "@/types/absurdMetrics";

const comparisonIds: AbsurdMetricId[] = [
  "sleeping-giant",
  "barrick-bother",
  "ceo-sleep",
  "road-to-starbucks",
  "things-must-go-right",
  "hype-liability",
  "double-without-news"
];

export function AbsurdMetricComparisonTable({ companies }: { companies: Company[] }) {
  const rows = companies.map((company) => ({
    company,
    metrics: Object.fromEntries(calculateAbsurdMetrics(company).map((metric) => [metric.id, metric]))
  }));
  const strongest = rows.slice().sort(
    (a, b) => (b.metrics["sleeping-giant"]?.score ?? -1) - (a.metrics["sleeping-giant"]?.score ?? -1)
  )[0];
  const redFlag = rows
    .flatMap((row) => Object.values(row.metrics).map((metric) => ({ company: row.company, metric })))
    .filter(({ metric }) => metric?.score !== null)
    .sort((a, b) => {
      const left = a.metric!.isHigherBetter ? a.metric!.score! : 100 - a.metric!.score!;
      const right = b.metric!.isHigherBetter ? b.metric!.score! : 100 - b.metric!.score!;
      return left - right;
    })[0];

  return (
    <section className="w-full max-w-full overflow-hidden border border-[#20313a] bg-[#081117]">
      <header className="border-b border-[#20313a] bg-[#0b1920] p-3">
        <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#45c7c4]">Side-by-side</p>
        <h2 className="mt-1 text-sm font-semibold uppercase text-zinc-100">Absurd metric comparison</h2>
      </header>
      <div className="grid grid-cols-1 gap-px border-b border-[#20313a] bg-[#20313a] sm:grid-cols-2">
        <div className="bg-[#081117] p-3">
          <p className="text-[9px] uppercase tracking-wide text-terminalGreen">Most attractive asymmetry</p>
          <p className="mt-1 text-xs text-zinc-200">
            {strongest ? `${strongest.company.ticker} · Sleeping Giant ${strongest.metrics["sleeping-giant"]?.score ?? "—"}/100` : "Unavailable"}
          </p>
        </div>
        <div className="bg-[#081117] p-3">
          <p className="text-[9px] uppercase tracking-wide text-red-300">Biggest red flag</p>
          <p className="mt-1 text-xs text-zinc-200">
            {redFlag ? `${redFlag.company.ticker} · ${redFlag.metric?.shortName}: ${redFlag.metric?.label}` : "Unavailable"}
          </p>
        </div>
      </div>
      <div className="max-w-full overflow-x-auto">
        <table className="w-full min-w-[760px] text-xs">
          <thead className="bg-[#060d12] text-zinc-500">
            <tr>
              <th className="px-4 py-3 text-left uppercase tracking-wide">Metric</th>
              {rows.map(({ company }) => (
                <th key={company.slug} className="px-3 py-3 text-right">
                  <Link href={`/companies/${company.slug}`} className="font-mono text-caution hover:text-zinc-50">
                    {company.ticker}
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {comparisonIds.map((id) => {
              const available = rows.map((row) => row.metrics[id]).filter(Boolean);
              const normalized = available.map((metric) => metric.score === null ? null : metric.isHigherBetter ? metric.score : 100 - metric.score);
              const best = Math.max(...normalized.filter((value): value is number => value !== null));
              const worst = Math.min(...normalized.filter((value): value is number => value !== null));

              return (
                <tr key={id} className="border-t border-[#1d2a31]">
                  <td className="px-4 py-3 font-medium text-zinc-300">{available[0]?.shortName ?? id}</td>
                  {rows.map((row) => {
                    const metric = row.metrics[id];
                    if (!metric || metric.score === null) {
                      return <td key={row.company.slug} className="px-3 py-3 text-right font-mono text-zinc-700">—</td>;
                    }
                    const value = metric.isHigherBetter ? metric.score : 100 - metric.score;
                    const tone = value === best ? "text-terminalGreen" : value === worst ? "text-red-300" : "text-zinc-300";

                    return (
                      <td key={row.company.slug} className={`px-3 py-3 text-right font-mono ${tone}`}>
                        {metric.score}
                        <span className="ml-1 text-[9px] text-zinc-600">{metric.label}</span>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
