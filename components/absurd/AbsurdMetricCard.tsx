import { AbsurdMetricBadge } from "@/components/absurd/AbsurdMetricBadge";
import { AbsurdMetricIllustration } from "@/components/absurd/AbsurdMetricIllustrations";
import { AbsurdMetricTooltip } from "@/components/absurd/AbsurdMetricTooltip";
import type { AbsurdMetricResult } from "@/types/absurdMetrics";

const accents: Record<AbsurdMetricResult["visualTheme"], string> = {
  truck: "text-[#d3a552]",
  sleep: "text-[#b8c7dc]",
  infrastructure: "text-[#c98d55]",
  institutional: "text-[#78aee8]",
  builders: "text-[#c88c58]",
  hype: "text-[#ef6b72]",
  conversion: "text-[#b7bdc8]",
  complexity: "text-[#d5a762]",
  valuation: "text-[#9de58b]",
  giant: "text-[#d9b55e]"
};

export function AbsurdMetricCard({
  metric,
  featured = false,
  adminNote
}: {
  metric: AbsurdMetricResult;
  featured?: boolean;
  adminNote?: string;
}) {
  return (
    <article
      className={`group relative flex min-w-0 flex-col overflow-hidden rounded-lg border border-zincLine bg-[linear-gradient(145deg,rgba(24,27,34,0.95),rgba(10,12,17,0.96))] p-4 transition duration-300 hover:-translate-y-0.5 hover:border-zinc-500 ${
        featured ? "min-h-[360px] sm:p-6" : "min-h-[310px]"
      }`}
    >
      <div className={`absolute -right-4 -top-2 h-32 w-48 opacity-65 transition duration-300 group-hover:opacity-100 ${accents[metric.visualTheme]}`}>
        <AbsurdMetricIllustration id={metric.id} />
      </div>

      <div className="relative z-10 max-w-[72%] min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-600">
          {metric.shortName}
        </p>
        <h3 className={`${featured ? "mt-3 text-2xl" : "mt-2 text-lg"} break-words font-semibold text-zinc-50`}>
          {metric.name}
        </h3>
      </div>

      <div className="relative z-10 mt-auto pt-16">
        <div className="flex min-w-0 items-end justify-between gap-3">
          <div className="min-w-0">
            <p className={`${featured ? "text-6xl" : "text-4xl"} font-mono font-semibold ${accents[metric.visualTheme]}`}>
              {metric.score ?? "—"}
            </p>
            <div className="mt-2">
              <AbsurdMetricBadge metric={metric} />
            </div>
          </div>
          <AbsurdMetricTooltip label={`${metric.confidence} confidence · ${metric.mode} · ${metric.inputHealth} input coverage`}>
            <button
              type="button"
              aria-label={`Explain confidence for ${metric.name}`}
              className="grid h-7 w-7 place-items-center rounded-full border border-zincLine text-xs text-zinc-500 hover:border-zinc-500 hover:text-zinc-200"
            >
              ?
            </button>
          </AbsurdMetricTooltip>
        </div>

        <p className="mt-4 text-xs leading-5 text-zinc-400">{metric.explanation}</p>

        <div className="mt-4 flex flex-wrap gap-1.5 text-[9px] font-semibold uppercase tracking-wide">
          <span className="rounded border border-zincLine px-2 py-1 text-zinc-500">{metric.mode}</span>
          <span className="rounded border border-zincLine px-2 py-1 text-zinc-500">{metric.confidence} confidence</span>
          {metric.missingInputs.length ? (
            <span className="rounded border border-caution/30 bg-caution/5 px-2 py-1 text-caution">
              {metric.missingInputs.length} missing
            </span>
          ) : null}
        </div>

        {metric.missingInputs.length ? (
          <details className="mt-3 border-t border-zincLine pt-3">
            <summary className="cursor-pointer text-[10px] font-semibold uppercase tracking-wide text-zinc-600">
              Missing inputs
            </summary>
            <p className="mt-2 break-words text-[11px] leading-5 text-zinc-500">
              {metric.missingInputs.join(", ")}
            </p>
          </details>
        ) : null}

        {adminNote ? (
          <p className="mt-3 border-l-2 border-caution/60 pl-3 text-[11px] leading-5 text-caution/80">
            Admin note: {adminNote}
          </p>
        ) : null}
      </div>
    </article>
  );
}
