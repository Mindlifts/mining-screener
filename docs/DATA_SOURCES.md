# Mining Intelligence Data Sources

This document compares practical free and low-cost sources for a daily mining intelligence dashboard. The design goal is accuracy first, low request volume second, and clear labels for source, freshness, confidence, and whether a metric is manual, API-sourced, official, or calculated.

## Source Priority

1. Official regulator or exchange sources.
2. Downloadable bulk files before per-symbol APIs.
3. Free or low-cost APIs with stable terms and documented endpoints.
4. Company filings, annual reports, technical reports, and MD&A for mining-specific data.
5. Fallback quote feeds only when clearly labeled as fallback.

## Recommended Initial Stack

| Need | Initial Source | Cost | Refresh | Confidence | Notes |
| --- | --- | --- | --- | --- | --- |
| US-listed financial statements | SEC EDGAR companyfacts | Free | Daily cache, filing-driven | High | Best source for standardized revenue, cash, debt, cash flow, shares outstanding. Use bulk ZIP when universe grows. |
| Daily equity prices | Alpha Vantage or FMP | Free tier / low-cost | Once daily | Medium | Use one provider consistently for close price and currency. Store raw response. |
| Market cap | FMP profile/enterprise value, or provider market cap | Free tier / low-cost | Once daily | Medium | Prefer source-provided market cap. Calculate price x shares only if direct value is unavailable. |
| Enterprise value | FMP enterprise value endpoint | Free tier / low-cost | Once daily | Medium | Prefer direct EV. Calculate only if direct EV is missing and debt/cash/share data are reliable. |
| Balance sheet | SEC EDGAR, FMP, Alpha Vantage | Free / free tier | Filing-driven or daily cache | High to medium | SEC is preferred for US/SEC filers; provider APIs help non-US tickers. |
| Production, AISC, reserves/resources | Company filings, annual reports, technical reports | Free | Manual review | High when sourced | Keep in `data/manualMiningMetrics.json` until a filings parser is built. |
| Insider ownership | SEC Forms 3/4/5, SEDAR+/issuer circulars, FMP insider endpoints | Free / free tier | Filing-driven | Medium | Hard to normalize globally. Start manual/API hybrid. |
| Commodity prices | Alpha Vantage commodity endpoints, exchange/vendor feeds | Free tier / paid | Once daily | Medium | Gold/silver/copper easier than uranium/coal. Uranium and coal often need paid/specialist sources. |
| Macro data | FRED API | Free | Once daily | High | Use for real rates, CPI, yields, USD, recession indicators. |

## Source Comparison By Metric

### Daily Prices

- Alpha Vantage: documented daily time series and quote endpoints, free API key, broad enough for a prototype.
- Financial Modeling Prep: useful quote/profile endpoints and broad global coverage, but endpoint access depends on plan.
- Official exchanges: most accurate, but redistribution and API access often require paid licensing.
- Yahoo chart endpoint: fallback only. It is convenient but should not be the production primary source.

Recommendation: use Alpha Vantage first if the universe stays small; use FMP if global exchange coverage or direct market-cap/EV fields are needed.

### Market Cap

- Prefer source-provided market cap from FMP or Alpha Vantage company overview/profile.
- If missing, calculate market cap from daily close and official shares outstanding.
- Reject calculated values when share class, ADR ratio, or ticker mapping looks inconsistent.

Recommendation: do not rely on static sample market cap. Use direct provider value first, calculated value second.

### Enterprise Value

- Prefer direct EV from FMP enterprise value or comparable provider endpoint.
- Calculate only if market cap, debt, cash, preferred/minority interest are reliable.
- SEC filings can supply debt and cash, but direct EV is often cleaner for daily screening.

Recommendation: use provider EV when available; otherwise calculate and label `calculated`.

### Financial Statements And Balance Sheet

- SEC EDGAR companyfacts is the best free structured source for SEC filers.
- SEC offers per-company APIs and nightly bulk ZIP files.
- Alpha Vantage and FMP can fill gaps for non-US or non-SEC-listed companies.

