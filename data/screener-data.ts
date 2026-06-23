import officialCache from "@/data/official-cache.json";
import commodityPriceCache from "@/data/commodity-price-cache.json";
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
    | "fcfYield"
    | "netDebt"
    | "cash"
    | "dividendYield"
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
};

type CommodityPriceCache = {
  generatedAt: string | null;
  expiresAt: string | null;
  sourcePolicy: string;
  records: Partial<Record<Commodity, CommodityPriceCacheRecord>>;
};

export type DataFreshness = {
  generatedAt: string | null;
  expiresAt: string | null;
  sourcePolicy: string;
  officialRecordCount: number;
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

export const dataFreshness: DataFreshness = {
  generatedAt: cache.generatedAt,
  expiresAt: cache.expiresAt,
  sourcePolicy: cache.sourcePolicy,
  officialRecordCount: Object.keys(cache.records).length
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
    changePercent: cached?.changePercent ?? price.changePercent
  };
});

export { commodities };

export const companies: Company[] = sampleCompanies.map((company) => ({
  ...company,
  ...(cache.records[company.slug]?.metrics ?? {})
}));

export function getCompanyBySlug(slug: string) {
  const company = companies.find((item) => item.slug === slug);
  return company ?? getSampleCompanyBySlug(slug);
}

export function getOfficialRecord(slug: string) {
  return cache.records[slug] ?? null;
}
