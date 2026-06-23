import officialCache from "@/data/official-cache.json";
import {
  commodities,
  commodityPrices,
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

export type DataFreshness = {
  generatedAt: string | null;
  expiresAt: string | null;
  sourcePolicy: string;
  officialRecordCount: number;
};

export type {
  Commodity,
  CommodityPrice,
  Company,
  DevelopmentStage,
  JurisdictionRisk
};

const cache = officialCache as OfficialCache;

export const dataFreshness: DataFreshness = {
  generatedAt: cache.generatedAt,
  expiresAt: cache.expiresAt,
  sourcePolicy: cache.sourcePolicy,
  officialRecordCount: Object.keys(cache.records).length
};

export { commodities, commodityPrices };

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