Recommendation: SEC first for US/SEC filers, provider APIs for TSX/TSXV/ASX gaps.

### Production, AISC, Reserves, Resources

- These are mining-specific and usually not consistently available in structured financial APIs.
- Primary sources are annual reports, MD&A, technical reports, reserve/resource statements, and company presentations.
- Store manually reviewed values with source URL, date, confidence, and reviewer notes.

Recommendation: keep these in `data/manualMiningMetrics.json` for now.

### Insider Ownership

- SEC Forms 3/4/5 are useful for US insiders but do not solve global issuer ownership.
- Company circulars, annual reports, SEDAR+ documents, and issuer filings are better for full insider ownership.
- FMP/Alpha Vantage may help with insider transactions, but global ownership normalization remains imperfect.

Recommendation: start with manual ownership for important names, then add API-assisted insider transaction feeds.

### Commodity Prices

- Alpha Vantage has commodity endpoints for common series.
- FRED has many macro/commodity-adjacent series, but not every mining input needed for live valuation.
- Uranium and coal benchmarks are often specialist or licensed.

Recommendation: use commodity proxies only with labels; obtain paid/specialist feeds for uranium and coal before presenting them as production-grade.

### Macro Data

- FRED is the preferred free source for treasury yields, inflation, unemployment, real-rate inputs, and broad macro series.
- Cache each series once daily by observation date.

Recommendation: add a FRED adapter for TIPS real yields, nominal yields, CPI, USD proxies, and industrial production.

## Daily Update Architecture

The intended flow:

1. Build today key: `YYYY-MM-DD`.
2. Check normalized cache. If today's cache exists and `--force` is not set, do nothing.
3. Fetch raw source responses once.
4. Save raw response envelope by source/date for auditability.
5. Normalize into dashboard-ready metrics.
6. Preserve the previous normalized cache if the API fails.
7. Attach metric quality:
   - `source`
   - `lastUpdated`
   - `confidence`
   - `origin`: `official`, `api`, `manual`, `calculated`, or `fallback`
   - optional warning
8. Render only minimal freshness in the dashboard: `Last updated: YYYY-MM-DD`.

## Fallback Rules

- API unavailable: use the latest cached value and keep its original `lastUpdated`.
- Missing mining-specific metric: use `data/manualMiningMetrics.json`.
- Missing direct EV, market cap, FCF yield, EBITDA, debt, or cash: calculate only if inputs are reliable.
- Uncertain value: show a warning badge and mark confidence as `low` or `medium`.
- Yahoo fallback: allowed only with `origin: fallback` or low-confidence API labeling.

## Current Implementation

- `lib/dataSources` defines source registry, adapter contracts, and metric quality types.
- `lib/dataCache` defines daily cache helpers and display-date formatting.
- `lib/dataNormalize` defines metric quality and source-preference helpers.
- `data/manualMiningMetrics.json` stores mining-specific manual fallback metrics.
- `data/official-cache.json` stores SEC filing-derived values.
- `data/market-data-cache.json` stores daily market values.
- `data/commodity-price-cache.json` stores daily commodity values and stale flags.

## What Should Stay Manual For Now

- AISC
- production by mine or consolidated production
- reserves and resources
- reserve life
- jurisdiction notes
- management quality
- mine-building track record
- key catalysts
- bull case and bear case

These metrics need human review because APIs rarely capture the mining context cleanly.

## Paid Or Specialist Sources To Consider Later

- S&P Capital IQ, FactSet, Refinitiv, Bloomberg: best coverage, expensive.
- FMP paid tiers: useful middle ground for global equities, EV, statements, and profile data.
- Alpha Vantage premium: useful if free request limits become too restrictive.
- LME/LBMA or licensed commodity vendors: better for metals benchmarks.
- UxC/TradeTech-style uranium benchmarks and coal index providers: likely required for production-grade uranium/coal prices.
