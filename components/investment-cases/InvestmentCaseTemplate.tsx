"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AppNavigation } from "@/components/AppNavigation";
import { InvestmentCaseMapClient } from "@/components/investment-cases/InvestmentCaseMapClient";
import type {
  InvestmentCaseData,
  InvestmentCaseMetric,
  InvestmentCaseRisk,
  InvestmentCaseScenario,
  InvestmentCaseTone
} from "@/data/investment-cases/types";

const toneClasses: Record<InvestmentCaseTone, string> = {
  positive: "text-terminalGreen",
  neutral: "text-zinc-100",
  caution: "text-caution",
  negative: "text-red-300"
};

const barClasses: Record<InvestmentCaseTone, string> = {
  positive: "bg-terminalGreen",
  neutral: "bg-zinc-300",
  caution: "bg-caution",
  negative: "bg-red-400"
};

function SectionHeader({
  eyebrow,
  title,
  description
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="max-w-3xl">
      <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-zinc-500">{eyebrow}</p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-50 sm:text-3xl">{title}</h2>
      {description ? <p className="mt-3 text-sm leading-6 text-zinc-400">{description}</p> : null}
    </div>
  );
}

function MetricCard({ metric, large = false }: { metric: InvestmentCaseMetric; large?: boolean }) {
  const tone = metric.tone ?? "neutral";

  return (
    <article className="flex min-h-[180px] min-w-0 flex-col justify-between overflow-hidden rounded-lg border border-zincLine bg-zincPanel/80 p-5">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">{metric.label}</p>
        <p className={`mt-4 break-words font-mono font-semibold ${large ? "text-4xl sm:text-5xl" : "text-3xl"} ${toneClasses[tone]}`}>
          {metric.value}
        </p>
      </div>
      <div className="mt-5">
        <p className="text-xs leading-5 text-zinc-500">{metric.detail}</p>
        {typeof metric.progress === "number" ? (
          <div className="mt-4 h-1 overflow-hidden bg-zinc-800">
            <div className={`h-full transition-all duration-700 ${barClasses[tone]}`} style={{ width: `${metric.progress}%` }} />
          </div>
        ) : null}
        {metric.sourcePage ? (
          <p className="mt-3 text-[9px] font-semibold uppercase tracking-wide text-zinc-600">
            {metric.calculated ? "Calculated from " : ""}presentation · PDF page {metric.sourcePage}
          </p>
        ) : null}
      </div>
    </article>
  );
}

function ScenarioCard({ scenario }: { scenario: InvestmentCaseScenario }) {
  return (
    <details className="group min-w-0 overflow-hidden rounded-lg border border-zincLine bg-zincPanel/75 open:border-zinc-600" open={scenario.name === "Base case"}>
      <summary className="cursor-pointer list-none p-5">
        <div className="flex min-w-0 items-start justify-between gap-4">
          <div className="min-w-0">
            <p className={`text-xs font-semibold uppercase tracking-[0.16em] ${toneClasses[scenario.tone]}`}>{scenario.name}</p>
            <h3 className="mt-3 text-lg font-semibold leading-7 text-zinc-50">{scenario.headline}</h3>
          </div>
          <div className="shrink-0 text-right">
            <p className="font-mono text-xl text-zinc-50">{scenario.target}</p>
            <p className="mt-1 text-[10px] uppercase text-zinc-500">{scenario.probability} weight</p>
          </div>
        </div>
      </summary>
      <div className="border-t border-zincLine px-5 pb-5 pt-4">
        <ul className="space-y-3">
          {scenario.points.map((point) => (
            <li key={point} className="border-l border-zinc-700 pl-3 text-sm leading-6 text-zinc-300">{point}</li>
          ))}
        </ul>
        <p className="mt-4 text-[9px] font-semibold uppercase tracking-wide text-zinc-600">
          Research scenario · presentation pages {scenario.sourcePages.join(", ")}
        </p>
      </div>
    </details>
  );
}

