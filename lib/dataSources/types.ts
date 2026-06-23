export type MetricConfidence = "high" | "medium" | "low";

export type MetricOrigin = "official" | "api" | "manual" | "calculated" | "fallback";

export type DataCategory =
  | "dailyPrices"
  | "marketCap"
  | "enterpriseValue"
  | "financialStatements"
  | "balanceSheet"
  | "production"
  | "reservesResources"
  | "insiderOwnership"
  | "commodityPrices"
  | "macro";

export type DataSourceCost = "free" | "free-tier" | "low-cost" | "paid";

export type DataSourceStatus = "active" | "recommended" | "fallback" | "manual";

export type DataSourceDefinition = {
  id: string;
  name: string;
  categories: DataCategory[];
  cost: DataSourceCost;
  status: DataSourceStatus;
  updateCadence: "daily" | "filing-driven" | "manual-review";
  requestStrategy: string;
  termsNote: string;
  confidence: MetricConfidence;
  url: string;
};

export type MetricQuality = {
  source: string;
  sourceUrl?: string;
  lastUpdated: string | null;
  confidence: MetricConfidence;
  origin: MetricOrigin;
  warning?: string;
};

export type SourcedMetric<T = number> = MetricQuality & {
  value: T;
};

export type SourceAdapterContext = {
  apiKey?: string;
  today: string;
  force?: boolean;
};

export type SourceAdapter<TNormalized> = {
  sourceId: string;
  fetchRaw: (context: SourceAdapterContext) => Promise<unknown>;
  normalize: (raw: unknown, context: SourceAdapterContext) => TNormalized;
};
