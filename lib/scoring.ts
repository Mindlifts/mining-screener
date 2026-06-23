import type { Commodity, Company } from "@/data/mining-universe";

export type InvestorMode =
  | "Rick Rule"
  | "Eric Sprott"
  | "Ross Beaty"
  | "Tavi Costa"
  | "Lobo Tigre"
  | "Custom";

export type ScoreFactor =
  | "survival"
  | "torque"
  | "valuation"
  | "management"
  | "jurisdiction"
  | "catalysts"
  | "macro";

export type ScoreWeights = Record<ScoreFactor, number>;

export type CompanyScore = Record<ScoreFactor, number> & {
  balanceSheet: number;
  cost: number;
  commodityCycle: number;
  navDiscount: number;
  contrarian: number;
  total: number;
};

export type ModeConfig = {
  mode: InvestorMode;
  shortLabel: string;
  primaryScore: keyof CompanyScore;
  defaultSort: keyof CompanyScore;
  explanation: string;
  topListTitle: string;
  topListDescription: string;
  defaultCommodity: Commodity | "All";
  defaultStage: "All" | "Producer" | "Developer";
  minBalanceSheet?: number;
  weights: ScoreWeights;
};

export const defaultCustomWeights: ScoreWeights = {
  survival: 18,
  torque: 16,
  valuation: 18,
  management: 14,
  jurisdiction: 12,
  catalysts: 10,
  macro: 12
};

export const investorModes: ModeConfig[] = [
  {
    mode: "Rick Rule",
    shortLabel: "Survival",
    primaryScore: "survival",
    defaultSort: "survival",
    explanation:
      "Rick Rule mode screens for companies that can survive brutal commodity cycles: balance sheet resilience, low-cost assets, jurisdiction quality, reserve life, and margin of safety.",
    topListTitle: "Survival and Margin of Safety",
    topListDescription: "Strong balance sheets, durable costs, safer jurisdictions, and fewer forced-financing risks.",
    defaultCommodity: "All",
    defaultStage: "Producer",
    minBalanceSheet: 55,
    weights: {
      survival: 32,
      torque: 3,
      valuation: 14,
      management: 10,
      jurisdiction: 20,
      catalysts: 3,
      macro: 18
    }
  },
  {
    mode: "Eric Sprott",
    shortLabel: "Torque",
    primaryScore: "torque",
    defaultSort: "torque",
    explanation:
      "Eric Sprott mode looks for asymmetric upside: commodity leverage, smaller-cap torque, insider ownership, visible catalysts, and plausible multi-bagger outcomes.",
    topListTitle: "10x Upside Candidates",
    topListDescription: "High torque, strong catalysts, insider alignment, and resource optionality.",
    defaultCommodity: "All",
    defaultStage: "All",
    weights: {
      survival: 5,
      torque: 34,
      valuation: 12,
      management: 8,
      jurisdiction: 5,
      catalysts: 22,
      macro: 14
    }
  },
  {
    mode: "Ross Beaty",
    shortLabel: "Builder",
    primaryScore: "management",
    defaultSort: "management",
    explanation:
      "Ross Beaty mode emphasizes who can actually build and compound value: management quality, execution, mine-building history, capital allocation, and disciplined growth.",
    topListTitle: "Builder Quality Leaders",
    topListDescription: "Execution record, mine-building credibility, and capital allocation discipline.",
    defaultCommodity: "All",
    defaultStage: "All",
    weights: {
      survival: 14,
      torque: 8,
      valuation: 10,
      management: 38,
      jurisdiction: 10,
      catalysts: 12,
      macro: 8
    }
  },
  {
    mode: "Tavi Costa",
    shortLabel: "Macro",
    primaryScore: "macro",
    defaultSort: "macro",
    explanation:
      "Tavi Costa mode ranks companies through the macro cycle: gold, silver, and copper leadership, real-rate sensitivity, commodity-cycle positioning, and liquidity into a hard-asset regime.",
    topListTitle: "Macro Cycle Winners",
    topListDescription: "Best alignment with commodity cycles, real-rate sensitivity, and sector leadership.",
    defaultCommodity: "All",
    defaultStage: "Producer",
    weights: {
      survival: 10,
      torque: 12,
      valuation: 12,
      management: 8,
      jurisdiction: 8,
      catalysts: 8,
      macro: 42
    }
  },
  {
    mode: "Lobo Tigre",
    shortLabel: "Deep Value",
    primaryScore: "valuation",
    defaultSort: "valuation",
    explanation:
      "Lobo Tigre mode hunts for hated or ignored value: NAV discounts, cheap EV/resource, neglected stories, contrarian setups, and margin of safety before sentiment improves.",
    topListTitle: "Contrarian Deep Value",
    topListDescription: "NAV discount, EV/resource value, neglected coverage, and contrarian optionality.",
    defaultCommodity: "All",
    defaultStage: "All",
    weights: {
      survival: 12,
      torque: 13,
      valuation: 36,
      management: 6,
      jurisdiction: 8,
      catalysts: 8,
      macro: 17
    }
  },
  {
    mode: "Custom",
    shortLabel: "User DNA",
    primaryScore: "total",
    defaultSort: "total",
    explanation:
      "Custom mode lets users build their own investor DNA by adjusting factor weights across survival, torque, valuation, management, jurisdiction, catalysts, and macro.",
    topListTitle: "Custom DNA Leaders",
    topListDescription: "Highest-ranked names under the user-selected factor blend.",
    defaultCommodity: "All",
    defaultStage: "All",
    weights: defaultCustomWeights
  }
];