function ScorePanel({
  title,
  subtitle,
  metrics,
  accent
}: {
  title: string;
  subtitle: string;
  metrics: InvestmentCaseMetric[];
  accent: "green" | "amber";
}) {
  const accentClass = accent === "green" ? "text-terminalGreen" : "text-caution";
  const ringColor = accent === "green" ? "#9de58b" : "#f4c167";

  return (
    <section className="min-w-0 overflow-hidden rounded-lg border border-zincLine bg-zincPanel/80 p-5">
      <p className={`text-xs font-semibold uppercase tracking-[0.18em] ${accentClass}`}>{title}</p>
      <p className="mt-2 text-sm text-zinc-500">{subtitle}</p>
      <div className="mt-6 grid min-w-0 grid-cols-2 gap-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="min-w-0">
            <div
              className="grid aspect-square w-full max-w-28 place-items-center rounded-full p-2"
              style={{
                background: `conic-gradient(${ringColor} ${metric.progress ?? 0}%, #242833 0)`
              }}
            >
              <div className="grid h-full w-full place-items-center rounded-full bg-zincPanel">
                <span className="font-mono text-2xl text-zinc-50">{metric.value}</span>
              </div>
            </div>
            <p className="mt-3 text-xs font-semibold text-zinc-200">{metric.label}</p>
            <p className="mt-1 text-[11px] leading-4 text-zinc-600">{metric.detail}</p>
            {metric.sourcePage ? (
              <p className="mt-2 text-[9px] uppercase text-zinc-700">
                Calculated · p. {metric.sourcePage}
              </p>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}

function riskPosition(risk: InvestmentCaseRisk) {
  return {
    left: `${(risk.probability - 1) * 22 + 5}%`,
    bottom: `${(risk.impact - 1) * 22 + 5}%`
  };
}

export function InvestmentCaseTemplate({ data }: { data: InvestmentCaseData }) {
  const [activeTimeline, setActiveTimeline] = useState(data.timeline.findIndex((event) => event.status === "current"));
  const currentEvent = data.timeline[Math.max(0, activeTimeline)];
  const [publishedYear, publishedMonth] = data.source.published.split("-");
  const publishedLabel = new Intl.DateTimeFormat("en", {
    month: "long",
    year: "numeric",
    timeZone: "UTC"
  }).format(new Date(Date.UTC(Number(publishedYear), Number(publishedMonth) - 1, 1)));

  return (
    <main className="min-h-screen w-full max-w-full overflow-x-hidden bg-zinc-950 text-zinc-100">
      <div className="mx-auto w-full max-w-[1540px] overflow-hidden px-3 py-3 sm:px-5 lg:px-6">
        <AppNavigation />
      </div>

      <section className="relative overflow-hidden border-b border-zincLine">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_34%,rgba(213,217,226,0.12),transparent_34%)]" />
        <div className="relative mx-auto grid w-full max-w-[1540px] grid-cols-1 items-center gap-6 px-5 py-6 sm:gap-8 sm:py-8 lg:min-h-[620px] lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-10 lg:px-8 lg:py-20">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 rounded border border-caution/40 bg-caution/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-caution">
              Official {publishedLabel} investor presentation
            </div>
            <div className="mt-4 flex min-w-0 flex-col gap-4 sm:mt-10 sm:flex-row sm:items-center sm:gap-6">
              <div className="grid h-20 w-36 shrink-0 place-items-center overflow-hidden rounded-lg border border-zincLine bg-zinc-950 p-3 shadow-glow sm:h-28 sm:w-44">
                <Image src={data.logo} alt={`${data.company} logo`} width={180} height={115} className="h-full w-full object-contain" priority />
              </div>
              <div className="min-w-0">
                <p className="font-mono text-sm text-caution">{data.exchange}: {data.ticker}</p>
                <h1 className="mt-2 break-words text-4xl font-semibold tracking-tight text-zinc-50 sm:text-6xl lg:text-7xl">{data.company}</h1>
                <div className="mt-4 flex flex-wrap gap-2">
                  {data.commodityExposure.map((commodity) => (
                    <span key={commodity} className="rounded border border-zincLine px-2 py-1 text-xs uppercase text-zinc-400">{commodity}</span>
                  ))}
                </div>
              </div>
            </div>
            <p className="mt-5 max-w-4xl text-lg leading-7 text-zinc-200 sm:mt-10 sm:text-2xl sm:leading-9">{data.thesis}</p>
          </div>

          <div className="min-w-0 border-t border-zincLine pt-6 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
            <div className="flex min-w-0 items-end justify-between gap-4 lg:block">
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">Investment score</p>
                <p className="mt-2 text-xs text-zinc-500 lg:mt-3 lg:text-sm">Illustrative composite / 100</p>
              </div>
              <p className="shrink-0 font-mono text-6xl font-semibold text-terminalGreen lg:mt-4 lg:text-8xl">{data.score}</p>
            </div>
            <div className="mt-5 h-1 overflow-hidden bg-zinc-800 lg:mt-8">
              <div className="h-full bg-terminalGreen" style={{ width: `${data.score}%` }} />
            </div>
            <p className="mt-3 text-xs text-zinc-600 lg:mt-5">Market snapshot · {data.asOf} · score calculated by Mining Intelligence</p>
          </div>
        </div>
      </section>

      <div className="mx-auto flex w-full max-w-[1540px] flex-col gap-20 overflow-hidden px-3 pb-16 pt-8 sm:px-5 sm:pt-12 lg:px-6 lg:py-24">
        <section>
          <SectionHeader eyebrow="01 · Strategic relevance" title="Why it matters" description="Five signals that define the shape of the opportunity before detailed underwriting." />
          <div className="mt-8 grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
            {data.whyItMatters.map((metric) => <MetricCard key={metric.label} metric={metric} />)}
          </div>
        </section>

        <section>
          <SectionHeader eyebrow="02 · Operating footprint" title="A portfolio built for metals torque" description="Hover or tap each node to inspect the mine-level role inside the investment case." />
          <div className="mt-8">
            <InvestmentCaseMapClient assets={data.assets} />
          </div>
        </section>

        <section>
          <SectionHeader eyebrow="03 · Production" title="The operating engine, at a glance" />
          <div className="mt-8 grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {data.production.map((metric) => <MetricCard key={metric.label} metric={metric} large />)}
          </div>
        </section>

        <section>
          <SectionHeader eyebrow="04 · Scenario framework" title="One company, three possible futures" description="Expandable cases keep the mobile experience visual and concise." />
          <div className="mt-8 grid min-w-0 grid-cols-1 gap-3 lg:grid-cols-3">
            {data.scenarios.map((scenario) => <ScenarioCard key={scenario.name} scenario={scenario} />)}
          </div>
        </section>

        <section>
          <SectionHeader eyebrow="05 · Financial profile" title="The valuation dashboard without the spreadsheet" />
          <div className="mt-8 grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
            {data.financials.map((metric) => <MetricCard key={metric.label} metric={metric} />)}
          </div>
        </section>

        <section>
          <SectionHeader eyebrow="06 · Investor DNA" title="The same company through two different lenses" />
          <div className="mt-8 grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-2">
            <ScorePanel title="Rick Rule view" subtitle="Survival, asset durability, jurisdiction, and margin of safety." metrics={data.rickRule} accent="green" />
            <ScorePanel title="Eric Sprott view" subtitle="Torque, silver leverage, growth, and visible catalysts." metrics={data.ericSprott} accent="amber" />
          </div>
        </section>

        <section>
          <SectionHeader eyebrow="07 · Corporate evolution" title="From producer to platform" description="Select a milestone to move through the investment narrative." />
          <div className="mt-8 overflow-hidden rounded-lg border border-zincLine bg-zincPanel/70">
            <div className="flex max-w-full gap-0 overflow-x-auto border-b border-zincLine">
              {data.timeline.map((event, index) => (
                <button
                  key={`${event.year}-${event.title}`}
                  type="button"
                  onClick={() => setActiveTimeline(index)}
                  className={`min-w-32 flex-1 border-r border-zincLine px-4 py-4 text-left transition last:border-r-0 ${
                    activeTimeline === index ? "bg-zinc-100 text-zinc-950" : "text-zinc-500 hover:bg-zinc-900 hover:text-zinc-100"
                  }`}
                >
                  <span className="block font-mono text-lg">{event.year}</span>
                  <span className="mt-1 block truncate text-[10px] font-semibold uppercase tracking-wide">{event.category}</span>
                </button>
              ))}
            </div>
            <div className="grid min-w-0 grid-cols-1 gap-6 p-6 lg:grid-cols-[220px_minmax(0,1fr)] lg:p-10">
              <p className="font-mono text-6xl text-caution">{currentEvent.year}</p>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">{currentEvent.category}</p>
                <h3 className="mt-3 text-2xl font-semibold text-zinc-50">{currentEvent.title}</h3>
                <p className="mt-4 max-w-3xl text-sm leading-7 text-zinc-300">{currentEvent.description}</p>
                <p className="mt-4 text-[9px] font-semibold uppercase tracking-wide text-zinc-600">
                  Corporate presentation · PDF page {currentEvent.sourcePage}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <SectionHeader eyebrow="08 · Risk architecture" title="Where the thesis can break" description="Probability runs left to right. Impact runs bottom to top." />
          <div className="mt-8 grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_380px]">
            <div className="relative aspect-square w-full max-w-[680px] overflow-hidden rounded-lg border border-zincLine bg-zincPanel/60">
              <div className="absolute inset-0 grid grid-cols-4 grid-rows-4">
                {Array.from({ length: 16 }).map((_, index) => (
                  <div key={index} className="border-b border-r border-zincLine/70" />
                ))}
              </div>
              <span className="absolute bottom-2 left-3 text-[10px] uppercase text-zinc-600">Lower impact</span>
              <span className="absolute right-3 top-2 text-[10px] uppercase text-zinc-600">Higher probability</span>
              {data.risks.map((risk) => (
                <div
                  key={risk.name}
                  className={`absolute -translate-x-1/2 translate-y-1/2 rounded border px-2 py-1 text-[10px] font-semibold uppercase shadow-glow ${
                    risk.level === "High"
                      ? "border-red-400/60 bg-red-400/15 text-red-200"
                      : risk.level === "Medium"
                        ? "border-caution/60 bg-caution/15 text-caution"
                        : "border-terminalGreen/60 bg-terminalGreen/15 text-terminalGreen"
                  }`}
                  style={riskPosition(risk)}
                >
                  {risk.name}
                </div>
              ))}
            </div>
            <div className="space-y-3">
              {data.risks.map((risk) => (
                <details key={risk.name} className="rounded-lg border border-zincLine bg-zincPanel/75 p-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
                    <span className="text-sm font-semibold text-zinc-100">{risk.name}</span>
                    <span className={`text-[10px] font-semibold uppercase ${risk.level === "High" ? "text-red-300" : "text-caution"}`}>{risk.level}</span>
                  </summary>
                  <p className="mt-3 text-xs leading-5 text-zinc-500">{risk.mitigation}</p>
                  <p className="mt-3 text-[9px] font-semibold uppercase tracking-wide text-zinc-700">
                    Presentation · PDF page {risk.sourcePage}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <footer className="flex min-w-0 flex-col gap-4 border-t border-zincLine pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-terminalGreen">Primary source</p>
            <p className="mt-1 max-w-3xl text-xs leading-5 text-zinc-600">
              Operating, reserve, guidance, liquidity and catalyst facts are mapped from {data.company}&apos;s official presentation. Investor scores, scenarios and derived values are Mining Intelligence calculations and are labelled as such.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a
              href={data.source.url}
              target="_blank"
              rel="noreferrer"
              className="shrink-0 rounded border border-terminalGreen/50 bg-terminalGreen/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-terminalGreen hover:bg-terminalGreen/15"
            >
              Open official presentation
            </a>
            <Link href={`/companies/${data.companySlug}`} className="shrink-0 rounded border border-zincLine px-4 py-2 text-xs font-semibold uppercase tracking-wide text-zinc-300 hover:border-zinc-500 hover:text-zinc-50">
              Open standard company page
            </Link>
          </div>
        </footer>
      </div>
    </main>
  );
}
