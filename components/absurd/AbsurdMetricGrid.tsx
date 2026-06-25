import { AbsurdMetricCard } from "@/components/absurd/AbsurdMetricCard";
import type { AbsurdMetricBenchmark, AbsurdMetricId, AbsurdMetricResult } from "@/types/absurdMetrics";

export function AbsurdMetricGrid({
  metrics,
  adminNotes,
  benchmarks
}: {
  metrics: AbsurdMetricResult[];
  adminNotes?: Partial<Record<AbsurdMetricId, string>>;
  benchmarks?: Partial<Record<AbsurdMetricId, AbsurdMetricBenchmark>>;
}) {
  return (
    <div className="grid min-w-0 grid-cols-1 gap-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5">
      {metrics.map((metric, index) => (
        <AbsurdMetricCard
          key={metric.id}
          metric={metric}
          number={index + 1}
          adminNote={adminNotes?.[metric.id]}
          benchmark={benchmarks?.[metric.id]}
        />
      ))}
    </div>
  );
}
