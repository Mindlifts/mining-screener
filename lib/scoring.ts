import type { Company } from "@/lib/data";

export type CompanyScore = {
  valuation: number;
  balanceSheet: number;
  cost: number;
  jurisdiction: number;
  insider: number;
  total: number;
};

function clampScore(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function scoreCompany(company: Company): CompanyScore {
  const valuationBase =
    company.evEbitda === null ? 45 : 100 - (company.evEbitda - 2) * 7;
  const fcfBonus = company.fcfYield === null ? 0 : company.fcfYield * 2.4;
  const valuation = clampScore(valuationBase + fcfBonus);

  const netDebtToEbitda =
    company.ebitda <= 0 ? (company.netDebt > 0 ? 4 : 0) : company.netDebt / company.ebitda;
  const cashToMarketCap = company.cash / company.marketCap;
  const balanceSheet = clampScore(78 - netDebtToEbitda * 18 + cashToMarketCap * 120);

  const marginProxy =
    company.commodity === "Gold"
      ? company.aisc === null
        ? 0.35
        : (2345 - company.aisc) / 2345
      : company.commodity === "Silver"
        ? company.aisc === null
          ? 0.3
          : (29.42 - company.aisc) / 29.42
        : company.commodity === "Copper"
          ? company.aisc === null
            ? 0.35
            : (4.52 - company.aisc) / 4.52
          : company.commodity === "Uranium"
            ? company.aisc === null
              ? 0.4
              : (86.25 - company.aisc) / 86.25
            : company.aisc === null
              ? 0.25
              : (138 - company.aisc) / 138;
  const cost = clampScore(35 + marginProxy * 100 + company.reserveLife * 0.8);

  const jurisdiction = company.jurisdictionRisk === "Low" ? 88 : company.jurisdictionRisk === "Medium" ? 62 : 38;
  const insider = clampScore(42 + Math.min(company.insiderOwnership, 15) * 4);

  return {
    valuation,
    balanceSheet,
    cost,
    jurisdiction,
    insider,
    total: clampScore(
      valuation * 0.3 + balanceSheet * 0.22 + cost * 0.2 + jurisdiction * 0.18 + insider * 0.1
    )
  };
}

export function scoreCompanies(companies: Company[]) {
  return companies.map((company) => ({
    company,
    score: scoreCompany(company)
  }));
}
