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

  return (
    <section className="w-full max-w-full overflow-hidden rounded-lg border border-zincLine bg-zincPanel/75">
      <header className="border-b border-zincLine p-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-600">Side-by-side</p>
        <h2 className="mt-2 text-lg font-semibold text-zinc-50">Absurd metric comparison</h2>
      </header>
      <div className="max-w-full overflow-x-auto">
        <table className="w-full min-w-[760px] text-xs">
          <thead className="bg-zinc-950/80 text-zinc-500">
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
                <tr key={id} className="border-t border-zincLine">
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
