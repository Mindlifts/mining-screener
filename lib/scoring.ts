import type { Company } from "@/lib/data";

export type InvestorMode = "Default" | "Rick Rule" | "Eric Sprott";

export type ScoreWeights = {
  valuation: number;
  balanceSheet: number;
  cost: number;
  jurisdiction: number;
  insider: number;
  survival: number;
  torque: number;
  growth: number;
  catalysts: number;
};

export type CompanyScore = {
  valuation: number;
  balanceSheet: number;
  cost: number;
  jurisdiction: number;
  insider: number;
  survival: number;
  torque: number;
  growth: number;
  catalysts: number;
  total: number;
};

export type ModeConfig = {
  mode: InvestorMode;
  shortLabel: string;
  primaryScore: keyof Pick<CompanyScore, "total" | "survival" | "torque">;
  primaryScoreLabel: string;
  tableDescription: string;
  explanation: string;
  topListTitle: string;
  topListDescription: string;
  defaultStage: "All" | "Producer" | "Developer";
  filterWeakBalanceSheets: boolean;
  weights: ScoreWeights;
};

export const investorModes: ModeConfig[] = [
  {
    mode: "Default",
    shortLabel: "Base",
    primaryScore: "total",
    primaryScoreLabel: "Score",
    tableDescription: "Balanced valuation, quality, risk, and ownership rankings.",
    explanation:
      "Default mode blends valuation, balance sheet strength, cost position, jurisdiction quality, and insider alignment for a broad comparable-company screen.",
    topListTitle: "Top Undervalued",
    topListDescription: "Best valuation setup after quality and risk checks.",
    defaultStage: "All",
    filterWeakBalanceSheets: false,
    weights: {
      valuation: 0.28,
      balanceSheet: 0.18,
      cost: 0.16,
      jurisdiction: 0.14,
      insider: 0.08,
      survival: 0.06,
      torque: 0.05,
      growth: 0.03,
      catalysts: 0.02
    }
  },
  {
    mode: "Rick Rule",
    shortLabel: "Survival",
    primaryScore: "survival",
    primaryScoreLabel: "Survival",
    tableDescription: "Survival-first rankings that penalize leverage, weak margins, and poor jurisdictions.",
    explanation:
      "Rick Rule mode prioritizes companies that can survive downcycles: strong balance sheets, durable cost positions, reserve life, and jurisdictions where capital is less likely to be impaired.",
    topListTitle: "Survival Leaders",
    topListDescription: "Balance sheet, cost curve, reserve life, and jurisdiction quality.",
    defaultStage: "Producer",
    filterWeakBalanceSheets: true,
    weights: {
      valuation: 0.08,
      balanceSheet: 0.24,
      cost: 0.2,
      jurisdiction: 0.18,
      insider: 0.04,
      survival: 0.22,
      torque: 0.01,
      growth: 0.02,
      catalysts: 0.01
    }
  },
  {
    mode: "Eric Sprott",
    shortLabel: "Torque",
    primaryScore: "torque",
    primaryScoreLabel: "Torque",
    tableDescription: "Upside-first rankings focused on torque, growth, insider ownership, and catalysts.",
    explanation:
      "Eric Sprott mode looks for asymmetric upside: smaller market caps, commodity torque, visible growth, insider ownership, and near-term catalysts that can reprice a story.",
    topListTitle: "High Upside Opportunities",
    topListDescription: "Torque, catalysts, growth optionality, and insider alignment.",
    defaultStage: "All",
    filterWeakBalanceSheets: false,
    weights: {
      valuation: 0.08,
      balanceSheet: 0.05,
      cost: 0.06,
      jurisdiction: 0.05,
      insider: 0.15,
      survival: 0.03,
      torque: 0.32,
      growth: 0.18,
      catalysts: 0.08
    }
  }
];

export function getInvestorModeConfig(mode: InvestorMode) {
  return investorModes.find((item) => item.mode === mode) ?? investorModes[0];
}

