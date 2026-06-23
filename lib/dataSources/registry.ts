import type { DataSourceDefinition } from "@/lib/dataSources/types";

export const dataSourceRegistry: DataSourceDefinition[] = [
  {
    id: "sec-companyfacts",
    name: "SEC EDGAR companyfacts",
    categories: ["financialStatements", "balanceSheet", "marketCap", "enterpriseValue"],
    cost: "free",
    status: "active",
    updateCadence: "daily",
    requestStrategy: "Prefer nightly bulk ZIP for broad refreshes; use per-CIK companyfacts for small daily deltas.",
    termsNote: "Official SEC API, no key required; automated access must follow SEC fair-access guidance.",
    confidence: "high",
    url: "https://www.sec.gov/search-filings/edgar-application-programming-interfaces"
  },
  {
    id: "alpha-vantage",
    name: "Alpha Vantage",
    categories: ["dailyPrices", "marketCap", "financialStatements", "balanceSheet", "commodityPrices", "macro"],
    cost: "free-tier",
    status: "recommended",
    updateCadence: "daily",
    requestStrategy: "Use only once per symbol per day; store raw responses and normalized output.",
    termsNote: "API key required. Free tier is suitable for prototypes but request limits must be respected.",
    confidence: "medium",
    url: "https://www.alphavantage.co/documentation/"
  },
  {
    id: "financial-modeling-prep",
    name: "Financial Modeling Prep",
    categories: ["dailyPrices", "marketCap", "enterpriseValue", "financialStatements", "balanceSheet", "insiderOwnership", "commodityPrices"],
    cost: "free-tier",
    status: "recommended",
    updateCadence: "daily",
    requestStrategy: "Use bulk/profile endpoints for market cap and EV when available; do not recalculate direct source metrics.",
    termsNote: "API key required. Free and paid tiers vary by endpoint, exchange, and redistribution terms.",
    confidence: "medium",
    url: "https://site.financialmodelingprep.com/developer/docs"
  },
  {
    id: "company-filings",
    name: "Company filings and annual reports",
    categories: ["production", "reservesResources", "assetLocations", "insiderOwnership"],
    cost: "free",
    status: "manual",
    updateCadence: "manual-review",
    requestStrategy: "Track source document URL, period, and reviewer; update only when filings or technical reports change.",
    termsNote: "Primary issuer/regulator documents are preferred for mining-specific metrics.",
    confidence: "high",
    url: "https://www.sec.gov/edgar/search/"
  },
  {
    id: "fred",
    name: "FRED API",
    categories: ["macro"],
    cost: "free",
    status: "recommended",
    updateCadence: "daily",
    requestStrategy: "Fetch selected macro series once daily; cache by series ID and observation date.",
    termsNote: "API key required. Use FRED terms-compliant attribution.",
    confidence: "high",
    url: "https://fred.stlouisfed.org/docs/api/fred/"
  },
  {
    id: "yahoo-chart-fallback",
    name: "Yahoo Finance chart fallback",
    categories: ["dailyPrices", "commodityPrices"],
    cost: "free",
    status: "fallback",
    updateCadence: "daily",
    requestStrategy: "Fallback only until a terms-safe market-data provider is configured.",
    termsNote: "Not recommended as the primary production source; clearly label as fallback.",
    confidence: "low",
    url: "https://query2.finance.yahoo.com/v8/finance/chart"
  }
];

export function getDataSource(id: string) {
  return dataSourceRegistry.find((source) => source.id === id) ?? null;
}
