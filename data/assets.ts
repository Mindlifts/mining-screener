import type { Commodity, JurisdictionRisk } from "@/data/screener-data";
import type { InvestorMode } from "@/lib/scoring";

export type AssetProductionStage = "Producer" | "Developer" | "Explorer";
export type AssetRiskLevel = JurisdictionRisk;
export type AssetInvestorMode = Exclude<InvestorMode, "Custom">;

export type MiningAsset = {
  id: string;
  companySlug?: string;
  company: string;
  ticker: string;
  commodity: Commodity;
  assetName: string;
  country: string;
  jurisdiction: string;
  latitude: number;
  longitude: number;
  productionStage: AssetProductionStage;
  marketCap: number;
  investorModeScore: Record<AssetInvestorMode, number>;
  riskLevel: AssetRiskLevel;
  keyCatalyst: string;
};

export const assetInvestorModes: AssetInvestorMode[] = [
  "Rick Rule",
  "Eric Sprott",
  "Ross Beaty",
  "Tavi Costa",
  "Lobo Tigre"
];

// Mock asset coordinates and research fields. Replace this module with a
// normalized asset API or filing-derived mine database when that feed is ready.
export const miningAssets: MiningAsset[] = [
  {
    id: "paas-la-colorada",
    companySlug: "pan-american-silver",
    company: "Pan American Silver",
    ticker: "PAAS",
    commodity: "Silver",
    assetName: "La Colorada",
    country: "Mexico",
    jurisdiction: "Zacatecas",
    latitude: 23.43,
    longitude: -103.52,
    productionStage: "Producer",
    marketCap: 7400,
    investorModeScore: { "Rick Rule": 81, "Eric Sprott": 77, "Ross Beaty": 79, "Tavi Costa": 84, "Lobo Tigre": 67 },
    riskLevel: "Medium",
    keyCatalyst: "Ventilation expansion and Skarn project study"
  },
  {
    id: "ag-san-dimas",
    companySlug: "first-majestic-silver",
    company: "First Majestic Silver",
    ticker: "AG",
    commodity: "Silver",
    assetName: "San Dimas",
    country: "Mexico",
    jurisdiction: "Durango",
    latitude: 24.1,
    longitude: -105.94,
    productionStage: "Producer",
    marketCap: 8200,
    investorModeScore: { "Rick Rule": 61, "Eric Sprott": 91, "Ross Beaty": 66, "Tavi Costa": 89, "Lobo Tigre": 72 },
    riskLevel: "Medium",
    keyCatalyst: "Higher-grade mine plan and silver price torque"
  },
  {
    id: "hecla-greens-creek",
    company: "Hecla Mining",
    ticker: "HL",
    commodity: "Silver",
    assetName: "Greens Creek",
    country: "United States",
    jurisdiction: "Alaska",
    latitude: 58.08,
    longitude: -134.64,
    productionStage: "Producer",
    marketCap: 3900,
    investorModeScore: { "Rick Rule": 86, "Eric Sprott": 74, "Ross Beaty": 82, "Tavi Costa": 80, "Lobo Tigre": 64 },
    riskLevel: "Low",
    keyCatalyst: "Reserve conversion and sustained high grades"
  },
  {
    id: "vizsla-panuco",
    company: "Vizsla Silver",
    ticker: "VZLA",
    commodity: "Silver",
    assetName: "Panuco",
    country: "Mexico",
    jurisdiction: "Sinaloa",
    latitude: 23.22,
    longitude: -105.65,
    productionStage: "Developer",
    marketCap: 1100,
    investorModeScore: { "Rick Rule": 66, "Eric Sprott": 94, "Ross Beaty": 73, "Tavi Costa": 86, "Lobo Tigre": 79 },
    riskLevel: "Medium",
    keyCatalyst: "Feasibility work and district-scale drilling"
  },
  {
    id: "nexgen-rook-i",
    company: "NexGen Energy",
    ticker: "NXE",
    commodity: "Uranium",
    assetName: "Rook I",
    country: "Canada",
    jurisdiction: "Saskatchewan",
    latitude: 57.75,
    longitude: -109.04,
    productionStage: "Developer",
    marketCap: 5100,
    investorModeScore: { "Rick Rule": 79, "Eric Sprott": 92, "Ross Beaty": 76, "Tavi Costa": 81, "Lobo Tigre": 68 },
    riskLevel: "Low",
    keyCatalyst: "Federal approvals and project financing"
  },
  {
    id: "denison-wheeler-river",
    company: "Denison Mines",
    ticker: "DNN",
    commodity: "Uranium",
    assetName: "Wheeler River",
    country: "Canada",
    jurisdiction: "Saskatchewan",
    latitude: 57.45,
    longitude: -105.42,
    productionStage: "Developer",
    marketCap: 1900,
    investorModeScore: { "Rick Rule": 75, "Eric Sprott": 88, "Ross Beaty": 72, "Tavi Costa": 79, "Lobo Tigre": 81 },
    riskLevel: "Low",
    keyCatalyst: "Phoenix final investment decision"
  },
  {
    id: "paladin-langer-heinrich",
    company: "Paladin Energy",
    ticker: "PDN",
    commodity: "Uranium",
    assetName: "Langer Heinrich",
    country: "Namibia",
    jurisdiction: "Erongo",
    latitude: -22.82,
    longitude: 15.33,
    productionStage: "Producer",
    marketCap: 2400,
    investorModeScore: { "Rick Rule": 72, "Eric Sprott": 84, "Ross Beaty": 70, "Tavi Costa": 78, "Lobo Tigre": 73 },
    riskLevel: "Medium",
    keyCatalyst: "Ramp-up toward nameplate production"
  },
  {
    id: "lotus-kayelekera",
    company: "Lotus Resources",
    ticker: "LOT",
    commodity: "Uranium",
    assetName: "Kayelekera",
    country: "Malawi",
    jurisdiction: "Karonga",
    latitude: -9.98,
    longitude: 33.7,
    productionStage: "Developer",
    marketCap: 310,
    investorModeScore: { "Rick Rule": 52, "Eric Sprott": 86, "Ross Beaty": 58, "Tavi Costa": 72, "Lobo Tigre": 90 },
    riskLevel: "High",
    keyCatalyst: "Restart financing and uranium contracting"
  },
  {
    id: "barrick-nevada-gold-mines",
    company: "Barrick Gold",
    ticker: "GOLD",
    commodity: "Gold",
    assetName: "Nevada Gold Mines",
    country: "United States",
    jurisdiction: "Nevada",
    latitude: 40.73,
    longitude: -116.24,
    productionStage: "Producer",
    marketCap: 31000,
    investorModeScore: { "Rick Rule": 89, "Eric Sprott": 67, "Ross Beaty": 87, "Tavi Costa": 91, "Lobo Tigre": 70 },
    riskLevel: "Low",
    keyCatalyst: "Fourmile growth and Goldrush ramp-up"
  },
  {
    id: "agnico-canadian-malartic",
    company: "Agnico Eagle Mines",
    ticker: "AEM",
    commodity: "Gold",
    assetName: "Canadian Malartic",
    country: "Canada",
    jurisdiction: "Quebec",
    latitude: 48.11,
    longitude: -78.13,
    productionStage: "Producer",
    marketCap: 39000,
    investorModeScore: { "Rick Rule": 94, "Eric Sprott": 72, "Ross Beaty": 95, "Tavi Costa": 93, "Lobo Tigre": 62 },
    riskLevel: "Low",
    keyCatalyst: "Odyssey underground production growth"
  },
  {
    id: "newmont-cadia",
    company: "Newmont",
    ticker: "NEM",
    commodity: "Gold",
    assetName: "Cadia",
    country: "Australia",
    jurisdiction: "New South Wales",
    latitude: -33.45,
    longitude: 148.99,
    productionStage: "Producer",
    marketCap: 46000,
    investorModeScore: { "Rick Rule": 84, "Eric Sprott": 66, "Ross Beaty": 81, "Tavi Costa": 90, "Lobo Tigre": 76 },
    riskLevel: "Low",
    keyCatalyst: "Block cave expansion and portfolio optimization"
  },
  {
    id: "tudor-treaty-creek",
    company: "Tudor Gold",
    ticker: "TUD",
    commodity: "Gold",
    assetName: "Treaty Creek",
    country: "Canada",
    jurisdiction: "British Columbia",
    latitude: 56.62,
    longitude: -130.08,
    productionStage: "Explorer",
    marketCap: 310,
    investorModeScore: { "Rick Rule": 49, "Eric Sprott": 91, "Ross Beaty": 54, "Tavi Costa": 78, "Lobo Tigre": 92 },
    riskLevel: "Medium",
    keyCatalyst: "Resource expansion in the Golden Triangle"
  },
  {
    id: "bhp-escondida",
    company: "BHP",
    ticker: "BHP",
    commodity: "Copper",
    assetName: "Escondida",
    country: "Chile",
    jurisdiction: "Antofagasta",
    latitude: -24.27,
    longitude: -69.08,
    productionStage: "Producer",
    marketCap: 135000,
    investorModeScore: { "Rick Rule": 91, "Eric Sprott": 58, "Ross Beaty": 88, "Tavi Costa": 86, "Lobo Tigre": 57 },
    riskLevel: "Medium",
    keyCatalyst: "Concentrator growth and grade management"
  },
  {
    id: "freeport-grasberg",
    company: "Freeport-McMoRan",
    ticker: "FCX",
    commodity: "Copper",
    assetName: "Grasberg",
    country: "Indonesia",
    jurisdiction: "Central Papua",
    latitude: -4.05,
    longitude: 137.12,
    productionStage: "Producer",
    marketCap: 59000,
    investorModeScore: { "Rick Rule": 77, "Eric Sprott": 79, "Ross Beaty": 85, "Tavi Costa": 88, "Lobo Tigre": 60 },
    riskLevel: "High",
    keyCatalyst: "Underground ramp-up and smelter normalization"
  },
  {
    id: "sandfire-matsa",
    company: "Sandfire Resources",
    ticker: "SFR",
    commodity: "Copper",
    assetName: "MATSA",
    country: "Spain",
    jurisdiction: "Andalusia",
    latitude: 37.71,
    longitude: -6.68,
    productionStage: "Producer",
    marketCap: 3200,
    investorModeScore: { "Rick Rule": 78, "Eric Sprott": 76, "Ross Beaty": 83, "Tavi Costa": 80, "Lobo Tigre": 74 },
    riskLevel: "Low",
    keyCatalyst: "Mine-life extensions and Motheo optimization"
  },
  {
    id: "ivanhoe-kamoa-kakula",
    company: "Ivanhoe Mines",
    ticker: "IVN",
    commodity: "Copper",
    assetName: "Kamoa-Kakula",
    country: "DR Congo",
    jurisdiction: "Lualaba",
    latitude: -10.76,
    longitude: 25.26,
    productionStage: "Producer",
    marketCap: 15000,
    investorModeScore: { "Rick Rule": 70, "Eric Sprott": 95, "Ross Beaty": 91, "Tavi Costa": 89, "Lobo Tigre": 71 },
    riskLevel: "High",
    keyCatalyst: "Phase 3 ramp-up and smelter commissioning"
  },
  {
    id: "lynas-mt-weld",
    company: "Lynas Rare Earths",
    ticker: "LYC",
    commodity: "Rare Earths",
    assetName: "Mt Weld",
    country: "Australia",
    jurisdiction: "Western Australia",
    latitude: -28.86,
    longitude: 122.09,
    productionStage: "Producer",
    marketCap: 4400,
    investorModeScore: { "Rick Rule": 84, "Eric Sprott": 75, "Ross Beaty": 82, "Tavi Costa": 73, "Lobo Tigre": 65 },
    riskLevel: "Low",
    keyCatalyst: "Kalgoorlie ramp-up and NdPr market recovery"
  },
  {
    id: "mkango-songwe-hill",
    company: "Mkango Resources",
    ticker: "MKA",
    commodity: "Rare Earths",
    assetName: "Songwe Hill",
    country: "Malawi",
    jurisdiction: "Phalombe",
    latitude: -15.02,
    longitude: 35.68,
    productionStage: "Developer",
    marketCap: 55,
    investorModeScore: { "Rick Rule": 40, "Eric Sprott": 84, "Ross Beaty": 51, "Tavi Costa": 66, "Lobo Tigre": 95 },
    riskLevel: "High",
    keyCatalyst: "Strategic financing and recycling commercialization"
  },
  {
    id: "cnr-elkview",
    company: "Core Natural Resources",
    ticker: "CNR",
    commodity: "Coal",
    assetName: "Elkview",
    country: "Canada",
    jurisdiction: "British Columbia",
    latitude: 49.77,
    longitude: -114.89,
    productionStage: "Producer",
    marketCap: 5200,
    investorModeScore: { "Rick Rule": 80, "Eric Sprott": 55, "Ross Beaty": 76, "Tavi Costa": 51, "Lobo Tigre": 83 },
    riskLevel: "Low",
    keyCatalyst: "Merger synergies and metallurgical coal pricing"
  },
  {
    id: "whitehaven-blackwater",
    company: "Whitehaven Coal",
    ticker: "WHC",
    commodity: "Coal",
    assetName: "Blackwater",
    country: "Australia",
    jurisdiction: "Queensland",
    latitude: -23.67,
    longitude: 148.81,
    productionStage: "Producer",
    marketCap: 3900,
    investorModeScore: { "Rick Rule": 82, "Eric Sprott": 62, "Ross Beaty": 78, "Tavi Costa": 49, "Lobo Tigre": 86 },
    riskLevel: "Low",
    keyCatalyst: "Operational integration and cash returns"
  },
  {
    id: "cnq-horizon",
    company: "Canadian Natural Resources",
    ticker: "CNQ",
    commodity: "Oil & Gas",
    assetName: "Horizon Oil Sands",
    country: "Canada",
    jurisdiction: "Alberta",
    latitude: 57.35,
    longitude: -111.74,
    productionStage: "Producer",
    marketCap: 73000,
    investorModeScore: { "Rick Rule": 92, "Eric Sprott": 60, "Ross Beaty": 90, "Tavi Costa": 70, "Lobo Tigre": 68 },
    riskLevel: "Low",
    keyCatalyst: "Long-life production and shareholder returns"
  },
  {
    id: "prairie-wildcat",
    company: "Prairie Operating",
    ticker: "PROP",
    commodity: "Oil & Gas",
    assetName: "Wildcat",
    country: "United States",
    jurisdiction: "Colorado",
    latitude: 40.42,
    longitude: -104.45,
    productionStage: "Developer",
    marketCap: 190,
    investorModeScore: { "Rick Rule": 45, "Eric Sprott": 87, "Ross Beaty": 50, "Tavi Costa": 62, "Lobo Tigre": 91 },
    riskLevel: "Medium",
    keyCatalyst: "Drilling program and production scale-up"
  }
];
