import type { Company } from "../types/company.ts";
import type {
  AbsurdMetricBenchmark,
  AbsurdArchetype,
  AbsurdMetricId,
  AbsurdMetricManualInputs,
  AbsurdMetricResult,
  AbsurdThesis,
  DoubleWithoutNewsResult,
  MetricCalculationMode,
  MetricConfidence,
  MetricInputHealth,
  MetricRiskBand,
  MetricVisualTheme,
  SleepingGiantWeights
} from "../types/absurdMetrics.ts";
import { enrichAbsurdMetricResult } from "./absurdMetricsConfig.ts";

export const defaultSleepingGiantWeights: SleepingGiantWeights = {
  valuation: 0.25,
  assetQuality: 0.2,
  balanceSheet: 0.15,
  jurisdiction: 0.15,
  management: 0.1,
  infrastructure: 0.1,
  hypePenalty: 0.05
};

export const absurdMetricIds: AbsurdMetricId[] = [
  "barrick-bother",
  "ceo-sleep",
  "road-to-starbucks",
  "institutional-comfort",
  "shovel-density",
  "hype-liability",
  "geology-reality",
  "things-must-go-right",
  "double-without-news",
  "sleeping-giant"
];

type BaseMetricOptions = {
  id: AbsurdMetricId;
  name: string;
  shortName: string;
  score: number | null;
  label: string;
  explanation: string;
  inputsUsed: Record<string, number | string | boolean>;
  missingInputs: string[];
  isHigherBetter: boolean;
  visualTheme: MetricVisualTheme;
  mode?: MetricCalculationMode;
};

