import {
  getCompanyBySlug,
  getMetricQuality,
  type Commodity,
  type JurisdictionRisk
} from "@/data/screener-data";
import {
  scoreCompany,
  type InvestorMode
} from "@/lib/scoring";
import type { MetricQuality } from "@/lib/dataSources";

export type AssetProductionStage = "Producer" | "Developer" | "Explorer";
export type AssetRiskLevel = JurisdictionRisk;
export type AssetInvestorMode = Exclude<InvestorMode, "Custom">;
export type CoordinatePrecision = "site" | "district" | "regional";

export type AssetSource = {
  name: string;
  url: string;
  documentType: "official-project-page" | "annual-report" | "technical-report" | "regulator-filing";
  lastVerified: string;
};

export type MiningAsset = {
  id: string;
  companySlug: string;
  company: string;
  ticker: string;
  commodity: Commodity;
  assetName: string;
  country: string;
  jurisdiction: string;
  latitude: number;
  longitude: number;
  coordinatePrecision: CoordinatePrecision;
  productionStage: AssetProductionStage;
  marketCap: number;
  marketCapQuality: MetricQuality | null;
  investorModeScore: Record<AssetInvestorMode, number>;
  scoreMethod: "calculated";
  riskLevel: AssetRiskLevel;
  riskMethod: "research-model";
  keyCatalyst: string;
  source: AssetSource;
};

type OfficialAssetRecord = Omit<
  MiningAsset,
  | "company"
  | "ticker"
  | "commodity"
  | "marketCap"
  | "marketCapQuality"
  | "investorModeScore"
  | "scoreMethod"
  | "riskMethod"
>;

export const assetInvestorModes: AssetInvestorMode[] = [
  "Rick Rule",
  "Eric Sprott",
  "Ross Beaty",
  "Tavi Costa",
  "Lobo Tigre"
];

const verifiedOn = "2026-06-23";

