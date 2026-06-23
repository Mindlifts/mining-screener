import officialCache from "@/data/official-cache.json";
import commodityPriceCache from "@/data/commodity-price-cache.json";
import marketDataCache from "@/data/market-data-cache.json";
import {
  commodities,
  commodityPrices as sampleCommodityPrices,
  companies as sampleCompanies,
  getCompanyBySlug as getSampleCompanyBySlug,
  type Commodity,
  type CommodityPrice,
  type Company,
  type DevelopmentStage,
  type JurisdictionRisk
} from "@/data/mining-universe";

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

export type DataFreshness = {
  generatedAt: string | null;
  expiresAt: string | null;
  sourcePolicy: string;
  officialRecordCount: number;
  marketRecordCount: number;
  marketGeneratedAt: string | null;
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

export const dataFreshness: DataFreshness = {
  generatedAt: cache.generatedAt,
  expiresAt: cache.expiresAt,
  sourcePolicy: cache.sourcePolicy,
  officialRecordCount: Object.keys(cache.records).length,
  marketRecordCount: Object.keys(marketCache.records).length,
  marketGeneratedAt: marketCache.generatedAt
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

export const companies: Company[] = sampleCompanies.map((company) => {
  const officialMetrics = cache.records[company.slug]?.metrics ?? {};
  const marketMetrics = marketCache.records[company.slug]?.metrics ?? {};
  const merged = {
    ...company,
    ...officialMetrics,
    ...marketMetrics
  };

  // Real API hook: when a market data provider supplies daily price and shares,
  // keep valuation ratios derived here so table rankings stay internally consistent.
  const netDebt = typeof merged.netDebt === "number" ? merged.netDebt : 0;
  if (typeof merged.marketCap === "number") {
    merged.enterpriseValue = Math.round((merged.marketCap + netDebt) * 10) / 10;
  }
  if (typeof merged.enterpriseValue === "number" && typeof merged.ebitda === "number" && merged.ebitda > 0) {
    merged.evEbitda = Math.round((merged.enterpriseValue / merged.ebitda) * 10) / 10;
  }
  if (typeof merged.freeCashFlow === "number" && typeof merged.marketCap === "number" && merged.marketCap > 0) {
    merged.fcfYield = Math.round((merged.freeCashFlow / merged.marketCap) * 1000) / 10;
  }

  return merged;
});

export function getCompanyBySlug(slug: string) {
  const company = companies.find((item) => item.slug === slug);
  return company ?? getSampleCompanyBySlug(slug);
}

export function getOfficialRecord(slug: string) {
  return cache.records[slug] ?? null;
}

export function getMarketRecord(slug: string) {
  return marketCache.records[slug] ?? null;
}