function clamp(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function average(values: number[]) {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
}

function health(missing: number, expected: number): MetricInputHealth {
  if (missing === 0) return "complete";
  if (missing >= expected) return "insufficient";
  return "partial";
}

function confidence(inputHealth: MetricInputHealth): MetricConfidence {
  return inputHealth === "complete" ? "high" : inputHealth === "partial" ? "medium" : "low";
}

function grade(score: number | null, higherBetter: boolean) {
  if (score === null) return "N/A";
  const adjusted = higherBetter ? score : 100 - score;
  if (adjusted >= 85) return "A";
  if (adjusted >= 70) return "B";
  if (adjusted >= 55) return "C";
  if (adjusted >= 40) return "D";
  return "F";
}

function riskBand(score: number | null, higherBetter: boolean): MetricRiskBand {
  if (score === null) return "critical";
  const risk = higherBetter ? 100 - score : score;
  if (risk >= 75) return "critical";
  if (risk >= 50) return "high";
  if (risk >= 25) return "medium";
  return "low";
}

function makeResult(options: BaseMetricOptions): AbsurdMetricResult {
  const inputHealth = health(options.missingInputs.length, options.missingInputs.length + Object.keys(options.inputsUsed).length);

  return {
    ...options,
    score: options.score === null ? null : clamp(options.score),
    grade: grade(options.score, options.isHigherBetter),
    inputHealth,
    confidence: confidence(inputHealth),
    riskBand: riskBand(options.score, options.isHigherBetter),
    mode: options.mode ?? (options.missingInputs.length ? "hybrid" : "auto"),
    investorTakeaway: "",
    signalBadge: null,
    statusTier: "neutral"
  };
}

function applyConfig(company: Company, result: AbsurdMetricResult) {
  const override = company.absurdMetrics?.overrides?.[result.id];
  const configuredMode = company.absurdMetrics?.metricModes?.[result.id];

  return enrichAbsurdMetricResult(company, {
    ...result,
    ...override,
    mode: configuredMode ?? override?.mode ?? result.mode
  });
}

function jurisdictionScore(company: Company) {
  return company.jurisdictionRisk === "Low" ? 88 : company.jurisdictionRisk === "Medium" ? 62 : 35;
}

function balanceSheetScore(company: Company) {
  // Existing screener fields are normalized to 0-100 before any composite uses them.
  const debtLoad = company.ebitda > 0 ? company.netDebt / company.ebitda : company.netDebt > 0 ? 4 : 0;
  return clamp(76 - debtLoad * 16 + (company.marketCap > 0 ? company.cash / company.marketCap : 0) * 120);
}

function valuationScore(company: Company) {
  const multiple = company.evEbitda === null ? 48 : 100 - Math.max(0, company.evEbitda - 2) * 7;
  const fcf = company.fcfYield === null ? 0 : company.fcfYield * 2.1;
  return clamp(multiple + fcf + company.navDiscount * 0.45 + company.marginOfSafety * 0.18);
}

function assetQualityScore(company: Company) {
  return clamp(
    company.resourceScale * 0.34 +
      Math.min(company.reserveLife * 5, 100) * 0.28 +
      (company.production > 0 ? 18 : 0) +
      company.executionTrackRecord * 0.2
  );
}

function manual(company: Company): AbsurdMetricManualInputs {
  return company.absurdMetrics?.manualInputs ?? {};
}

export function calculateWouldBarrickBother(company: Company): AbsurdMetricResult {
  const inputs = manual(company);
  const infrastructure = inputs.infrastructureQuality;
  const missing = infrastructure === undefined ? ["infrastructureQuality"] : [];
  const sizeAppeal = clamp(100 - Math.abs(Math.log10(Math.max(company.marketCap, 50)) - 3.3) * 35);
  const resource = company.resourceScale;
  const production = company.production > 0 ? clamp(40 + Math.log10(company.production + 1) * 18) : 15;
  const score = average([
    sizeAppeal * 0.24,
    resource * 0.26,
    production * 0.16,
    Math.min(company.reserveLife * 6, 100) * 0.14,
    jurisdictionScore(company) * 0.12,
    (infrastructure ?? 50) * 0.08
  ]) * 6;
  const finalScore = clamp(score);
  const label = finalScore >= 72 ? "Major bait" : finalScore >= 45 ? "Maybe" : "Too small to care";

  return applyConfig(company, makeResult({
    id: "barrick-bother",
    name: "Would Barrick Bother? Ratio",
    shortName: "Barrick Bother",
    score: finalScore,
    label,
    explanation: `${label}: scale, mine life and jurisdiction are blended with a deliberately incomplete infrastructure view.`,
    inputsUsed: {
      marketCap: company.marketCap,
      resourceScale: company.resourceScale,
      annualProduction: company.production,
      mineLifeYears: company.reserveLife,
      jurisdictionScore: jurisdictionScore(company),
      ...(infrastructure === undefined ? {} : { infrastructureQuality: infrastructure })
    },
    missingInputs: missing,
    isHigherBetter: true,
    visualTheme: "truck"
  }));
}

export function calculateCeoSleep(company: Company): AbsurdMetricResult {
  const inputs = manual(company);
  const burn = inputs.quarterlyCashBurn;
  const inferredPositiveCashFlow = company.freeCashFlow !== undefined && company.freeCashFlow >= 0;
  // Positive reported FCF avoids inventing a cash-burn rate; it caps runway at 48 months.
  const monthsFunded = burn !== undefined && burn > 0
    ? Math.max(0, company.cash / (burn / 3))
    : inferredPositiveCashFlow
      ? 48
      : null;
  const missing = [
    ...(burn === undefined && !inferredPositiveCashFlow ? ["quarterlyCashBurn"] : []),
    ...(inputs.nextFinancingNeedMonths === undefined ? ["nextFinancingNeedMonths"] : [])
  ];
  const debtPenalty = company.marketCap > 0 ? Math.max(0, company.netDebt / company.marketCap) * 60 : 25;
  const score = monthsFunded === null
    ? null
    : clamp(Math.min(monthsFunded, 48) * 2.1 - debtPenalty + (inputs.nextFinancingNeedMonths ?? 12) * 0.7);
  const label = score === null
    ? "Insufficient data"
    : score >= 82
      ? "Baby sleep"
      : score >= 62
        ? "Comfortable"
        : score >= 38
          ? "Restless"
          : "Panic";

  return applyConfig(company, makeResult({
    id: "ceo-sleep",
    name: "CEO Sleeps Like a Baby Index",
    shortName: "CEO Sleep",
    score,
    label,
    explanation: monthsFunded === null
      ? "Cash burn or positive free cash flow is needed before financing runway can be estimated."
      : `Estimated funding runway is ${Math.round(monthsFunded)} months before considering project-specific capital calls.`,
    inputsUsed: {
      cash: company.cash,
      debt: company.netDebt,
      ...(burn === undefined ? {} : { quarterlyCashBurn: burn }),
      ...(monthsFunded === null ? {} : { monthsFunded: Math.round(monthsFunded) })
    },
    missingInputs: missing,
    isHigherBetter: true,
    visualTheme: "sleep"
  }));
}

export function calculateRoadToStarbucks(company: Company): AbsurdMetricResult {
  const inputs = manual(company);
  const distances = [
    ["distanceToRoadKm", inputs.distanceToRoadKm],
    ["distanceToPowerKm", inputs.distanceToPowerKm],
    ["distanceToRailOrPortKm", inputs.distanceToRailOrPortKm],
    ["distanceToProcessingKm", inputs.distanceToProcessingKm]
  ] as const;
  const available = distances.filter((entry): entry is [typeof entry[0], number] => entry[1] !== undefined);
  const missing: string[] = distances.filter(([, value]) => value === undefined).map(([name]) => name);
  if (inputs.infrastructureQuality === undefined) missing.push("infrastructureQuality");
  const distanceScores = available.map(([, value]) => clamp(100 - Math.sqrt(Math.max(0, value)) * 12));
  const score = available.length
    ? clamp(average(distanceScores) * 0.7 + (inputs.infrastructureQuality ?? 50) * 0.3)
    : inputs.infrastructureQuality ?? null;

  return applyConfig(company, makeResult({
    id: "road-to-starbucks",
    name: "Road to Starbucks Score",
    shortName: "Starbucks",
    score,
    label: score === null ? "Insufficient data" : score >= 75 ? "Coffee nearby" : score >= 50 ? "Long drive" : "Bring a thermos",
    explanation: score === null
      ? "No project-distance or infrastructure-quality inputs are available."
      : "Closer roads, power, logistics and processing capacity improve the score.",
    inputsUsed: Object.fromEntries([
      ...available,
      ...(inputs.infrastructureQuality === undefined ? [] : [["infrastructureQuality", inputs.infrastructureQuality] as const])
    ]),
    missingInputs: missing,
    isHigherBetter: true,
    visualTheme: "infrastructure",
    mode: "hybrid"
  }));
}

export function calculateInstitutionalComfort(company: Company): AbsurdMetricResult {
  const inputs = manual(company);
  const permit = inputs.permittingStatus;
  const esg = inputs.esgSocialRisk;
  const missing = [
    ...(permit === undefined ? ["permittingStatus"] : []),
    ...(esg === undefined ? ["esgSocialRisk"] : [])
  ];
  const permitScores = { unknown: 35, early: 35, pending: 48, advanced: 68, permitted: 85, operating: 95 };
  const stageScore = company.status === "producer" ? 90 : company.status === "developer" ? 62 : company.status === "explorer" ? 38 : 55;
  const liquidity = clamp(30 + Math.log10(Math.max(company.marketCap, 20)) * 18);
  const esgScore = esg === "low" ? 88 : esg === "medium" ? 60 : esg === "high" ? 30 : 55;
  const score = clamp(
    jurisdictionScore(company) * 0.25 +
      (permit ? permitScores[permit] : 50) * 0.2 +
      stageScore * 0.2 +
      liquidity * 0.22 +
      esgScore * 0.13
  );

  return applyConfig(company, makeResult({
    id: "institutional-comfort",
    name: "Nobody Gets Fired Buying This Factor",
    shortName: "Committee Safe",
    score,
    label: score >= 76 ? "Institutional comfort" : score >= 52 ? "Committee safe" : "Career risk",
    explanation: "Jurisdiction, maturity, liquidity, permitting and social risk are blended into an institutional comfort proxy.",
    inputsUsed: {
      jurisdictionRisk: company.jurisdictionRisk,
      companyStatus: company.status,
      marketCap: company.marketCap,
      ...(permit ? { permittingStatus: permit } : {}),
      ...(esg ? { esgSocialRisk: esg } : {})
    },
    missingInputs: missing,
    isHigherBetter: true,
    visualTheme: "institutional"
  }));
}

export function calculateShovelDensity(company: Company): AbsurdMetricResult {
  const inputs = manual(company);
  const total = inputs.totalKeyPeople;
  const builders = inputs.buildersCount;
  const technical = inputs.technicalExecutivesCount;
  const missing = [
    ...(builders === undefined ? ["buildersCount"] : []),
    ...(technical === undefined ? ["technicalExecutivesCount"] : []),
    ...(total === undefined ? ["totalKeyPeople"] : [])
  ];
  const score = total && total > 0 && builders !== undefined && technical !== undefined
    ? clamp(((builders + technical * 0.5) / total) * 100)
    : null;

  return applyConfig(company, makeResult({
    id: "shovel-density",
    name: "Shovel Density Metric",
    shortName: "Shovel Density",
    score,
    label: score === null ? "Manual review needed" : score >= 70 ? "Builders everywhere" : score >= 40 ? "Some muddy boots" : "Mostly boardroom",
    explanation: score === null
      ? "Management biographies need human review before builders can be counted reliably."
      : `${builders} builders and ${technical} technical executives across ${total} key people.`,
    inputsUsed: {
      ...(builders === undefined ? {} : { buildersCount: builders }),
      ...(technical === undefined ? {} : { technicalExecutivesCount: technical }),
      ...(total === undefined ? {} : { totalKeyPeople: total })
    },
    missingInputs: missing,
    isHigherBetter: true,
    visualTheme: "builders",
    mode: "manual"
  }));
}

export function calculateHypeLiability(company: Company): AbsurdMetricResult {
  const inputs = manual(company);
  const count = inputs.hypeKeywordCount;
  const announcements = inputs.announcementCount;
  const missing = [
    ...(count === undefined ? ["hypeKeywordCount"] : []),
    ...(announcements === undefined ? ["announcementCount"] : [])
  ];
  const score = count === undefined
    ? null
    : clamp((count / Math.max(announcements ?? 1, 1)) * 18);

  return applyConfig(company, makeResult({
    id: "hype-liability",
    name: "Future Press Release Liability",
    shortName: "Hype Liability",
    score,
    label: score === null ? "No text sample" : score <= 25 ? "Plain spoken" : score <= 55 ? "Promotional" : "Siren active",
    explanation: score === null
      ? "Announcement text or manual keyword counts are required."
      : `${count} promotional-keyword hits across ${announcements ?? 1} sampled announcements. Lower is better.`,
    inputsUsed: {
      ...(count === undefined ? {} : { hypeKeywordCount: count }),
      ...(announcements === undefined ? {} : { announcementCount: announcements })
    },
    missingInputs: missing,
    isHigherBetter: false,
    visualTheme: "hype",
    mode: "manual"
  }));
}

export function calculateGeologyReality(company: Company): AbsurdMetricResult {
  const inputs = manual(company);
  const resources = inputs.resources;
  const reserves = inputs.reserves;
  const recovery = inputs.recoveryRate;
  const metallurgy = inputs.metallurgyRisk;
  const study = inputs.studyLevel;
  const missing = [
    ...(resources === undefined ? ["resources"] : []),
    ...(reserves === undefined ? ["reserves"] : []),
    ...(recovery === undefined ? ["recoveryRate"] : []),
    ...(metallurgy === undefined ? ["metallurgyRisk"] : []),
    ...(study === undefined ? ["studyLevel"] : [])
  ];
  const conversion = resources && resources > 0 && reserves !== undefined ? clamp((reserves / resources) * 100) : null;
  const studyScores = { none: 10, resource: 25, PEA: 45, PFS: 62, DFS: 78, operating: 95 };
  const metallurgyScores = { low: 90, medium: 60, high: 25 };
  const score = conversion === null
    ? null
    : clamp(
        conversion * 0.5 +
          (recovery ?? 65) * 0.2 +
          (study ? studyScores[study] : 45) * 0.2 +
          (metallurgy ? metallurgyScores[metallurgy] : 50) * 0.1
      );

  return applyConfig(company, makeResult({
    id: "geology-reality",
    name: "Geology to Reality Conversion Rate",
    shortName: "Geology Reality",
    score,
    label: score === null ? "Insufficient data" : score >= 72 ? "Mineable ounces" : score >= 45 ? "Still funneling" : "Big shiny resource",
    explanation: conversion === null
      ? "Comparable resource and reserve quantities are required."
      : `${conversion}% reserve/resource conversion before recovery, metallurgy and study-stage adjustments.`,
    inputsUsed: {
      ...(resources === undefined ? {} : { resources }),
      ...(reserves === undefined ? {} : { reserves }),
      ...(recovery === undefined ? {} : { recoveryRate: recovery }),
      ...(metallurgy === undefined ? {} : { metallurgyRisk: metallurgy }),
      ...(study === undefined ? {} : { studyLevel: study })
    },
    missingInputs: missing,
    isHigherBetter: true,
    visualTheme: "conversion",
    mode: "hybrid"
  }));
}

export function calculateThingsMustGoRight(company: Company): AbsurdMetricResult {
  const inputs = manual(company);
  const checklist = {
    metalPriceIncreaseNeeded: inputs.metalPriceIncreaseNeeded,
    financingNeeded: inputs.financingNeeded,
    permitPending: inputs.permitPending,
    metallurgyUnresolved: inputs.metallurgyUnresolved,
    infrastructureMissing: inputs.infrastructureMissing,
    politicalRisk: inputs.politicalRisk,
    capexBlowoutRisk: inputs.capexBlowoutRisk
  };
  const entries = Object.entries(checklist);
  const missing = entries.filter(([, value]) => value === undefined).map(([key]) => key);
  const known = entries.filter((entry): entry is [string, boolean] => entry[1] !== undefined);
  const miracles = known.filter(([, value]) => value).length;
  // Score represents complexity intensity, while the label exposes the easier-to-read count.
  const score = known.length ? clamp((miracles / entries.length) * 100) : null;

  return applyConfig(company, makeResult({
    id: "things-must-go-right",
    name: "How Many Things Must Go Right? Number",
    shortName: "Miracles",
    score,
    label: known.length === 0 ? "Checklist needed" : miracles <= 2 ? "Simple" : miracles <= 4 ? "Complicated" : "Prayer required",
    explanation: known.length === 0
      ? "The project-risk checklist has not been completed."
      : `${miracles} of seven possible dependencies are currently marked as required. Lower is better.`,
    inputsUsed: Object.fromEntries(known),
    missingInputs: missing,
    isHigherBetter: false,
    visualTheme: "complexity",
    mode: "manual"
  }));
}

export function calculateDoubleWithoutNews(company: Company): AbsurdMetricResult {
  const inputs = manual(company);
  const missing = [
    ...(company.evEbitda === null ? ["evEbitda"] : []),
    ...(inputs.pNav === undefined ? ["pNav"] : []),
    ...(company.fcfYield === null ? ["fcfYield"] : []),
    ...(inputs.peerEvEbitda === undefined ? ["peerEvEbitda"] : []),
    ...(inputs.cashFlowAtSpotPositive === undefined ? ["cashFlowAtSpotPositive"] : [])
  ];
  let points = 0;
  let checks = 0;
  if (company.evEbitda !== null) {
    points += company.evEbitda <= 5 ? 2 : company.evEbitda <= 8 ? 1 : 0;
    checks += 2;
  }
  if (inputs.pNav !== undefined) {
    points += inputs.pNav <= 0.5 ? 2 : inputs.pNav <= 0.8 ? 1 : 0;
    checks += 2;
  }
  if (company.fcfYield !== null) {
    points += company.fcfYield >= 10 ? 2 : company.fcfYield >= 5 ? 1 : 0;
    checks += 2;
  }
  if (inputs.peerEvEbitda !== undefined && company.evEbitda !== null) {
    points += company.evEbitda <= inputs.peerEvEbitda * 0.65 ? 2 : company.evEbitda < inputs.peerEvEbitda ? 1 : 0;
    checks += 2;
  }
  if (inputs.cashFlowAtSpotPositive !== undefined) {
    points += inputs.cashFlowAtSpotPositive ? 2 : 0;
    checks += 2;
  }
  const score = checks ? clamp((points / checks) * 100) : null;
  const verdict: DoubleWithoutNewsResult | "Insufficient data" = score === null ? "Insufficient data" : score >= 72 ? "Yes" : score >= 45 ? "Maybe" : "No";

  return applyConfig(company, makeResult({
    id: "double-without-news",
    name: "Can This Double Without Good News? Test",
    shortName: "Double Test",
    score,
    label: verdict,
    explanation: score === null
      ? "No usable valuation checks are available."
      : `${verdict}: ${points} valuation points earned from ${checks} available points; missing checks reduce confidence.`,
    inputsUsed: {
      ...(company.evEbitda === null ? {} : { evEbitda: company.evEbitda }),
      ...(company.fcfYield === null ? {} : { fcfYield: company.fcfYield }),
      ...(inputs.pNav === undefined ? {} : { pNav: inputs.pNav }),
      ...(inputs.peerEvEbitda === undefined ? {} : { peerEvEbitda: inputs.peerEvEbitda }),
      ...(inputs.cashFlowAtSpotPositive === undefined ? {} : { cashFlowAtSpotPositive: inputs.cashFlowAtSpotPositive })
    },
    missingInputs: missing,
    isHigherBetter: true,
    visualTheme: "valuation"
  }));
}

export function calculateSleepingGiant(
  company: Company,
  related?: Partial<Record<AbsurdMetricId, AbsurdMetricResult>>
): AbsurdMetricResult {
  const configured = company.absurdMetrics?.compositeWeights ?? {};
  const weights = { ...defaultSleepingGiantWeights, ...configured };
  const infrastructure = related?.["road-to-starbucks"]?.score;
  const hype = related?.["hype-liability"]?.score;
  const attention = manual(company).investorAttentionScore;
  const missing = [
    ...(infrastructure === null || infrastructure === undefined ? ["roadToStarbucksScore"] : []),
    ...(hype === null || hype === undefined ? ["hypeLiability"] : []),
    ...(attention === undefined ? ["investorAttentionScore"] : [])
  ];
  const attentionDiscount = attention === undefined ? company.neglectedScore : 100 - attention;
  const assetQuality = clamp(assetQualityScore(company) * 0.8 + attentionDiscount * 0.2);
  // The headline composite uses only normalized factors and applies hype as a penalty.
  const raw =
    valuationScore(company) * weights.valuation +
    assetQuality * weights.assetQuality +
    balanceSheetScore(company) * weights.balanceSheet +
    jurisdictionScore(company) * weights.jurisdiction +
    company.managementQuality * weights.management +
    (infrastructure ?? 50) * weights.infrastructure -
    (hype ?? 35) * weights.hypePenalty;
  const totalWeight =
    weights.valuation +
    weights.assetQuality +
    weights.balanceSheet +
    weights.jurisdiction +
    weights.management +
    weights.infrastructure;
  const score = clamp(raw / Math.max(totalWeight, 0.01));

  return applyConfig(company, makeResult({
    id: "sleeping-giant",
    name: "Sleeping Giant Coefficient",
    shortName: "Sleeping Giant",
    score,
    label: score >= 80 ? "One eye open" : score >= 65 ? "Stirring" : score >= 48 ? "Still sleeping" : "Possibly just a hill",
    explanation: "Headline opportunity score blending valuation, asset quality, balance sheet, jurisdiction, management, infrastructure and a hype penalty.",
    inputsUsed: {
      valuation: valuationScore(company),
      assetQuality,
      balanceSheet: balanceSheetScore(company),
      jurisdiction: jurisdictionScore(company),
      management: company.managementQuality,
      infrastructure: infrastructure ?? 50,
      hypePenalty: hype ?? 35,
      attentionDiscount
    },
    missingInputs: missing,
    isHigherBetter: true,
    visualTheme: "giant",
    mode: "hybrid"
  }));
}

export function calculateAbsurdMetrics(company: Company): AbsurdMetricResult[] {
  const results = [
    calculateWouldBarrickBother(company),
    calculateCeoSleep(company),
    calculateRoadToStarbucks(company),
    calculateInstitutionalComfort(company),
    calculateShovelDensity(company),
    calculateHypeLiability(company),
    calculateGeologyReality(company),
    calculateThingsMustGoRight(company),
    calculateDoubleWithoutNews(company)
  ];
  const byId = Object.fromEntries(results.map((result) => [result.id, result])) as Partial<Record<AbsurdMetricId, AbsurdMetricResult>>;
  results.push(calculateSleepingGiant(company, byId));
  const disabled = new Set(company.absurdMetrics?.disabledMetrics ?? []);
  return results.filter((result) => !disabled.has(result.id));
}

export function getAbsurdMetric(company: Company, id: AbsurdMetricId) {
  return calculateAbsurdMetrics(company).find((metric) => metric.id === id) ?? null;
}

function quantile(values: number[], percentile: number) {
  if (!values.length) return undefined;
  const sorted = values.slice().sort((a, b) => a - b);
  const index = Math.min(sorted.length - 1, Math.max(0, Math.ceil(percentile * sorted.length) - 1));
  return Math.round(sorted[index]);
}

export function calculateAbsurdBenchmarks(
  companies: Company[],
  selectedCompany: Company
): Partial<Record<AbsurdMetricId, AbsurdMetricBenchmark>> {
  const peers = companies.filter(
    (company) =>
      company.slug !== selectedCompany.slug &&
      company.commodity === selectedCompany.commodity &&
      company.status === selectedCompany.status &&
      company.active &&
      !company.hidden
  );
  const peerResults = peers.map((company) => calculateAbsurdMetrics(company));
  const benchmarks: Partial<Record<AbsurdMetricId, AbsurdMetricBenchmark>> = {};

  for (const id of absurdMetricIds) {
    const metricValues = peerResults
      .map((results) => results.find((metric) => metric.id === id))
      .filter((metric): metric is AbsurdMetricResult => Boolean(metric && metric.score !== null));
    const values = metricValues.map((metric) => metric.score!);
    if (values.length < 2) continue;
    const higherBetter = metricValues[0].isHigherBetter;
    benchmarks[id] = {
      peerAverage: Math.round(average(values)),
      peerCount: values.length,
      topQuartileThreshold: quantile(values, higherBetter ? 0.75 : 0.25),
      sourceLabel: `${selectedCompany.commodity} ${selectedCompany.status.toLowerCase()} app peer set`
    };
  }

  return benchmarks;
}

function scored(metrics: AbsurdMetricResult[], id: AbsurdMetricId) {
  return metrics.find((metric) => metric.id === id)?.score ?? null;
}

function archetypeFor(company: Company, metrics: AbsurdMetricResult[]): [AbsurdArchetype, string] {
  const giant = scored(metrics, "sleeping-giant") ?? 0;
  const finance = scored(metrics, "ceo-sleep") ?? 0;
  const takeover = scored(metrics, "barrick-bother") ?? 0;
  const builders = scored(metrics, "shovel-density") ?? 0;
  const infrastructure = scored(metrics, "road-to-starbucks") ?? 0;
  const complexity = scored(metrics, "things-must-go-right") ?? 50;

  if (company.status === "royalty" || company.status === "streamer") {
    return ["Hidden Royalty", "Asset exposure can compound without carrying the full operating burden of a mine builder."];
  }
  if (finance < 30 && complexity >= 50) {
    return ["Dilution Machine", "Financing pressure and a complicated path to value make shareholder dilution the dominant risk."];
  }
  if (giant < 35 && finance < 40) {
    return ["Zombie Miner", "Weak survivability and limited hidden-quality evidence suggest the discount may be deserved."];
  }
  if (builders >= 75) {
    return ["Mine Builder Mafia", "An unusually experienced operating bench is the company’s clearest differentiated asset."];
  }
  if (takeover >= 70) {
    return ["Future Takeover", "Strategic scale and asset quality create credible major-company optionality."];
  }
  if (infrastructure >= 75) {
    return ["Infrastructure Winner", "Existing access and logistics remove risk that remote peers still need to finance and build."];
  }
  if (finance >= 75 && (company.fcfYield ?? 0) > 5) {
    return ["Cash Cow", "Cash generation and balance-sheet flexibility let the company compound without depending on capital markets."];
  }
  if (complexity >= 60 && company.commodityLeverage >= 70) {
    return ["Lottery Ticket", "The upside can be large, but too many linked assumptions sit between the company and cash flow."];
  }
  return ["Sleeping Giant", giant >= 60
    ? "The quality and valuation mix looks better than current investor attention implies."
    : "There are hints of hidden value, but the evidence is not yet strong enough for a high-conviction classification."];
}

function unique(items: string[]) {
  return [...new Set(items)].slice(0, 4);
}

export function buildAbsurdThesis(company: Company, metrics = calculateAbsurdMetrics(company)): AbsurdThesis {
  const available = metrics.filter((metric) => metric.score !== null);
  const positives = available
    .filter((metric) => (metric.isHigherBetter ? metric.score! : 100 - metric.score!) >= 65)
    .sort((a, b) => (b.isHigherBetter ? b.score! : 100 - b.score!) - (a.isHigherBetter ? a.score! : 100 - a.score!));
  const negatives = available
    .filter((metric) => (metric.isHigherBetter ? metric.score! : 100 - metric.score!) < 45)
    .sort((a, b) => (a.isHigherBetter ? a.score! : 100 - a.score!) - (b.isHigherBetter ? b.score! : 100 - b.score!));
  const miracles = metrics.find((metric) => metric.id === "things-must-go-right");
  const manualInputs = company.absurdMetrics?.manualInputs;
  const mustGoRight = [
    ...(manualInputs?.financingNeeded ? ["Financing must arrive without excessive dilution."] : []),
    ...(manualInputs?.permitPending ? ["Permitting must advance on the expected timetable."] : []),
    ...(manualInputs?.metallurgyUnresolved ? ["Metallurgy must confirm economic recoveries."] : []),
    ...(manualInputs?.infrastructureMissing ? ["Infrastructure must be financed and delivered."] : []),
    ...(manualInputs?.metalPriceIncreaseNeeded ? [`${company.commodity} prices must remain supportive or improve.`] : []),
    ...(manualInputs?.capexBlowoutRisk ? ["Project capital must remain within the stated plan."] : [])
  ];
  const [archetype, archetypeExplanation] = archetypeFor(company, metrics);

  return {
    convictionScore: scored(metrics, "sleeping-giant"),
    archetype,
    archetypeExplanation,
    whyItMightWork: unique(
      positives.length
        ? positives.map((metric) => metric.investorTakeaway)
        : ["No strong positive signal has enough evidence yet. The opportunity needs further diligence."]
    ),
    whyItMightFail: unique([
      ...negatives.map((metric) => metric.investorTakeaway),
      ...company.riskFlags.slice(0, 2)
    ]).slice(0, 4).length
      ? unique([
          ...negatives.map((metric) => metric.investorTakeaway),
          ...company.riskFlags.slice(0, 2)
        ]).slice(0, 4)
      : ["No decisive red flag is scored, but incomplete evidence can still hide project-specific risk."],
    whatMustGoRight: unique(
      mustGoRight.length
        ? mustGoRight
        : miracles?.score !== null && miracles && miracles.score < 25
          ? ["Management must execute the existing plan without introducing new dependencies."]
          : ["Complete the dependency checklist before treating the thesis as fully underwritten."]
    )
  };
}
