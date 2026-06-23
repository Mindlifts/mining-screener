export type InvestmentCaseTone = "positive" | "neutral" | "caution" | "negative";

export type InvestmentCaseMetric = {
  label: string;
  value: string;
  detail: string;
  progress?: number;
  tone?: InvestmentCaseTone;
  sourcePage?: number;
  calculated?: boolean;
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
  sourcePage: number;
  reserveLifeCalculated?: boolean;
};

export type InvestmentCaseScenario = {
  name: "Bull case" | "Base case" | "Bear case";
  headline: string;
  probability: string;
  target: string;
  tone: InvestmentCaseTone;
  points: string[];
  sourcePages: number[];
};

export type InvestmentCaseTimelineEvent = {
  year: string;
  title: string;
  category: "Milestone" | "Expansion" | "Acquisition" | "Catalyst";
  description: string;
  status: "complete" | "current" | "future";
  sourcePage: number;
};

export type InvestmentCaseRisk = {
  name: string;
  probability: number;
  impact: number;
  level: "Low" | "Medium" | "High";
  mitigation: string;
  sourcePage: number;
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
  dataStatus: "official-presentation";
  source: {
    title: string;
    url: string;
    published: string;
  };
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
