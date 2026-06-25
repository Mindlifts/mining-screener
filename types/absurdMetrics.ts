export type AbsurdMetricId =
  | "barrick-bother"
  | "ceo-sleep"
  | "road-to-starbucks"
  | "institutional-comfort"
  | "shovel-density"
  | "hype-liability"
  | "geology-reality"
  | "things-must-go-right"
  | "double-without-news"
  | "sleeping-giant";

export type MetricInputHealth = "complete" | "partial" | "insufficient";
export type MetricConfidence = "high" | "medium" | "low";
export type MetricRiskBand = "low" | "medium" | "high" | "critical";
export type MetricCalculationMode = "auto" | "manual" | "hybrid";
export type MetricScoreDirection = "higher_is_better" | "lower_is_better" | "balanced";
export type MetricStatusTier = "weak" | "neutral" | "strong" | "extreme";
export type MetricVisualizationType = "sparkline" | "gauge" | "bars" | "people" | "dominoes";

export type AbsurdMetricBenchmark = {
  peerAverage?: number;
  peerCount?: number;
  sectorAverage?: number;
  topQuartileThreshold?: number;
  sourceLabel?: string;
};

export type AbsurdArchetype =
  | "Sleeping Giant"
  | "Cash Cow"
  | "Future Takeover"
  | "Lottery Ticket"
  | "Zombie Miner"
  | "Hidden Royalty"
  | "Mine Builder Mafia"
  | "Infrastructure Winner"
  | "Dilution Machine";

export type AbsurdThesis = {
  convictionScore: number | null;
  archetype: AbsurdArchetype;
  archetypeExplanation: string;
  whyItMightWork: string[];
  whyItMightFail: string[];
  whatMustGoRight: string[];
};

export type MetricVisualTheme =
  | "truck"
  | "sleep"
  | "infrastructure"
  | "institutional"
  | "builders"
  | "hype"
  | "conversion"
  | "complexity"
  | "valuation"
  | "giant";

export type AbsurdMetricResult = {
  id: AbsurdMetricId;
  name: string;
  shortName: string;
  score: number | null;
  grade: string;
  label: string;
  explanation: string;
  inputsUsed: Record<string, number | string | boolean>;
  missingInputs: string[];
  inputHealth: MetricInputHealth;
  confidence: MetricConfidence;
  isHigherBetter: boolean;
  visualTheme: MetricVisualTheme;
  riskBand: MetricRiskBand;
  mode: MetricCalculationMode;
  investorTakeaway: string;
  signalBadge: string | null;
  statusTier: MetricStatusTier;
  benchmark?: AbsurdMetricBenchmark;
};

export type AbsurdMetric = {
  id: AbsurdMetricId;
  name: string;
  shortName: string;
  description: string;
  isHigherBetter: boolean;
  visualTheme: MetricVisualTheme;
  mode: MetricCalculationMode;
};

export type AbsurdMetricScoreRange = {
  min: number;
  max: number;
  label: string;
  signalBadge?: string;
  takeaway: string;
  statusTier: MetricStatusTier;
};

export type AbsurdMetricDefinition = {
  id: AbsurdMetricId;
  name: string;
  shortName: string;
  absurdName: string;
  description: string;
  whyItMatters: string;
  highScoreMeaning: string;
  lowScoreMeaning: string;
  formulaExplanation: string;
  scoreDirection: MetricScoreDirection;
  labelsByScoreRange: AbsurdMetricScoreRange[];
  dataFieldsUsed: string[];
  confidenceLevel: MetricConfidence;
  benchmarkSupport: boolean;
  visualizationType: MetricVisualizationType;
};

export type StudyLevel = "none" | "resource" | "PEA" | "PFS" | "DFS" | "operating";
export type PermittingStatus = "unknown" | "early" | "pending" | "advanced" | "permitted" | "operating";
export type RiskLevelInput = "low" | "medium" | "high";
export type DoubleWithoutNewsResult = "Yes" | "Maybe" | "No";

export type AbsurdMetricManualInputs = {
  quarterlyCashBurn?: number;
  nextFinancingNeedMonths?: number;
  distanceToRoadKm?: number;
  distanceToPowerKm?: number;
  distanceToRailOrPortKm?: number;
  distanceToProcessingKm?: number;
  infrastructureQuality?: number;
  permittingStatus?: PermittingStatus;
  esgSocialRisk?: RiskLevelInput;
  buildersCount?: number;
  technicalExecutivesCount?: number;
  totalKeyPeople?: number;
  hypeKeywordCount?: number;
  announcementCount?: number;
  resources?: number;
  reserves?: number;
  recoveryRate?: number;
  metallurgyRisk?: RiskLevelInput;
  studyLevel?: StudyLevel;
  metalPriceIncreaseNeeded?: boolean;
  financingNeeded?: boolean;
  permitPending?: boolean;
  metallurgyUnresolved?: boolean;
  infrastructureMissing?: boolean;
  politicalRisk?: boolean;
  capexBlowoutRisk?: boolean;
  pNav?: number;
  peerEvEbitda?: number;
  cashFlowAtSpotPositive?: boolean;
  investorAttentionScore?: number;
};

export type SleepingGiantWeights = {
  valuation: number;
  assetQuality: number;
  balanceSheet: number;
  jurisdiction: number;
  management: number;
  infrastructure: number;
  hypePenalty: number;
};

export type AbsurdMetricCompanyConfig = {
  overrides?: Partial<Record<AbsurdMetricId, Partial<AbsurdMetricResult>>>;
  manualInputs?: AbsurdMetricManualInputs;
  adminNotes?: Partial<Record<AbsurdMetricId, string>>;
  disabledMetrics?: AbsurdMetricId[];
  metricModes?: Partial<Record<AbsurdMetricId, MetricCalculationMode>>;
  compositeWeights?: Partial<SleepingGiantWeights>;
};
