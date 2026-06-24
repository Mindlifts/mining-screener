import officialCache from "@/data/official-cache.json";
import commodityPriceCache from "@/data/commodity-price-cache.json";
import marketDataCache from "@/data/market-data-cache.json";
import manualMiningMetrics from "@/data/manualMiningMetrics.json";
import { latestIsoDate, toDisplayDate } from "@/lib/dataCache";
import type { MetricQuality } from "@/lib/dataSources";
import {
  commodities,
  commodityPrices as sampleCommodityPrices,
  type Commodity,
  type CommodityPrice,
  type Company,
  type DevelopmentStage,
  type JurisdictionRisk
} from "@/data/mining-universe";
import { getVisibleCompanies, getVisibleCompanyBySlug } from "@/lib/universe";

type OfficialMetricPatch = Partial<
  Pick<
    Company,
    | "marketCap"
    | "enterpriseValue"
    | "revenue"
    | "ebitda"
    | "evEbitda"
    | "freeCashFlow"
    | "fcfYield"
    | "netDebt"
    | "cash"
    | "dividendYield"
    | "sharesOutstanding"
  >
>;

type MarketMetricPatch = Partial<
  Pick<
    Company,
    | "sharePrice"
    | "sharesOutstanding"
    | "marketCap"
    | "enterpriseValue"
    | "evEbitda"
  >
>;

type OfficialCacheRecord = {
  source: string;
  sourceUrl: string;
  regulator: string;
  filedAt?: string;
  refreshedAt: string;
  metrics: OfficialMetricPatch;
  warnings?: string[];
};

type OfficialCache = {
  generatedAt: string | null;
  expiresAt: string | null;
  sourcePolicy: string;
  records: Record<string, OfficialCacheRecord>;
};

type CommodityPriceCacheRecord = {
  price: number;
  changePercent: number;
  source: string;
  sourceUrl?: string;
  refreshedAt: string;
  quoteTime?: string;
  stale?: boolean;
};

type CommodityPriceCache = {
  generatedAt: string | null;
  expiresAt: string | null;
  sourcePolicy: string;
  records: Partial<Record<Commodity, CommodityPriceCacheRecord>>;
};

type MarketDataCacheRecord = {
  source: string;
  sourceUrl: string;
  currency: string;
  quoteTime?: string;
  refreshedAt: string;
  metrics: MarketMetricPatch;
  warnings?: string[];
};

type MarketDataCache = {
  generatedAt: string | null;
  expiresAt: string | null;
  sourcePolicy: string;
  records: Record<string, MarketDataCacheRecord>;
};

type ManualMetricRecord = {
  source: string;
  sourceUrl?: string;
  lastUpdated: string | null;
  confidence: "high" | "medium" | "low";
  origin: "manual";
  warning?: string;
};

type ManualMiningMetrics = {
  lastUpdated: string;
  sourcePolicy: string;
  records: Record<string, Record<string, ManualMetricRecord & { value: number; unit?: string }>>;
};

export type DataFreshness = {
  generatedAt: string | null;
  expiresAt: string | null;
  sourcePolicy: string;
  officialRecordCount: number;
  marketRecordCount: number;
  marketGeneratedAt: string | null;
  lastUpdated: string | null;
  lastUpdatedDate: string;
};

export type CommodityPriceFreshness = {
  generatedAt: string | null;
  expiresAt: string | null;
  sourcePolicy: string;
  cachedPriceCount: number;
};

export type {
  Commodity,
  CommodityPrice,
  Company,
  DevelopmentStage,
  JurisdictionRisk
};

const cache = officialCache as OfficialCache;
const priceCache = commodityPriceCache as CommodityPriceCache;
const marketCache = marketDataCache as MarketDataCache;
const manualMetrics = manualMiningMetrics as ManualMiningMetrics;

const lastUpdated = latestIsoDate([
  cache.generatedAt,
  marketCache.generatedAt,
  priceCache.generatedAt,
  manualMetrics.lastUpdated
]);

export const dataFreshness: DataFreshness = {
  generatedAt: cache.generatedAt,
  expiresAt: cache.expiresAt,
  sourcePolicy: cache.sourcePolicy,
  officialRecordCount: Object.keys(cache.records).length,
  marketRecordCount: Object.keys(marketCache.records).length,
  marketGeneratedAt: marketCache.generatedAt,
  lastUpdated,
  lastUpdatedDate: toDisplayDate(lastUpdated)
};

export const commodityPriceFreshness: CommodityPriceFreshness = {
  generatedAt: priceCache.generatedAt,
  expiresAt: priceCache.expiresAt,
  sourcePolicy: priceCache.sourcePolicy,
  cachedPriceCount: Object.keys(priceCache.records).length
};

export const commodityPrices: CommodityPrice[] = sampleCommodityPrices.map((price) => {
  const cached = priceCache.records[price.commodity];

  return {
    ...price,
    price: cached?.price ?? price.price,
    changePercent: cached?.changePercent ?? price.changePercent,
    quoteTime: cached?.quoteTime,
    stale: cached?.stale,
    source: cached?.source
  };
});

export { commodities };