export function getInvestorModeConfig(mode: InvestorMode) {
  return investorModes.find((item) => item.mode === mode) ?? investorModes[0];
}

function clampScore(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function normalizeWeights(weights: ScoreWeights) {
  const total = Object.values(weights).reduce((sum, value) => sum + value, 0) || 1;

  return Object.fromEntries(
    Object.entries(weights).map(([key, value]) => [key, value / total])
  ) as Record<ScoreFactor, number>;
}

function commodityMargin(company: Company) {
  if (company.commodity === "Gold") return company.aisc === null ? 0.35 : (2345 - company.aisc) / 2345;
  if (company.commodity === "Silver") return company.aisc === null ? 0.3 : (29.42 - company.aisc) / 29.42;
  if (company.commodity === "Copper") return company.aisc === null ? 0.35 : (4.52 - company.aisc) / 4.52;
  if (company.commodity === "Uranium") return company.aisc === null ? 0.4 : (86.25 - company.aisc) / 86.25;
  if (company.commodity === "Rare Earths") return company.aisc === null ? 0.3 : (58 - company.aisc) / 58;
  if (company.commodity === "Oil & Gas") return company.aisc === null ? 0.28 : (82 - company.aisc) / 82;
  return company.aisc === null ? 0.25 : (138 - company.aisc) / 138;
}

function sizeTorque(marketCap: number) {
  return clampScore(116 - Math.log10(Math.max(marketCap, 100)) * 18);
}

function scoreTotal(scores: Record<ScoreFactor, number>, weights: ScoreWeights) {
  const normalized = normalizeWeights(weights);

  return clampScore(
    scores.survival * normalized.survival +
      scores.torque * normalized.torque +
      scores.valuation * normalized.valuation +
      scores.management * normalized.management +
      scores.jurisdiction * normalized.jurisdiction +
      scores.catalysts * normalized.catalysts +
      scores.macro * normalized.macro
  );
}

export function scoreCompany(
  company: Company,
  mode: InvestorMode = "Rick Rule",
  customWeights: ScoreWeights = defaultCustomWeights
): CompanyScore {
  const modeConfig = getInvestorModeConfig(mode);
  const weights = mode === "Custom" ? customWeights : modeConfig.weights;
  const netDebtToEbitda =
    company.ebitda <= 0 ? (company.netDebt > 0 ? 4 : 0) : company.netDebt / company.ebitda;
  const cashToMarketCap = company.cash / company.marketCap;
  const balanceSheet = clampScore(78 - netDebtToEbitda * 18 + cashToMarketCap * 120);
  const cost = clampScore(35 + commodityMargin(company) * 100 + company.reserveLife * 0.8);
  const jurisdiction =
    company.jurisdictionRisk === "Low" ? 88 : company.jurisdictionRisk === "Medium" ? 62 : 38;
  const valuationBase = company.evEbitda === null ? 46 : 100 - (company.evEbitda - 2) * 7;
  const fcfBonus = company.fcfYield === null ? 0 : company.fcfYield * 2.2;
  const valuation = clampScore(
    valuationBase +
      fcfBonus +
      company.navDiscount * 0.55 +
      (12 - Math.min(company.evResource, 12)) * 2 +
      company.marginOfSafety * 0.15
  );
  const survival = clampScore(
    balanceSheet * 0.34 +
      cost * 0.24 +
      jurisdiction * 0.18 +
      Math.min(company.reserveLife * 4, 100) * 0.12 +
      company.marginOfSafety * 0.12
  );
  const catalysts = clampScore(
    company.keyCatalysts.length * 15 +
      company.bullCase.length * 8 +
      (company.stage === "Developer" ? 16 : 4) +
      Math.min(company.insiderOwnership, 10) * 1.8
  );
  const torque = clampScore(
    sizeTorque(company.marketCap) * 0.28 +
      company.commodityLeverage * 0.28 +
      catalysts * 0.18 +
      Math.min(company.insiderOwnership * 6, 100) * 0.14 +
      company.resourceScale * 0.12
  );
  const management = clampScore(
    company.managementQuality * 0.32 +
      company.executionTrackRecord * 0.26 +
      company.mineBuildingTrackRecord * 0.22 +
      company.capitalAllocation * 0.2
  );
  const commodityCycle = clampScore(company.commodityCycleScore * 0.55 + company.macroCycleScore * 0.45);
  const macro = clampScore(
    company.macroCycleScore * 0.34 +
      company.commodityCycleScore * 0.3 +
      company.realRatesSensitivity * 0.22 +
      (company.commodity === "Gold" || company.commodity === "Silver" || company.commodity === "Copper" || company.commodity === "Rare Earths" ? 10 : 0) +
      company.commodityLeverage * 0.04
  );
  const contrarian = clampScore(
    company.neglectedScore * 0.34 +
      company.navDiscount * 0.26 +
      valuation * 0.22 +
      company.marginOfSafety * 0.18
  );
  const factorScores = {
    survival,
    torque,
    valuation,
    management,
    jurisdiction,
    catalysts,
    macro
  };

  return {
    ...factorScores,
    balanceSheet,
    cost,
    commodityCycle,
    navDiscount: clampScore(company.navDiscount),
    contrarian,
    total: scoreTotal(factorScores, weights)
  };
}

export function scoreCompanies(
  companies: Company[],
  mode: InvestorMode = "Rick Rule",
  customWeights: ScoreWeights = defaultCustomWeights
) {
  return companies.map((company) => ({
    company,
    score: scoreCompany(company, mode, customWeights)
  }));
}
