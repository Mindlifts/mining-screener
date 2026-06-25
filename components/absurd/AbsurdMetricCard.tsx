"use client";

import { useEffect, useRef, useState } from "react";
import { AbsurdMetricIllustration } from "@/components/absurd/AbsurdMetricIllustrations";
import { AbsurdMetricMicroViz } from "@/components/absurd/AbsurdMetricMicroViz";
import { absurdMetricsConfig } from "@/lib/absurdMetricsConfig";
import type { AbsurdMetricBenchmark, AbsurdMetricResult } from "@/types/absurdMetrics";

const accentColors: Record<AbsurdMetricResult["visualTheme"], string> = {
  truck: "#42bce8",
  sleep: "#78d26a",
  infrastructure: "#ef8738",
  institutional: "#b778e4",
  builders: "#e4bd40",
  hype: "#24c6a4",
  conversion: "#b36de2",
  complexity: "#ef8738",
  valuation: "#e4bd40",
  giant: "#d887dc"
};

const tierStyles: Record<AbsurdMetricResult["statusTier"], string> = {
  weak: "border-red-400/45",
  neutral: "border-[#28343d]",
  strong: "border-terminalGreen/45",
  extreme: "border-caution/70 shadow-[0_0_22px_rgba(228,189,64,0.10)]"
};

function Value({ value }: { value: number | undefined }) {
  return <span className="font-mono text-zinc-200">{value === undefined ? "—" : Math.round(value)}</span>;
}

function ShovelEvidence({ metric }: { metric: AbsurdMetricResult }) {
  const value = (name: string) => {
    const item = metric.inputsUsed[name];
    return typeof item === "number" ? item : "—";
  };

  return (
    <dl className="grid grid-cols-2 gap-x-3 gap-y-2 border border-[#24313a] bg-[#071016] p-2 text-[10px]">
      <div><dt className="text-zinc-600">Builders</dt><dd className="font-mono text-zinc-200">{value("buildersCount")}</dd></div>
      <div><dt className="text-zinc-600">Technical Execs</dt><dd className="font-mono text-zinc-200">{value("technicalExecutivesCount")}</dd></div>
      <div><dt className="text-zinc-600">Key People</dt><dd className="font-mono text-zinc-200">{value("totalKeyPeople")}</dd></div>
      <div><dt className="text-zinc-600">Confidence</dt><dd className="uppercase text-zinc-200">{metric.mode} / {metric.confidence}</dd></div>
    </dl>
  );
}

function Comparison({
  metric,
  benchmark
}: {
  metric: AbsurdMetricResult;
  benchmark?: AbsurdMetricBenchmark;
}) {
  const score = metric.score ?? 0;
  const peer = benchmark?.peerAverage;
  const quartile = benchmark?.topQuartileThreshold;

  return (
    <div className="border-t border-[#202a31] pt-2">
      <div className="grid grid-cols-3 gap-2 text-[9px]">
        <span className="min-w-0 text-zinc-600">Company<br /><Value value={metric.score ?? undefined} /></span>
        <span className="min-w-0 text-zinc-600">Peer Avg<br /><Value value={peer} /></span>
        <span className="min-w-0 text-zinc-600">Top Quartile<br />
          <span className="font-mono text-zinc-200">
            {quartile === undefined ? "—" : `${metric.isHigherBetter ? "" : "≤"}${Math.round(quartile)}${metric.isHigherBetter ? "+" : ""}`}
          </span>
        </span>
      </div>
      {peer === undefined ? (
        <p className="mt-2 text-[9px] text-zinc-600">Peer benchmark unavailable</p>
      ) : (
        <>
          <div className="relative mt-2 h-1.5 bg-[#1c272e]" aria-label="Company and peer comparison">
            <span className="absolute top-0 h-full w-1 bg-zinc-500" style={{ left: `${Math.min(99, peer)}%` }} />
            <span className="absolute -top-0.5 h-2.5 w-1" style={{ left: `${Math.min(99, score)}%`, backgroundColor: accentColors[metric.visualTheme] }} />
          </div>
          <p className="mt-1 truncate text-[8px] text-zinc-700">{benchmark?.sourceLabel} · n={benchmark?.peerCount}</p>
        </>
      )}
      <p className="mt-1 text-[9px] text-zinc-700">Sector average unavailable</p>
    </div>
  );
}

