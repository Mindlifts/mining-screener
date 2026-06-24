import { AbsurdMetricIllustration } from "@/components/absurd/AbsurdMetricIllustrations";
import { AbsurdMetricMicroViz } from "@/components/absurd/AbsurdMetricMicroViz";
import { AbsurdMetricTooltip } from "@/components/absurd/AbsurdMetricTooltip";
import type { AbsurdMetricResult } from "@/types/absurdMetrics";

const accentColors: Record<AbsurdMetricResult["visualTheme"], string> = {
  truck: "#42bce8",
  sleep: "#78d26a",
  infrastructure: "#ef8738",
  institutional: "#b778e4",
  builders: "#e4bd40",
  hype: "#24c6a4",
  conversion: "#b36de2",
  complexity: "#ef8738",
  valuation: "#e4bd40",
  giant: "#d887dc"
};

const formulas: Record<AbsurdMetricResult["id"], string> = {
  "barrick-bother": "Scale + Resource + Mine Life",
  "ceo-sleep": "Cash Runway - Debt Stress",
  "road-to-starbucks": "Road + Power + Logistics",
  "institutional-comfort": "Jurisdiction + Liquidity + Permits",
  "shovel-density": "Builders / Key People",
  "hype-liability": "Buzzwords / Announcements",
  "geology-reality": "Reserves / Resources + Recovery",
  "things-must-go-right": "Critical Dependencies",
  "double-without-news": "Value Without Catalysts",
  "sleeping-giant": "Quality / Attention Discount"
};

export function AbsurdMetricCard({
  metric,
  number = 1,
  adminNote
}: {
  metric: AbsurdMetricResult;
  number?: number;
  featured?: boolean;
  adminNote?: string;
}) {
  const color = accentColors[metric.visualTheme];

  return (
    <article
      className="group relative flex min-h-[286px] min-w-0 flex-col overflow-hidden border border-[#28343d] bg-[#091117] p-3 shadow-[inset_0_0_24px_rgba(35,93,113,0.05)] transition duration-200 hover:border-[#415564] hover:bg-[#0b151c]"
      style={{ boxShadow: `inset 0 2px 0 ${color}66` }}
    >
      <div className="flex min-w-0 items-start gap-2.5">
        <span
          className="grid h-8 w-8 shrink-0 place-items-center border font-mono text-lg"
          style={{ borderColor: `${color}88`, color, backgroundColor: `${color}12` }}
        >
          {number}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-[11px] font-semibold uppercase leading-4 text-zinc-100">{metric.name}</h3>
          <p className="mt-1 truncate text-[9px] text-zinc-600">{formulas[metric.id]}</p>
        </div>
        <div className="h-9 w-12 shrink-0 opacity-80" style={{ color }}>
          <AbsurdMetricIllustration id={metric.id} />
        </div>
      </div>

      <div className="mt-4 text-center">
        <p className="font-mono text-3xl font-medium" style={{ color }}>{metric.score ?? "—"}</p>
        <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.14em]" style={{ color }}>
          {metric.label}
        </p>
      </div>

      <div className="mt-1">
        <AbsurdMetricMicroViz metric={metric} color={color} />
      </div>

      <div className="mt-auto border-t border-[#202a31] pt-2">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-[9px] text-zinc-600">
            {metric.isHigherBetter ? "Higher = stronger" : "Lower = safer"}
          </p>
          <AbsurdMetricTooltip label={`${metric.explanation} Confidence: ${metric.confidence}. Mode: ${metric.mode}.`}>
            <button
              type="button"
              aria-label={`Explain ${metric.name}`}
              className="grid h-5 w-5 place-items-center border border-[#2c3942] text-[9px] text-zinc-500 hover:text-zinc-100"
            >
              i
            </button>
          </AbsurdMetricTooltip>
        </div>
        <div className="mt-2 flex items-center gap-1.5">
          <span className="border border-[#28343d] px-1.5 py-0.5 text-[8px] uppercase text-zinc-600">{metric.mode}</span>
          <span className="border border-[#28343d] px-1.5 py-0.5 text-[8px] uppercase text-zinc-600">{metric.confidence}</span>
          {metric.missingInputs.length ? (
            <span className="ml-auto text-[8px] text-caution">{metric.missingInputs.length} missing</span>
          ) : null}
        </div>
        {adminNote ? <p className="mt-2 line-clamp-2 text-[9px] leading-4 text-caution/70">{adminNote}</p> : null}
      </div>
    </article>
  );
}
