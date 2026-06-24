import { AbsurdMetricCard } from "@/components/absurd/AbsurdMetricCard";
import type { AbsurdMetricId, AbsurdMetricResult } from "@/types/absurdMetrics";

export function AbsurdMetricGrid({
  metrics,
  adminNotes
}: {
  metrics: AbsurdMetricResult[];
  adminNotes?: Partial<Record<AbsurdMetricId, string>>;
}) {
  const sleepingGiant = metrics.find((metric) => metric.id === "sleeping-giant");
  const remaining = metrics.filter((metric) => metric.id !== "sleeping-giant");

  return (
    <div className="grid min-w-0 grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
      {sleepingGiant ? (
        <div className="min-w-0 md:col-span-2 xl:col-span-3">
          <AbsurdMetricCard
            metric={sleepingGiant}
            featured
            adminNote={adminNotes?.[sleepingGiant.id]}
          />
        </div>
      ) : null}
      {remaining.map((metric) => (
        <AbsurdMetricCard key={metric.id} metric={metric} adminNote={adminNotes?.[metric.id]} />
      ))}
    </div>
  );
}
