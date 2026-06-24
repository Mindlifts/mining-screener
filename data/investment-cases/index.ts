import firstMajesticSilver from "@/data/investment-cases/first-majestic-silver.json";
import panAmericanSilver from "@/data/investment-cases/pan-american-silver.json";
import type { InvestmentCaseData } from "@/data/investment-cases/types";

export const investmentCases: InvestmentCaseData[] = [
  firstMajesticSilver as InvestmentCaseData,
  panAmericanSilver as InvestmentCaseData
];

export function getInvestmentCase(slug: string) {
  return investmentCases.find((investmentCase) => investmentCase.slug === slug) ?? null;
}
