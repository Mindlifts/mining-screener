export type Commodity =
  | "Silver"
  | "Uranium"
  | "Copper"
  | "Gold"
  | "Coal"
  | "Rare Earths"
  | "Oil & Gas";

export type DevelopmentStage = "Producer" | "Developer";
export type JurisdictionRisk = "Low" | "Medium" | "High";

export type CompanyStatus =
  | "producer"
  | "developer"
  | "explorer"
  | "royalty"
  | "streamer"
  | "delisted"
  | "acquired";

export type InvestorUniverse =
  | "Rick Rule"
  | "Eric Sprott"
  | "Ross Beaty"
  | "Tavi Costa"
  | "Lobo Tigre";

export type CompanyTag =
  | "high torque"
  | "dilution risk"
  | "tier 1 asset"
  | "takeover candidate"
  | "low cost"
  | "high risk";

export type CommodityPrice = {
  commodity: Commodity;
  price: number;
  unit: string;
  changePercent: number;
  macroRank: number;
  quoteTime?: string;
  stale?: boolean;
  source?: string;
};

export type Company = {
  slug: string;
  company: string;
  ticker: string;
  exchange: string;
  commodity: Commodity;
  country: string;
  jurisdiction: string;
  jurisdictionRisk: JurisdictionRisk;
  stage: DevelopmentStage;
  sharePrice?: number;
  sharesOutstanding?: number;
  marketCap: number;
  enterpriseValue: number;
  revenue: number;
  ebitda: number;
  evEbitda: number | null;
  freeCashFlow?: number;
  fcfYield: number | null;
  netDebt: number;
  cash: number;
  production: number;
  productionUnit: string;
  aisc: number | null;
  aiscUnit: string;
  reserveLife: number;
  insiderOwnership: number;
  dividendYield: number;
  managementQuality: number;
  executionTrackRecord: number;
  capitalAllocation: number;
  mineBuildingTrackRecord: number;
  commodityLeverage: number;
  macroCycleScore: number;
  commodityCycleScore: number;
  realRatesSensitivity: number;
  navDiscount: number;
  evResource: number;
  resourceScale: number;
  marginOfSafety: number;
  neglectedScore: number;
  bullCase: string[];
  bearCase: string[];
  keyCatalysts: string[];
  riskFlags: string[];
  active: boolean;
  hidden: boolean;
  status: CompanyStatus;
  investorUniverses: InvestorUniverse[];
  tags: CompanyTag[];
  notes: string;
  sourceUrl: string;
  lastUpdated: string;
};
