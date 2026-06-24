import companiesJson from "@/data/companies.json";
import type {
  Commodity,
  CommodityPrice,
  Company,
  DevelopmentStage,
  JurisdictionRisk
} from "@/types/company";

export type {
  Commodity,
  CommodityPrice,
  Company,
  DevelopmentStage,
  JurisdictionRisk
} from "@/types/company";

export const commodities: Commodity[] = [
  "Silver",
  "Uranium",
  "Copper",
  "Gold",
  "Coal",
  "Rare Earths",
  "Oil & Gas"
];

export const commodityPrices: CommodityPrice[] = [
  { commodity: "Gold", price: 2345, unit: "USD/oz", changePercent: 0.9, macroRank: 92 },
  { commodity: "Silver", price: 29.42, unit: "USD/oz", changePercent: 1.8, macroRank: 88 },
  { commodity: "Copper", price: 4.52, unit: "USD/lb", changePercent: -0.4, macroRank: 82 },
  { commodity: "Uranium", price: 86.25, unit: "USD/lb U3O8", changePercent: 0.6, macroRank: 76 },
  { commodity: "Coal", price: 138, unit: "USD/t Newcastle", changePercent: -1.1, macroRank: 42 },
  { commodity: "Rare Earths", price: 58, unit: "NdPr index", changePercent: 0.4, macroRank: 68 },
  { commodity: "Oil & Gas", price: 82, unit: "WTI USD/bbl", changePercent: 1.2, macroRank: 64 }
];

export const companies = companiesJson as Company[];

export function getCompanyBySlug(slug: string) {
  return companies.find((company) => company.slug === slug);
}