// Asset facts come from issuer project pages, technical reports, annual reports,
// or regulator filings. Coordinates are intentionally labelled by precision:
// district/regional points are suitable for this world view, not site navigation.
const officialAssetRecords: OfficialAssetRecord[] = [
  {
    id: "paas-la-colorada",
    companySlug: "pan-american-silver",
    assetName: "La Colorada",
    country: "Mexico",
    jurisdiction: "Zacatecas",
    latitude: 23.42,
    longitude: -103.72,
    coordinatePrecision: "district",
    productionStage: "Producer",
    riskLevel: "Medium",
    keyCatalyst: "La Colorada Skarn development and ventilation infrastructure",
    source: {
      name: "Pan American Silver - Financial reports and filings",
      url: "https://www.panamericansilver.com/invest/financial-reports-and-filings/",
      documentType: "annual-report",
      lastVerified: verifiedOn
    }
  },
  {
    id: "ag-san-dimas",
    companySlug: "first-majestic-silver",
    assetName: "San Dimas",
    country: "Mexico",
    jurisdiction: "Durango",
    latitude: 24.11,
    longitude: -105.93,
    coordinatePrecision: "district",
    productionStage: "Producer",
    riskLevel: "Medium",
    keyCatalyst: "Mine development and conversion of high-grade silver-gold resources",
    source: {
      name: "First Majestic - Financial reports and technical disclosures",
      url: "https://www.firstmajestic.com/investors/financials/",
      documentType: "annual-report",
      lastVerified: verifiedOn
    }
  },
  {
    id: "exk-terronera",
    companySlug: "endeavour-silver",
    assetName: "Terronera",
    country: "Mexico",
    jurisdiction: "Jalisco",
    latitude: 20.67,
    longitude: -105.08,
    coordinatePrecision: "district",
    productionStage: "Producer",
    riskLevel: "Medium",
    keyCatalyst: "Ramp-up to designed processing capacity",
    source: {
      name: "Endeavour Silver - Terronera",
      url: "https://edrsilver.com/portfolio/terronera/",
      documentType: "official-project-page",
      lastVerified: verifiedOn
    }
  },
  {
    id: "cameco-mcarthur-river",
    companySlug: "cameco",
    assetName: "McArthur River / Key Lake",
    country: "Canada",
    jurisdiction: "Saskatchewan",
    latitude: 57.76,
    longitude: -105.05,
    coordinatePrecision: "site",
    productionStage: "Producer",
    riskLevel: "Low",
    keyCatalyst: "Production plan execution and long-term uranium contracting",
    source: {
      name: "Cameco - McArthur River/Key Lake",
      url: "https://www.cameco.com/businesses/uranium-operations/canada/mcarthur-river-key-lake",
      documentType: "official-project-page",
      lastVerified: verifiedOn
    }
  },
  {
    id: "nexgen-rook-i",
    companySlug: "nexgen-energy",
    assetName: "Rook I",
    country: "Canada",
    jurisdiction: "Saskatchewan",
    latitude: 57.78,
    longitude: -109.0,
    coordinatePrecision: "district",
    productionStage: "Developer",
    riskLevel: "Low",
    keyCatalyst: "Federal approvals, detailed engineering, and project financing",
    source: {
      name: "NexGen Energy - Rook I Project",
      url: "https://www.nexgenenergy.ca/rook-i-project/",
      documentType: "official-project-page",
      lastVerified: verifiedOn
    }
  },
  {
    id: "denison-wheeler-river",
    companySlug: "denison-mines",
    assetName: "Wheeler River",
    country: "Canada",
    jurisdiction: "Saskatchewan",
    latitude: 57.46,
    longitude: -105.43,
    coordinatePrecision: "district",
    productionStage: "Developer",
    riskLevel: "Low",
    keyCatalyst: "Phoenix final investment decision and construction readiness",
    source: {
      name: "Denison Mines - Wheeler River Project",
      url: "https://denisonmines.com/projects/wheeler-river-project/",
      documentType: "official-project-page",
      lastVerified: verifiedOn
    }
  },
  {
    id: "fcx-grasberg",
    companySlug: "freeport-mcmoran",
    assetName: "Grasberg Minerals District",
    country: "Indonesia",
    jurisdiction: "Central Papua",
    latitude: -4.05,
    longitude: 137.12,
    coordinatePrecision: "district",
    productionStage: "Producer",
    riskLevel: "High",
    keyCatalyst: "Underground mine ramp-up and Indonesian smelter normalization",
    source: {
      name: "Freeport-McMoRan - Indonesia operations",
      url: "https://fcx.com/operations/indonesia",
      documentType: "official-project-page",
      lastVerified: verifiedOn
    }
  },
  {
    id: "ivanhoe-kamoa-kakula",
    companySlug: "ivanhoe-mines",
    assetName: "Kamoa-Kakula",
    country: "DR Congo",
    jurisdiction: "Lualaba",
    latitude: -10.77,
    longitude: 25.25,
    coordinatePrecision: "district",
    productionStage: "Producer",
    riskLevel: "High",
    keyCatalyst: "Phase 3 optimization and on-site smelter ramp-up",
    source: {
      name: "Ivanhoe Mines - Kamoa-Kakula Mining Complex",
      url: "https://www.ivanhoemines.com/what-we-do/operations-projects/kamoa-kakula-mining-complex/",
      documentType: "official-project-page",
      lastVerified: verifiedOn
    }
  },
  {
    id: "scco-buenavista",
    companySlug: "southern-copper",
    assetName: "Buenavista",
    country: "Mexico",
    jurisdiction: "Sonora",
    latitude: 30.96,
    longitude: -110.31,
    coordinatePrecision: "site",
    productionStage: "Producer",
    riskLevel: "Medium",
    keyCatalyst: "Concentrator expansion and zinc project ramp-up",
    source: {
      name: "Southern Copper - SEC filing record",
      url: "https://www.sec.gov/edgar/browse/?CIK=1001838&owner=exclude",
      documentType: "regulator-filing",
      lastVerified: verifiedOn
    }
  },
  {
    id: "newmont-cadia",
    companySlug: "newmont",
    assetName: "Cadia",
    country: "Australia",
    jurisdiction: "New South Wales",
    latitude: -33.45,
    longitude: 148.99,
    coordinatePrecision: "site",
    productionStage: "Producer",
    riskLevel: "Low",
    keyCatalyst: "Block cave expansion and recovery optimization",
    source: {
      name: "Newmont - Cadia",
      url: "https://www.newmont.com/operations-and-projects/global-presence/australia/cadia-australia/default.aspx",
      documentType: "official-project-page",
      lastVerified: verifiedOn
    }
  },
  {
    id: "agnico-canadian-malartic",
    companySlug: "agnico-eagle",
    assetName: "Canadian Malartic Complex",
    country: "Canada",
    jurisdiction: "Quebec",
    latitude: 48.13,
    longitude: -78.13,
    coordinatePrecision: "site",
    productionStage: "Producer",
    riskLevel: "Low",
    keyCatalyst: "Odyssey underground production growth",
    source: {
      name: "Agnico Eagle - Canadian Malartic Complex",
      url: "https://www.agnicoeagle.com/English/operations/operations/canadian-malartic-complex/default.aspx",
      documentType: "official-project-page",
      lastVerified: verifiedOn
    }
  },
  {
    id: "barrick-nevada-gold-mines",
    companySlug: "barrick-gold",
    assetName: "Nevada Gold Mines",
    country: "United States",
    jurisdiction: "Nevada",
    latitude: 40.73,
    longitude: -116.24,
    coordinatePrecision: "regional",
    productionStage: "Producer",
    riskLevel: "Low",
    keyCatalyst: "Goldrush ramp-up and Fourmile development work",
    source: {
      name: "Barrick Mining - Nevada Gold Mines",
      url: "https://www.barrick.com/English/operations/nevada-gold-mines/default.aspx",
      documentType: "official-project-page",
      lastVerified: verifiedOn
    }
  },
  {
    id: "peabody-narm",
    companySlug: "peabody-energy",
    assetName: "North Antelope Rochelle",
    country: "United States",
    jurisdiction: "Wyoming",
    latitude: 43.56,
    longitude: -105.29,
    coordinatePrecision: "site",
    productionStage: "Producer",
    riskLevel: "Low",
    keyCatalyst: "Productivity, cost control, and Powder River Basin demand",
    source: {
      name: "Peabody - North Antelope Rochelle Mine",
      url: "https://www.peabodyenergy.com/Operations/US-Thermal/North-Antelope-Rochelle-Mine",
      documentType: "official-project-page",
      lastVerified: verifiedOn
    }
  },
  {
    id: "cnr-leer-south",
    companySlug: "core-natural-resources",
    assetName: "Leer South",
    country: "United States",
    jurisdiction: "West Virginia",
    latitude: 39.25,
    longitude: -80.02,
    coordinatePrecision: "regional",
    productionStage: "Producer",
    riskLevel: "Low",
    keyCatalyst: "Longwall productivity and metallurgical coal realization",
    source: {
      name: "Core Natural Resources - SEC filing record",
      url: "https://www.sec.gov/edgar/search/",
      documentType: "regulator-filing",
      lastVerified: verifiedOn
    }
  },
  {
    id: "whitehaven-blackwater",
    companySlug: "whitehaven-coal",
    assetName: "Blackwater",
    country: "Australia",
    jurisdiction: "Queensland",
    latitude: -23.71,
    longitude: 148.8,
    coordinatePrecision: "site",
    productionStage: "Producer",
    riskLevel: "Low",
    keyCatalyst: "Operational integration and mine-plan optimization",
    source: {
      name: "Whitehaven Coal - Blackwater Mine",
      url: "https://whitehavencoal.com.au/our-business/our-assets/blackwater-mine/",
      documentType: "official-project-page",
      lastVerified: verifiedOn
    }
  },
  {
    id: "hecla-greens-creek",
    companySlug: "hecla-mining",
    assetName: "Greens Creek",
    country: "United States",
    jurisdiction: "Alaska",
    latitude: 58.08,
    longitude: -134.64,
    coordinatePrecision: "site",
    productionStage: "Producer",
    riskLevel: "Low",
    keyCatalyst: "Reserve conversion and sustained high-grade production",
    source: {
      name: "Hecla Mining - Greens Creek",
      url: "https://www.hecla.com/operations/greens-creek-alaska/",
      documentType: "official-project-page",
      lastVerified: verifiedOn
    }
  },
  {
    id: "vizsla-panuco",
    companySlug: "vizsla-silver",
    assetName: "Panuco",
    country: "Mexico",
    jurisdiction: "Sinaloa",
    latitude: 23.22,
    longitude: -105.65,
    coordinatePrecision: "district",
    productionStage: "Developer",
    riskLevel: "Medium",
    keyCatalyst: "Feasibility work and district-scale resource drilling",
    source: {
      name: "Vizsla Silver - Panuco Project",
      url: "https://vizslasilvercorp.com/projects/panuco-project/overview/",
      documentType: "official-project-page",
      lastVerified: verifiedOn
    }
  },
  {
    id: "agmr-reliquias",
    companySlug: "silver-mountain-resources",
    assetName: "Reliquias",
    country: "Peru",
    jurisdiction: "Huancavelica",
    latitude: -12.97,
    longitude: -75.12,
    coordinatePrecision: "district",
    productionStage: "Developer",
    riskLevel: "Medium",
    keyCatalyst: "Permitting and restart financing",
    source: {
      name: "Silver Mountain Resources - SEDAR+ filing record",
      url: "https://www.sedarplus.ca/",
      documentType: "regulator-filing",
      lastVerified: verifiedOn
    }
  },
  {
    id: "excellon-kilgore",
    companySlug: "excellon-resources",
    assetName: "Kilgore",
    country: "United States",
    jurisdiction: "Idaho",
    latitude: 44.43,
    longitude: -111.16,
    coordinatePrecision: "district",
    productionStage: "Explorer",
    riskLevel: "Low",
    keyCatalyst: "Resource definition and permitting work",
    source: {
      name: "Excellon Resources - SEDAR+ technical disclosures",
      url: "https://www.sedarplus.ca/",
      documentType: "regulator-filing",
      lastVerified: verifiedOn
    }
  },
  {
    id: "abrasilver-diablillos",
    companySlug: "abrasilver-resource",
    assetName: "Diablillos",
    country: "Argentina",
    jurisdiction: "Salta",
    latitude: -25.29,
    longitude: -67.9,
    coordinatePrecision: "district",
    productionStage: "Developer",
    riskLevel: "Medium",
    keyCatalyst: "Definitive feasibility study and permitting",
    source: {
      name: "AbraSilver - Diablillos Project",
      url: "https://abrasilver.com/projects/diablillos/",
      documentType: "official-project-page",
      lastVerified: verifiedOn
    }
  },
  {
    id: "tudor-treaty-creek",
    companySlug: "tudor-gold",
    assetName: "Treaty Creek",
    country: "Canada",
    jurisdiction: "British Columbia",
    latitude: 56.62,
    longitude: -130.08,
    coordinatePrecision: "district",
    productionStage: "Explorer",
    riskLevel: "Medium",
    keyCatalyst: "Goldstorm resource expansion in the Golden Triangle",
    source: {
      name: "Tudor Gold - Treaty Creek",
      url: "https://tudor-gold.com/treaty-creek/",
      documentType: "official-project-page",
      lastVerified: verifiedOn
    }
  },
  {
    id: "gogold-los-ricos-south",
    companySlug: "gogold-resources",
    assetName: "Los Ricos South",
    country: "Mexico",
    jurisdiction: "Jalisco",
    latitude: 20.42,
    longitude: -103.8,
    coordinatePrecision: "district",
    productionStage: "Developer",
    riskLevel: "Medium",
    keyCatalyst: "Engineering, permitting, and development decision",
    source: {
      name: "GoGold Resources - SEDAR+ technical disclosures",
      url: "https://www.sedarplus.ca/",
      documentType: "regulator-filing",
      lastVerified: verifiedOn
    }
  },
  {
    id: "paladin-langer-heinrich",
    companySlug: "paladin-energy",
    assetName: "Langer Heinrich",
    country: "Namibia",
    jurisdiction: "Erongo",
    latitude: -22.81,
    longitude: 15.33,
    coordinatePrecision: "site",
    productionStage: "Producer",
    riskLevel: "Medium",
    keyCatalyst: "Ramp-up toward nameplate uranium production",
    source: {
      name: "Paladin Energy - Langer Heinrich Mine",
      url: "https://www.paladinenergy.com.au/langer-heinrich-mine/",
      documentType: "official-project-page",
      lastVerified: verifiedOn
    }
  },
  {
    id: "stallion-coffer",
    companySlug: "stallion-uranium",
    assetName: "Coffer Project",
    country: "Canada",
    jurisdiction: "Saskatchewan",
    latitude: 57.65,
    longitude: -109.55,
    coordinatePrecision: "regional",
    productionStage: "Explorer",
    riskLevel: "Low",
    keyCatalyst: "Athabasca Basin drill targeting and follow-up exploration",
    source: {
      name: "Stallion Uranium - Coffer Project",
      url: "https://stallionuranium.com/projects/coffer-project/",
      documentType: "official-project-page",
      lastVerified: verifiedOn
    }
  },
  {
    id: "lotus-kayelekera",
    companySlug: "lotus-resources",
    assetName: "Kayelekera",
    country: "Malawi",
    jurisdiction: "Karonga",
    latitude: -9.99,
    longitude: 33.7,
    coordinatePrecision: "site",
    productionStage: "Developer",
    riskLevel: "High",
    keyCatalyst: "Restart construction, financing, and uranium contracting",
    source: {
      name: "Lotus Resources - ASX announcements",
      url: "https://lotusresources.com.au/investors/asx-announcements/",
      documentType: "regulator-filing",
      lastVerified: verifiedOn
    }
  },
  {
    id: "eqr-mt-carbine",
    companySlug: "eq-resources",
    assetName: "Mt Carbine",
    country: "Australia",
    jurisdiction: "Queensland",
    latitude: -16.53,
    longitude: 145.13,
    coordinatePrecision: "site",
    productionStage: "Producer",
    riskLevel: "Low",
    keyCatalyst: "Underground ramp-up and tungsten recovery optimization",
    source: {
      name: "EQ Resources - Mt Carbine",
      url: "https://eqresources.com.au/mt-carbine/",
      documentType: "official-project-page",
      lastVerified: verifiedOn
    }
  },
  {
    id: "lynas-mt-weld",
    companySlug: "lynas-rare-earths",
    assetName: "Mt Weld",
    country: "Australia",
    jurisdiction: "Western Australia",
    latitude: -28.86,
    longitude: 122.09,
    coordinatePrecision: "site",
    productionStage: "Producer",
    riskLevel: "Low",
    keyCatalyst: "Expansion ramp-up and NdPr market recovery",
    source: {
      name: "Lynas Rare Earths - Mt Weld",
      url: "https://lynasrareearths.com/about-us/locations/mt-weld-western-australia/",
      documentType: "official-project-page",
      lastVerified: verifiedOn
    }
  },
  {
    id: "mkango-songwe-hill",
    companySlug: "mkango-resources",
    assetName: "Songwe Hill",
    country: "Malawi",
    jurisdiction: "Phalombe",
    latitude: -15.02,
    longitude: 35.68,
    coordinatePrecision: "district",
    productionStage: "Developer",
    riskLevel: "High",
    keyCatalyst: "Project financing and strategic development partnership",
    source: {
      name: "Mkango Resources - Investor centre",
      url: "https://mkango.ca/investors/",
      documentType: "annual-report",
      lastVerified: verifiedOn
    }
  },
  {
    id: "larvotto-hillgrove",
    companySlug: "larvotto-resources",
    assetName: "Hillgrove",
    country: "Australia",
    jurisdiction: "New South Wales",
    latitude: -30.57,
    longitude: 151.9,
    coordinatePrecision: "district",
    productionStage: "Developer",
    riskLevel: "Low",
    keyCatalyst: "Antimony-gold project financing and construction readiness",
    source: {
      name: "Larvotto Resources - Hillgrove",
      url: "https://larvottoresources.com/hillgrove/",
      documentType: "official-project-page",
      lastVerified: verifiedOn
    }
  },
  {
    id: "prairie-shelduck-south",
    companySlug: "prairie-operating",
    assetName: "Shelduck South",
    country: "United States",
    jurisdiction: "Colorado",
    latitude: 40.45,
    longitude: -104.45,
    coordinatePrecision: "regional",
    productionStage: "Producer",
    riskLevel: "Medium",
    keyCatalyst: "Development drilling and production growth",
    source: {
      name: "Prairie Operating - SEC filings",
      url: "https://www.sec.gov/edgar/browse/?CIK=1162896&owner=exclude",
      documentType: "regulator-filing",
      lastVerified: verifiedOn
    }
  },
  {
    id: "cnq-horizon",
    companySlug: "canadian-natural-resources",
    assetName: "Horizon Oil Sands",
    country: "Canada",
    jurisdiction: "Alberta",
    latitude: 57.34,
    longitude: -111.75,
    coordinatePrecision: "site",
    productionStage: "Producer",
    riskLevel: "Low",
    keyCatalyst: "Long-life production optimization and debottlenecking",
    source: {
      name: "Canadian Natural - Investor reports and filings",
      url: "https://www.cnrl.com/investors/",
      documentType: "annual-report",
      lastVerified: verifiedOn
    }
  },
  {
    id: "arc-attachie",
    companySlug: "arc-resources",
    assetName: "Attachie",
    country: "Canada",
    jurisdiction: "British Columbia",
    latitude: 56.33,
    longitude: -121.4,
    coordinatePrecision: "regional",
    productionStage: "Producer",
    riskLevel: "Low",
    keyCatalyst: "Attachie Phase I ramp-up and future development phases",
    source: {
      name: "ARC Resources - Attachie",
      url: "https://www.arcresources.com/operations/attachie/",
      documentType: "official-project-page",
      lastVerified: verifiedOn
    }
  },
  {
    id: "sandfire-matsa",
    companySlug: "sandfire-resources",
    assetName: "MATSA",
    country: "Spain",
    jurisdiction: "Andalusia",
    latitude: 37.72,
    longitude: -6.67,
    coordinatePrecision: "district",
    productionStage: "Producer",
    riskLevel: "Low",
    keyCatalyst: "Mine-life extension and processing optimization",
    source: {
      name: "Sandfire Resources - MATSA",
      url: "https://www.sandfire.com.au/operations/matsa/",
      documentType: "official-project-page",
      lastVerified: verifiedOn
    }
  },
  {
    id: "aeris-tritton",
    companySlug: "aeris-resources",
    assetName: "Tritton Operations",
    country: "Australia",
    jurisdiction: "New South Wales",
    latitude: -31.56,
    longitude: 146.2,
    coordinatePrecision: "district",
    productionStage: "Producer",
    riskLevel: "Low",
    keyCatalyst: "Budgerygar and Avoca Tank production contribution",
    source: {
      name: "Aeris Resources - Tritton",
      url: "https://aerisresources.com.au/operations/tritton/",
      documentType: "official-project-page",
      lastVerified: verifiedOn
    }
  }
];

function buildModeScores(
  company: NonNullable<ReturnType<typeof getCompanyBySlug>>
): Record<AssetInvestorMode, number> {
  return Object.fromEntries(
    assetInvestorModes.map((mode) => [mode, scoreCompany(company, mode).total])
  ) as Record<AssetInvestorMode, number>;
}

export const miningAssets: MiningAsset[] = officialAssetRecords.flatMap((asset) => {
  const company = getCompanyBySlug(asset.companySlug);

  // Universe controls apply to public asset surfaces as well as the screener.
  if (!company) {
    return [];
  }

  return [{
    ...asset,
    company: company.company,
    ticker: company.ticker,
    commodity: company.commodity,
    marketCap: company.marketCap,
    marketCapQuality: getMetricQuality(company.slug, "marketCap"),
    investorModeScore: buildModeScores(company),
    scoreMethod: "calculated",
    riskMethod: "research-model"
  }];
});

export const assetDataFreshness = {
  lastVerified: verifiedOn,
  officialAssetCount: miningAssets.length,
  sourcePolicy: "Issuer pages, technical reports, annual reports, and regulator filings only."
};
