import type { MetricConfidence, MetricOrigin, MetricQuality, SourcedMetric } from "@/lib/dataSources";

export function createMetricQuality({
  source,
  sourceUrl,
  lastUpdated,
  confidence,
  origin,
  warning
}: {
  source: string;
  sourceUrl?: string;
  lastUpdated: string | null;
  confidence: MetricConfidence;
  origin: MetricOrigin;
  warning?: string;
}): MetricQuality {
  return {
    source,
    sourceUrl,
    lastUpdated,
    confidence,
    origin,
    warning
  };
}

export function sourcedMetric<T>(value: T, quality: MetricQuality): SourcedMetric<T> {
  return { value, ...quality };
}

export function calculatedMetric<T>(
  value: T,
  source: string,
  lastUpdated: string | null,
  warning?: string
): SourcedMetric<T> {
  return sourcedMetric(value, {
    source,
    lastUpdated,
    confidence: warning ? "medium" : "high",
    origin: "calculated",
    warning
  });
}

export function pickPreferredMetric<T>(metrics: Array<SourcedMetric<T> | null | undefined>) {
  const rank: Record<MetricOrigin, number> = {
    official: 0,
    api: 1,
    manual: 2,
    calculated: 3,
    fallback: 4
  };

  return metrics
    .filter((metric): metric is SourcedMetric<T> => Boolean(metric))
    .sort((left, right) => rank[left.origin] - rank[right.origin])[0] ?? null;
}
