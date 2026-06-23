export type InvestmentCaseTone = "positive" | "neutral" | "caution" | "negative";

export type InvestmentCaseMetric = {
  label: string;
  value: string;
  detail: string;
  progress?: number;
  tone?: InvestmentCaseTone;
};

export type InvestmentCaseAsset = {
  name: string;
  country: string;
  jurisdiction: string;
  commodity: string;
  stage: "Producing" | "Development" | "Care and maintenance";
  latitude: number;
  longitude: number;
  production: string;
  reserveLife: string;
  description: string;
};

export type InvestmentCaseScenario = {
  name: "Bull case" | "Base case" | "Bear case";
  headline: string;
  probability: string;
  target: string;
  tone: InvestmentCaseTone;
  points: string[];
};

export type InvestmentCaseTimelineEvent = {
  year: string;
  title: string;
  category: "Milestone" | "Expansion" | "Acquisition" | "Catalyst";
  description: string;
  status: "complete" | "current" | "future";
};

export type InvestmentCaseRisk = {
  name: string;
  probability: number;
  impact: number;
  level: "Low" | "Medium" | "High";
  mitigation: string;
};

export type InvestmentCaseData = {
  slug: string;
  companySlug: string;
  company: string;
  ticker: string;
  exchange: string;
  logo: string;
  commodityExposure: string[];
  score: number;
  thesis: string;
  asOf: string;
  dataStatus: "placeholder";
  whyItMatters: InvestmentCaseMetric[];
  assets: InvestmentCaseAsset[];
  production: InvestmentCaseMetric[];
  scenarios: InvestmentCaseScenario[];
  financials: InvestmentCaseMetric[];
  rickRule: InvestmentCaseMetric[];
  ericSprott: InvestmentCaseMetric[];
  timeline: InvestmentCaseTimelineEvent[];
  risks: InvestmentCaseRisk[];
};
