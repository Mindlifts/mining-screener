import type { AbsurdMetricResult } from "@/types/absurdMetrics";

export function AbsurdMetricBadge({
  metric,
  compact = false
}: {
  metric: AbsurdMetricResult;
  compact?: boolean;
}) {
  const good = metric.score !== null && (metric.isHigherBetter ? metric.score >= 70 : metric.score <= 30);
  const bad = metric.score !== null && (metric.isHigherBetter ? metric.score < 45 : metric.score > 60);
  const tone = good
    ? "border-terminalGreen/50 bg-terminalGreen/10 text-terminalGreen"
    : bad
      ? "border-red-400/50 bg-red-400/10 text-red-300"
      : "border-caution/50 bg-caution/10 text-caution";

  return (
    <span className={`inline-flex min-w-0 items-center gap-1 rounded border ${compact ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-1 text-xs"} ${tone}`}>
      <span className="truncate">{metric.label}</span>
      {metric.score !== null ? <span className="font-mono">{metric.score}</span> : null}
    </span>
  );
}
