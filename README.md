# mining-screener
This Project is a web-based dashboard for analyzing publicly traded mining companies across key commodities

# Mining Intelligence Dashboard

## Overview

This project is a web-based dashboard for analyzing publicly traded mining companies across key commodities:

* Silver
* Uranium
* Copper
* Gold
* Coal

The goal is to provide a fast, clean, unique, unexpected and  mobile-friendly interface for comparing producers based on fundamental and operational metrics.

---

## Key Features

* 📊 Commodity-specific dashboards
* 📈 EV/EBITDA ranking
* 💰 Free Cash Flow (FCF) yield
* ⛏️ AISC (All-in Sustaining Cost)
* 🌍 Jurisdiction risk scoring
* 👥 Insider ownership tracking
* ⭐ Watchlist functionality
* 📱 Mobile-first design

---

## Tech Stack

* Frontend: Next.js + React
* Styling: Tailwind CSS
* Components: shadcn/ui
* Data: External APIs (market + fundamentals)
* Deployment: Vercel

---

## Project Structure

/app → Pages and routes
/components → UI components
/lib → Data + utilities
/data → Static datasets (if any)

---

## Goal

Build a professional-grade mining research tool similar to:

* Koyfin
* TradingView
* Bloomberg Terminal (simplified)

---

## Status

🚧 In development (AI-assisted with Codex)

---

## Future Features

* Portfolio tracking
* Alerts (price + fundamentals)
* News integration
* Company profile pages
* Backtesting tools

---

## Admin V1

The company universe manager is available at `/admin` when the server environment
contains `ADMIN_ENABLED=true`.

Admin V1 stores edits in browser local storage and can export a replacement
`data/companies.json` file. It does not write to the repository or a database.
Replace the environment gate and local drafts with authenticated, audited
database writes before deploying admin access.

---

## Absurd But True Mining Metrics

The `/absurd-metrics` section provides evidence-aware shorthand for takeover
appeal, financing runway, infrastructure, institutional comfort, mine-building
experience, promotion risk, resource conversion, project complexity, valuation
asymmetry, and the headline Sleeping Giant coefficient.

The engine lives in `lib/absurdMetrics.ts`. Missing inputs lower confidence and
are displayed in the UI. Analyst assumptions, manual inputs, overrides, metric
modes, disabled metrics, and composite weights are managed through Admin V1.