export function AbsurdMetricCard({
  metric,
  number = 1,
  adminNote,
  benchmark
}: {
  metric: AbsurdMetricResult;
  number?: number;
  featured?: boolean;
  adminNote?: string;
  benchmark?: AbsurdMetricBenchmark;
}) {
  const [showInfo, setShowInfo] = useState(false);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const color = accentColors[metric.visualTheme];
  const definition = absurdMetricsConfig[metric.id];

  useEffect(() => {
    if (!showInfo) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setShowInfo(false);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [showInfo]);

  useEffect(() => () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
  }, []);

  return (
    <article
      className={`group relative flex min-h-[430px] min-w-0 flex-col overflow-hidden border bg-[#091117] p-3 shadow-[inset_0_0_24px_rgba(35,93,113,0.05)] transition duration-200 hover:bg-[#0b151c] ${tierStyles[metric.statusTier]}`}
      style={{ boxShadow: `inset 0 2px 0 ${color}66` }}
    >
      <div className="flex min-w-0 items-start gap-2.5">
        <span
          className="grid h-8 w-8 shrink-0 place-items-center border font-mono text-lg"
          style={{ borderColor: `${color}88`, color, backgroundColor: `${color}12` }}
        >
          {number}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-[11px] font-semibold uppercase leading-4 text-zinc-100">{metric.name}</h3>
          <p className="mt-1 text-[9px] uppercase tracking-wide text-zinc-600">{definition.whyItMatters}</p>
        </div>
        <button
          type="button"
          aria-label={`How ${metric.name} is calculated`}
          aria-expanded={showInfo}
          onMouseEnter={() => {
            hoverTimer.current = setTimeout(() => setShowInfo(true), 350);
          }}
          onMouseLeave={() => {
            if (hoverTimer.current) clearTimeout(hoverTimer.current);
          }}
          onFocus={() => {
            hoverTimer.current = setTimeout(() => setShowInfo(true), 350);
          }}
          onBlur={() => {
            if (hoverTimer.current) clearTimeout(hoverTimer.current);
          }}
          onClick={() => {
            if (hoverTimer.current) clearTimeout(hoverTimer.current);
            setShowInfo(true);
          }}
          className="grid h-9 w-9 shrink-0 place-items-center border border-[#3a4b56] text-sm font-semibold text-zinc-300 transition hover:border-caution hover:text-caution focus:border-caution focus:outline-none"
        >
          i
        </button>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="font-mono text-3xl font-medium" style={{ color }}>
            {metric.score ?? "—"}<span className="text-sm text-zinc-600"> / 100</span>
          </p>
          <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.12em]" style={{ color }}>{metric.label}</p>
        </div>
        <div className="h-12 w-16 shrink-0 opacity-90 transition duration-200 group-hover:scale-105" style={{ color }}>
          <AbsurdMetricIllustration id={metric.id} />
        </div>
      </div>

      {metric.signalBadge ? (
        <span className="mt-3 w-fit max-w-full truncate border border-current/40 px-2 py-1 text-[9px] font-semibold uppercase tracking-wide" style={{ color }}>
          {metric.signalBadge}
        </span>
      ) : null}

      <div className="mt-3 border-l-2 pl-3" style={{ borderColor: color }}>
        <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-zinc-500">Investor takeaway</p>
        <p className="mt-1 text-[11px] leading-5 text-zinc-300">{metric.investorTakeaway}</p>
      </div>

      <div className="mt-2">
        {metric.id === "shovel-density" ? <ShovelEvidence metric={metric} /> : <AbsurdMetricMicroViz metric={metric} color={color} />}
      </div>

      <div className="mt-auto">
        <Comparison metric={metric} benchmark={benchmark} />
        <div className="mt-2 flex items-center gap-1.5">
          <span className="border border-[#28343d] px-1.5 py-0.5 text-[8px] uppercase text-zinc-600">{metric.mode}</span>
          <span className="border border-[#28343d] px-1.5 py-0.5 text-[8px] uppercase text-zinc-600">{metric.confidence}</span>
          {metric.missingInputs.length ? <span className="ml-auto text-[8px] text-caution">{metric.missingInputs.length} missing</span> : null}
        </div>
      </div>

      {showInfo ? (
        <div
          className="absolute inset-0 z-20 flex min-w-0 flex-col overflow-y-auto bg-[#071016]/[0.98] p-4"
          role="dialog"
          aria-label={`${metric.name} calculation details`}
        >
          <div className="flex min-w-0 items-start justify-between gap-3 border-b border-[#27343d] pb-3">
            <div className="min-w-0">
              <p className="text-[9px] font-semibold uppercase tracking-[0.14em]" style={{ color }}>How it is calculated</p>
              <h4 className="mt-1 text-sm font-semibold text-zinc-100">{metric.name}</h4>
            </div>
            <button
              type="button"
              onClick={() => setShowInfo(false)}
              aria-label="Close calculation details"
              className="grid h-9 w-9 shrink-0 place-items-center border border-[#3a4b56] text-lg text-zinc-300 hover:border-caution hover:text-caution"
            >
              ×
            </button>
          </div>
          <div className="space-y-4 py-4 text-[11px] leading-5 text-zinc-400">
            <section>
              <p className="font-semibold uppercase text-zinc-200">Formula and assumptions</p>
              <p className="mt-1">{definition.formulaExplanation}</p>
              <p className="mt-2">{metric.explanation}</p>
            </section>
            <section>
              <p className="font-semibold uppercase text-zinc-200">Interpretation</p>
              <p className="mt-1"><span className="text-terminalGreen">High:</span> {definition.highScoreMeaning}</p>
              <p className="mt-1"><span className="text-red-300">Low:</span> {definition.lowScoreMeaning}</p>
            </section>
            <section>
              <p className="font-semibold uppercase text-zinc-200">Inputs used</p>
              <dl className="mt-2 grid grid-cols-1 gap-1">
                {Object.entries(metric.inputsUsed).map(([key, value]) => (
                  <div key={key} className="flex min-w-0 justify-between gap-3 border-b border-[#1d2930] py-1">
                    <dt className="min-w-0 break-words text-zinc-600">{key}</dt>
                    <dd className="max-w-[48%] break-words text-right font-mono text-zinc-300">{String(value)}</dd>
                  </div>
                ))}
              </dl>
            </section>
            <section>
              <p className="font-semibold uppercase text-zinc-200">Evidence health</p>
              <p className="mt-1">Mode: {metric.mode} · Confidence: {metric.confidence} · Input health: {metric.inputHealth}</p>
              {metric.missingInputs.length ? (
                <p className="mt-2 break-words text-caution">Missing: {metric.missingInputs.join(", ")}</p>
              ) : (
                <p className="mt-2 text-terminalGreen">No required inputs are currently missing.</p>
              )}
            </section>
            {adminNote ? <p className="border border-caution/30 bg-caution/5 p-2 text-caution">Admin note: {adminNote}</p> : null}
          </div>
        </div>
      ) : null}
    </article>
  );
}
