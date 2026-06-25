import type {
  AbsurdMetricDefinition,
  AbsurdMetricId,
  AbsurdMetricResult,
  MetricStatusTier
} from "../types/absurdMetrics.ts";
import type { Company } from "../types/company.ts";

const range = (
  min: number,
  max: number,
  label: string,
  takeaway: string,
  statusTier: MetricStatusTier,
  signalBadge?: string
) => ({ min, max, label, takeaway, statusTier, signalBadge });

export const absurdMetricsConfig: Record<AbsurdMetricId, AbsurdMetricDefinition> = {
  "barrick-bother": {
    id: "barrick-bother",
    name: "Would Barrick Bother? Ratio",
    shortName: "Barrick Bother",
    absurdName: "Would Barrick Bother?",
    description: "A takeover-attractiveness proxy for assets large enough and clean enough to interest a major.",
    whyItMatters: "Strategic scarcity can create a valuation floor and a credible second path to shareholder returns.",
    highScoreMeaning: "Scale, jurisdiction and mine life make the company plausible major-company prey.",
    lowScoreMeaning: "The asset may be too small, awkward or early to matter to a major.",
    formulaExplanation: "Blends company scale, resource scale, production, mine life, jurisdiction and infrastructure quality.",
    scoreDirection: "higher_is_better",
    labelsByScoreRange: [
      range(0, 34, "Too Small to Care", "A major is unlikely to pay attention yet. The investment case must work without takeover help.", "weak"),
      range(35, 59, "Maybe on the Whiteboard", "There is strategic interest potential, but scale or project readiness still needs work.", "neutral"),
      range(60, 79, "Major Bait", "The asset has enough strategic weight to support takeover optionality.", "strong", "Future Takeover Bait"),
      range(80, 100, "Investment Banker Circling", "Strategic value is unusually high. A takeout is not required, but it is credible upside optionality.", "extreme", "Future Takeover Bait")
    ],
    dataFieldsUsed: ["marketCap", "resourceScale", "production", "reserveLife", "jurisdictionRisk", "infrastructureQuality"],
    confidenceLevel: "medium",
    benchmarkSupport: true,
    visualizationType: "sparkline"
  },
  "ceo-sleep": {
    id: "ceo-sleep",
    name: "CEO Sleeps Like a Baby Index",
    shortName: "CEO Sleep",
    absurdName: "CEO Sleeps Like a Baby",
    description: "Estimates financing runway and balance-sheet stress.",
    whyItMatters: "Companies that control their financing timetable can wait for better markets and avoid punitive dilution.",
    highScoreMeaning: "Cash runway and debt capacity provide strategic patience.",
    lowScoreMeaning: "A financing event may dictate the investment outcome.",
    formulaExplanation: "Uses cash, quarterly cash burn or positive free cash flow, net debt and the next expected financing need.",
    scoreDirection: "higher_is_better",
    labelsByScoreRange: [
      range(0, 29, "Financing Panic", "The balance sheet can force bad decisions or shareholder dilution. Financing risk dominates the thesis.", "extreme", "Financing Risk Rising"),
      range(30, 54, "Nervous Nights", "Runway exists, but management may soon negotiate from a weak position.", "weak", "Dilution Watch"),
      range(55, 79, "Comfortable Pillow", "Funding flexibility is better than the typical capital-hungry miner.", "strong", "Financing Risk Falling"),
      range(80, 100, "Baby Sleep Mode", "The company can fund itself or wait. Survival risk is not currently driving the story.", "extreme", "Balance Sheet Fortress")
    ],
    dataFieldsUsed: ["cash", "quarterlyCashBurn", "freeCashFlow", "netDebt", "nextFinancingNeedMonths"],
    confidenceLevel: "high",
    benchmarkSupport: true,
    visualizationType: "gauge"
  },
  "road-to-starbucks": {
    id: "road-to-starbucks",
    name: "Road to Starbucks Score",
    shortName: "Starbucks",
    absurdName: "Road to Starbucks",
    description: "Measures how much real-world infrastructure already surrounds an asset.",
    whyItMatters: "Roads, power and processing access can remove years, capex and execution risk from mine development.",
    highScoreMeaning: "The project is close to usable infrastructure and logistics.",
    lowScoreMeaning: "Infrastructure may become a hidden project inside the mining project.",
    formulaExplanation: "Scores distance to road, power, rail or port, processing and country infrastructure quality.",
    scoreDirection: "higher_is_better",
    labelsByScoreRange: [
      range(0, 29, "Helicopter Fantasy", "Infrastructure is a major value leak. Capex and schedule risk deserve a wide margin of safety.", "extreme", "Infrastructure Warning"),
      range(30, 54, "Long Dirt Road", "Access is possible, but infrastructure remains a meaningful execution variable.", "weak"),
      range(55, 79, "Truck-Ready", "Existing access lowers build complexity versus remote peers.", "strong", "Infrastructure Advantage"),
      range(80, 100, "Basically Civilization", "Infrastructure is a genuine competitive advantage that can accelerate cash flow.", "extreme", "Basically Civilization")
    ],
    dataFieldsUsed: ["distanceToRoadKm", "distanceToPowerKm", "distanceToRailOrPortKm", "distanceToProcessingKm", "infrastructureQuality"],
    confidenceLevel: "medium",
    benchmarkSupport: true,
    visualizationType: "bars"
  },
  "institutional-comfort": {
    id: "institutional-comfort",
    name: "Nobody Gets Fired Buying This Factor",
    shortName: "Committee Safe",
    absurdName: "Nobody Gets Fired Buying This",
    description: "A proxy for institutional investability and career risk.",
    whyItMatters: "An expanding institutional buyer pool can improve liquidity, valuation and access to capital.",
    highScoreMeaning: "The company is easier for investment committees to own.",
    lowScoreMeaning: "Ownership requires a strong contrarian case and tolerance for mandate risk.",
    formulaExplanation: "Blends jurisdiction, project maturity, liquidity, permitting and social risk.",
    scoreDirection: "higher_is_better",
    labelsByScoreRange: [
      range(0, 34, "Career Risk", "Institutional demand may remain thin. Cheap can stay cheap when mandates cannot own it.", "weak"),
      range(35, 59, "Committee Debate", "Investability is mixed; one unresolved issue may still block larger pools of capital.", "neutral"),
      range(60, 79, "Committee Safe", "The company clears more institutional hurdles than most speculative miners.", "strong", "Institutional Door Opening"),
      range(80, 100, "Institutional Comfort", "A broad investor base can own this without explaining every line item to compliance.", "extreme", "Nobody Gets Fired")
    ],
    dataFieldsUsed: ["jurisdictionRisk", "status", "marketCap", "permittingStatus", "esgSocialRisk"],
    confidenceLevel: "medium",
    benchmarkSupport: true,
    visualizationType: "gauge"
  },
  "shovel-density": {
    id: "shovel-density",
    name: "Shovel Density Metric",
    shortName: "Shovel Density",
    absurdName: "Shovel Density",
    description: "Measures how many key people have actually built or operated mines.",
    whyItMatters: "Mine building is an execution business. Relevant scar tissue can reduce schedule, capex and operating surprises.",
    highScoreMeaning: "The leadership bench contains an unusually high concentration of proven builders.",
    lowScoreMeaning: "The team may be stronger at promotion or finance than physical mine delivery.",
    formulaExplanation: "Builders plus half-weighted technical executives, divided by total key people. Counts require human review.",
    scoreDirection: "higher_is_better",
    labelsByScoreRange: [
      range(0, 24, "Paper-Pusher Zone", "Execution rests on a thin operating bench. Demand more evidence before underwriting construction.", "weak"),
      range(25, 49, "Some Muddy Boots", "There is credible mine-building experience, but it is not deep across the leadership team.", "neutral", "Actually Built Something"),
      range(50, 74, "Dirt Under Fingernails", "Above-average builder density lowers execution risk versus typical developers.", "strong", "Execution Risk Falling"),
      range(75, 100, "Mine Builder Mafia", "The team is stacked with people who have delivered mines before. Execution is a genuine asset.", "extreme", "Mine Builder Mafia")
    ],
    dataFieldsUsed: ["buildersCount", "technicalExecutivesCount", "totalKeyPeople"],
    confidenceLevel: "medium",
    benchmarkSupport: true,
    visualizationType: "people"
  },
  "hype-liability": {
    id: "hype-liability",
    name: "Future Press Release Liability",
    shortName: "Hype Liability",
    absurdName: "Future Press Release Liability",
    description: "Detects promotional language that may outrun operating evidence.",
    whyItMatters: "Promotion can pull expectations forward, leaving less upside and more disappointment risk.",
    highScoreMeaning: "Promotional language is frequent relative to the available announcement sample.",
    lowScoreMeaning: "Communication is comparatively plain-spoken and evidence-led.",
    formulaExplanation: "Counts promotional keywords per sampled company announcement. Lower is better.",
    scoreDirection: "lower_is_better",
    labelsByScoreRange: [
      range(0, 24, "Geologists Writing the Copy", "Communication is restrained. Expectations may leave room for results to surprise.", "strong", "Underpromising"),
      range(25, 49, "Marketing Has the Password", "Promotion is noticeable but not yet the entire investment case.", "neutral"),
      range(50, 74, "Siren Warming Up", "Narrative risk is elevated. Verify claims against filings and operating evidence.", "weak", "Hype Risk Rising"),
      range(75, 100, "Paradigm-Shifting Tuesdays", "The story may be priced ahead of proof. Treat every adjective as a liability.", "extreme", "Major Red Flag")
    ],
    dataFieldsUsed: ["hypeKeywordCount", "announcementCount"],
    confidenceLevel: "medium",
    benchmarkSupport: true,
    visualizationType: "sparkline"
  },
  "geology-reality": {
    id: "geology-reality",
    name: "Geology to Reality Conversion Rate",
    shortName: "Geology Reality",
    absurdName: "Geology to Reality",
    description: "Tests how much headline geology is becoming economically credible mine inventory.",
    whyItMatters: "Ounces only create value when metallurgy, studies and reserve conversion support extraction.",
    highScoreMeaning: "The resource has strong evidence of becoming recoverable, mineable inventory.",
    lowScoreMeaning: "Headline scale may be doing more work than economic proof.",
    formulaExplanation: "Combines reserve-to-resource conversion, recovery, metallurgy risk and study maturity.",
    scoreDirection: "higher_is_better",
    labelsByScoreRange: [
      range(0, 29, "Big Shiny Resource", "The geology is interesting, but economic conversion remains the central risk.", "weak"),
      range(30, 54, "Still in the Funnel", "Some economic evidence exists, but meaningful de-risking remains.", "neutral"),
      range(55, 79, "Mineable Ounces Emerging", "Resource quality is translating into a more financeable mine plan.", "strong"),
      range(80, 100, "Rock Becoming Money", "Conversion evidence is unusually strong. Asset quality is doing real valuation work.", "extreme", "Geology Becoming Cash Flow")
    ],
    dataFieldsUsed: ["resources", "reserves", "recoveryRate", "metallurgyRisk", "studyLevel"],
    confidenceLevel: "medium",
    benchmarkSupport: true,
    visualizationType: "bars"
  },
  "things-must-go-right": {
    id: "things-must-go-right",
    name: "How Many Things Must Go Right? Number",
    shortName: "Miracles",
    absurdName: "Things That Must Go Right",
    description: "Counts critical dependencies between today and the investment outcome.",
    whyItMatters: "A cheap asset with seven simultaneous dependencies is often less cheap than it looks.",
    highScoreMeaning: "Many unresolved dependencies must resolve favorably. High is worse.",
    lowScoreMeaning: "The path to value is comparatively direct and under management control.",
    formulaExplanation: "Counts flagged needs across metal price, financing, permits, metallurgy, infrastructure, politics and capex.",
    scoreDirection: "lower_is_better",
    labelsByScoreRange: [
      range(0, 24, "Two Shovels and a Plan", "Few major dependencies stand between the company and value creation.", "strong", "Simple Path"),
      range(25, 49, "Complicated, Not Cursed", "Several things must cooperate. Position sizing should reflect execution coupling.", "neutral"),
      range(50, 74, "Domino Architecture", "Too many linked assumptions can turn one setback into a thesis break.", "weak", "Complexity Risk"),
      range(75, 100, "Prayer Required", "The investment case needs a near-perfect sequence. Cheapness may be compensation, not opportunity.", "extreme", "Major Red Flag")
    ],
    dataFieldsUsed: ["metalPriceIncreaseNeeded", "financingNeeded", "permitPending", "metallurgyUnresolved", "infrastructureMissing", "politicalRisk", "capexBlowoutRisk"],
    confidenceLevel: "medium",
    benchmarkSupport: true,
    visualizationType: "dominoes"
  },
  "double-without-news": {
    id: "double-without-news",
    name: "Can This Double Without Good News? Test",
    shortName: "Double Test",
    absurdName: "Double Without Good News",
    description: "Tests whether valuation alone offers meaningful rerating potential.",
    whyItMatters: "The best asymmetry does not require heroic catalysts; valuation supplies part of the return.",
    highScoreMeaning: "Cash flow and relative valuation support upside without relying entirely on future headlines.",
    lowScoreMeaning: "The stock needs operational or promotional good news to justify a large rerating.",
    formulaExplanation: "Combines EV/EBITDA, P/NAV, FCF yield, spot-price cash flow and peer valuation checks.",
    scoreDirection: "higher_is_better",
    labelsByScoreRange: [
      range(0, 34, "Needs Fireworks", "Valuation alone is not enough. The thesis depends on catalysts or materially better outcomes.", "weak"),
      range(35, 59, "Maybe With a Tailwind", "Some valuation support exists, but the rerating still needs help.", "neutral"),
      range(60, 79, "Valuation Has an Engine", "Current valuation can carry meaningful upside before assuming perfect news.", "strong", "Asymmetry Detected"),
      range(80, 100, "No Press Release Required", "The stock can plausibly rerate on existing economics. New success would be additional upside.", "extreme", "Extreme Opportunity")
    ],
    dataFieldsUsed: ["evEbitda", "pNav", "fcfYield", "cashFlowAtSpotPositive", "peerEvEbitda"],
    confidenceLevel: "medium",
    benchmarkSupport: true,
    visualizationType: "sparkline"
  },
  "sleeping-giant": {
    id: "sleeping-giant",
    name: "Sleeping Giant Coefficient",
    shortName: "Sleeping Giant",
    absurdName: "Sleeping Giant",
    description: "The headline blend of quality, survivability, valuation and neglected attention.",
    whyItMatters: "It searches for companies where the quality of the asset and business is better than the market narrative implies.",
    highScoreMeaning: "Quality and valuation align while investor attention remains incomplete.",
    lowScoreMeaning: "The apparent discount is not supported by enough quality or financial resilience.",
    formulaExplanation: "Weights valuation, asset quality, balance sheet, jurisdiction, management and infrastructure, then subtracts a hype penalty.",
    scoreDirection: "higher_is_better",
    labelsByScoreRange: [
      range(0, 34, "Possibly Just a Hill", "The discount is not yet backed by enough quality. Avoid mistaking neglect for hidden value.", "weak"),
      range(35, 59, "Still Snoring", "There are useful ingredients, but the asymmetry is not yet decisive.", "neutral"),
      range(60, 79, "One Eye Open", "Quality and valuation are beginning to align. The market may be underestimating the setup.", "strong", "Institutions Sleeping"),
      range(80, 100, "Mountain Moving", "The opportunity mix is unusually strong. This deserves focused diligence and a clear catalyst map.", "extreme", "Extreme Opportunity")
    ],
    dataFieldsUsed: ["valuation", "assetQuality", "balanceSheet", "jurisdiction", "management", "infrastructure", "hypePenalty", "attentionDiscount"],
    confidenceLevel: "medium",
    benchmarkSupport: true,
    visualizationType: "sparkline"
  }
};

function resolveRange(metric: AbsurdMetricResult) {
  const definition = absurdMetricsConfig[metric.id];
  if (metric.score === null) return null;
  return definition.labelsByScoreRange.find(({ min, max }) => metric.score! >= min && metric.score! <= max) ?? null;
}

export function enrichAbsurdMetricResult(company: Company, metric: AbsurdMetricResult): AbsurdMetricResult {
  const definition = absurdMetricsConfig[metric.id];
  const selected = resolveRange(metric);
  const missingTakeaway = metric.missingInputs.length
    ? `Evidence is incomplete for ${metric.missingInputs.length} input${metric.missingInputs.length === 1 ? "" : "s"}. Treat this as a diligence prompt, not a precise ranking.`
    : "No usable score is available yet. Add the missing evidence before drawing an investment conclusion.";

  return {
    ...metric,
    name: definition.name,
    shortName: definition.shortName,
    label: selected?.label ?? "Insufficient data",
    investorTakeaway: selected?.takeaway ?? missingTakeaway,
    signalBadge: selected?.signalBadge ?? null,
    statusTier: selected?.statusTier ?? "neutral"
  };
}