function clampScore(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function commodityMargin(company: Company) {
  if (company.commodity === "Gold") {
    return company.aisc === null ? 0.35 : (2345 - company.aisc) / 2345;
  }

  if (company.commodity === "Silver") {
    return company.aisc === null ? 0.3 : (29.42 - company.aisc) / 29.42;
  }

  if (company.commodity === "Copper") {
    return company.aisc === null ? 0.35 : (4.52 - company.aisc) / 4.52;
  }

  if (company.commodity === "Uranium") {
    return company.aisc === null ? 0.4 : (86.25 - company.aisc) / 86.25;
  }

  return company.aisc === null ? 0.25 : (138 - company.aisc) / 138;
}

function scoreWithWeights(scores: Omit<CompanyScore, "total">, weights: ScoreWeights) {
  return clampScore(
    scores.valuation * weights.valuation +
      scores.balanceSheet * weights.balanceSheet +
      scores.cost * weights.cost +
      scores.jurisdiction * weights.jurisdiction +
      scores.insider * weights.insider +
      scores.survival * weights.survival +
      scores.torque * weights.torque +
      scores.growth * weights.growth +
      scores.catalysts * weights.catalysts
  );
}

export function scoreCompany(company: Company, mode: InvestorMode = "Default"): CompanyScore {
  const valuationBase = company.evEbitda === null ? 45 : 100 - (company.evEbitda - 2) * 7;
  const fcfBonus = company.fcfYield === null ? 0 : company.fcfYield * 2.4;
  const valuation = clampScore(valuationBase + fcfBonus);

  const netDebtToEbitda =
    company.ebitda <= 0 ? (company.netDebt > 0 ? 4 : 0) : company.netDebt / company.ebitda;
  const cashToMarketCap = company.cash / company.marketCap;
  const balanceSheet = clampScore(78 - netDebtToEbitda * 18 + cashToMarketCap * 120);

  const marginProxy = commodityMargin(company);
  const cost = clampScore(35 + marginProxy * 100 + company.reserveLife * 0.8);

  const jurisdiction =
    company.jurisdictionRisk === "Low" ? 88 : company.jurisdictionRisk === "Medium" ? 62 : 38;
  const insider = clampScore(42 + Math.min(company.insiderOwnership, 15) * 4);
  const survival = clampScore(
    balanceSheet * 0.36 + cost * 0.28 + jurisdiction * 0.22 + Math.min(company.reserveLife * 4, 100) * 0.14
  );

  const sizeTorque = clampScore(112 - Math.log10(Math.max(company.marketCap, 100)) * 18);
  const commodityTorque = company.stage === "Developer" ? 82 : company.fcfYield === null ? 58 : 72 - company.fcfYield * 1.2;
  const torque = clampScore(sizeTorque * 0.45 + valuation * 0.22 + commodityTorque * 0.2 + insider * 0.13);

  const reserveGrowth = clampScore(Math.min(company.reserveLife * 4, 100));
  const developerGrowth = company.stage === "Developer" ? 88 : 55;
  const productionScale = clampScore(company.production <= 0 ? 72 : 42 + Math.log10(company.production + 1) * 22);
  const growth = clampScore(reserveGrowth * 0.36 + developerGrowth * 0.34 + productionScale * 0.3);

  const catalysts = clampScore(
    company.keyCatalysts.length * 16 +
      company.bullCase.length * 8 +
      (company.stage === "Developer" ? 16 : 4) +
      Math.min(company.insiderOwnership, 10) * 2
  );

  const baseScores = {
    valuation,
    balanceSheet,
    cost,
    jurisdiction,
    insider,
    survival,
    torque,
    growth,
    catalysts
  };

  return {
    ...baseScores,
    total: scoreWithWeights(baseScores, getInvestorModeConfig(mode).weights)
  };
}

export function scoreCompanies(companies: Company[], mode: InvestorMode = "Default") {
  return companies.map((company) => ({
    company,
    score: scoreCompany(company, mode)
  }));
}