export const companies: Company[] = getVisibleCompanies().map((company) => {
  const officialMetrics = cache.records[company.slug]?.metrics ?? {};
  const marketMetrics = marketCache.records[company.slug]?.metrics ?? {};
  const hasDirectEnterpriseValue = marketMetrics.enterpriseValue !== undefined || officialMetrics.enterpriseValue !== undefined;
  const hasDirectEvEbitda = marketMetrics.evEbitda !== undefined || officialMetrics.evEbitda !== undefined;
  const hasDirectFcfYield = officialMetrics.fcfYield !== undefined;
  const merged = {
    ...company,
    ...officialMetrics,
    ...marketMetrics
  };

  // Real API hook: when a market data provider supplies daily price and shares,
  // keep valuation ratios derived here so table rankings stay internally consistent.
  const netDebt = typeof merged.netDebt === "number" ? merged.netDebt : 0;
  if (!hasDirectEnterpriseValue && typeof merged.marketCap === "number") {
    merged.enterpriseValue = Math.round((merged.marketCap + netDebt) * 10) / 10;
  }
  if (!hasDirectEvEbitda && typeof merged.enterpriseValue === "number" && typeof merged.ebitda === "number" && merged.ebitda > 0) {
    merged.evEbitda = Math.round((merged.enterpriseValue / merged.ebitda) * 10) / 10;
  }
  if (!hasDirectFcfYield && typeof merged.freeCashFlow === "number" && typeof merged.marketCap === "number" && merged.marketCap > 0) {
    merged.fcfYield = Math.round((merged.freeCashFlow / merged.marketCap) * 1000) / 10;
  }

  return merged;
});

export function getCompanyBySlug(slug: string) {
  const company = companies.find((item) => item.slug === slug);
  return company ?? getVisibleCompanyBySlug(slug);
}

export function getOfficialRecord(slug: string) {
  return cache.records[slug] ?? null;
}

export function getMarketRecord(slug: string) {
  return marketCache.records[slug] ?? null;
}

export function getMetricQuality(slug: string, metric: keyof Company): MetricQuality {
  const marketRecord = marketCache.records[slug];
  const officialRecord = cache.records[slug];
  const manualRecord = manualMetrics.records[slug]?.[String(metric)];

  if (metric === "enterpriseValue" && marketRecord?.metrics.marketCap !== undefined) {
    return {
      source: "Calculated from market cap plus net debt",
      lastUpdated: latestIsoDate([marketRecord.quoteTime, marketRecord.refreshedAt, officialRecord?.refreshedAt]),
      confidence: officialRecord?.metrics.netDebt !== undefined ? "medium" : "low",
      origin: "calculated",
      warning: officialRecord?.metrics.netDebt === undefined ? "Net debt fallback may be stale." : undefined
    };
  }

  if (metric === "evEbitda" && marketRecord?.metrics.marketCap !== undefined) {
    return {
      source: "Calculated from enterprise value and EBITDA",
      lastUpdated: latestIsoDate([marketRecord.quoteTime, marketRecord.refreshedAt, officialRecord?.refreshedAt]),
      confidence: officialRecord?.metrics.freeCashFlow !== undefined || officialRecord?.metrics.revenue !== undefined ? "medium" : "low",
      origin: "calculated",
      warning: "Use direct source EV/EBITDA when a fundamentals provider is configured."
    };
  }

  if (metric === "fcfYield" && officialRecord?.metrics.freeCashFlow !== undefined && marketRecord?.metrics.marketCap !== undefined) {
    return {
      source: "Calculated from official free cash flow and market cap",
      lastUpdated: latestIsoDate([marketRecord.quoteTime, marketRecord.refreshedAt, officialRecord.filedAt]),
      confidence: "high",
      origin: "calculated"
    };
  }

  if (marketRecord?.metrics?.[metric as keyof MarketMetricPatch] !== undefined) {
    return {
      source: marketRecord.source,
      sourceUrl: marketRecord.sourceUrl,
      lastUpdated: marketRecord.quoteTime ?? marketRecord.refreshedAt,
      confidence: marketRecord.warnings?.length ? "medium" : "high",
      origin: "api",
      warning: marketRecord.warnings?.[0]
    };
  }

  if (officialRecord?.metrics?.[metric as keyof OfficialMetricPatch] !== undefined) {
    return {
      source: officialRecord.source,
      sourceUrl: officialRecord.sourceUrl,
      lastUpdated: officialRecord.filedAt ?? officialRecord.refreshedAt,
      confidence: officialRecord.warnings?.length ? "medium" : "high",
      origin: "official",
      warning: officialRecord.warnings?.[0]
    };
  }

  if (manualRecord) {
    return {
      source: manualRecord.source,
      sourceUrl: manualRecord.sourceUrl,
      lastUpdated: manualRecord.lastUpdated,
      confidence: manualRecord.confidence,
      origin: manualRecord.origin,
      warning: manualRecord.warning
    };
  }

  return {
    source: "Static universe fallback",
    lastUpdated: manualMetrics.lastUpdated,
    confidence: "low",
    origin: "fallback",
    warning: "No API or manual metric source is configured for this field."
  };
}
