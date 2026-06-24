"use client";

import { useEffect, useState } from "react";
import { Toggle } from "@/components/admin/Toggle";
import {
  absurdMetricIds,
  calculateAbsurdMetrics,
  defaultSleepingGiantWeights
} from "@/lib/absurdMetrics";
import type { Company } from "@/types/company";
import type {
  AbsurdMetricCompanyConfig,
  AbsurdMetricId,
  AbsurdMetricManualInputs,
  MetricCalculationMode,
  SleepingGiantWeights
} from "@/types/absurdMetrics";

const labels: Record<AbsurdMetricId, string> = {
  "barrick-bother": "Would Barrick Bother?",
  "ceo-sleep": "CEO Sleep",
  "road-to-starbucks": "Road to Starbucks",
  "institutional-comfort": "Institutional Comfort",
  "shovel-density": "Shovel Density",
  "hype-liability": "Hype Liability",
  "geology-reality": "Geology to Reality",
  "things-must-go-right": "Things Must Go Right",
  "double-without-news": "Double Without News",
  "sleeping-giant": "Sleeping Giant"
};

const weightLabels: Record<keyof SleepingGiantWeights, string> = {
  valuation: "Valuation",
  assetQuality: "Asset quality",
  balanceSheet: "Balance sheet",
  jurisdiction: "Jurisdiction",
  management: "Management",
  infrastructure: "Infrastructure",
  hypePenalty: "Hype penalty"
};

export function AbsurdMetricsAdminEditor({
  company,
  onChange
}: {
  company: Company;
  onChange: (patch: Partial<Company>) => void;
}) {
  const config = company.absurdMetrics ?? {};
  const [manualJson, setManualJson] = useState(JSON.stringify(config.manualInputs ?? {}, null, 2));
  const [manualError, setManualError] = useState("");
  const calculated = Object.fromEntries(calculateAbsurdMetrics(company).map((metric) => [metric.id, metric]));

  useEffect(() => {
    setManualJson(JSON.stringify(company.absurdMetrics?.manualInputs ?? {}, null, 2));
    setManualError("");
  }, [company.slug, company.absurdMetrics?.manualInputs]);

  function updateConfig(patch: Partial<AbsurdMetricCompanyConfig>) {
    onChange({
      absurdMetrics: {
        ...config,
        ...patch
      }
    });
  }

  function setMetricConfig(
    id: AbsurdMetricId,
    patch: {
      disabled?: boolean;
      mode?: MetricCalculationMode;
      score?: number | null;
      note?: string;
    }
  ) {
    const disabled = new Set(config.disabledMetrics ?? []);
    if (patch.disabled === true) disabled.add(id);
    if (patch.disabled === false) disabled.delete(id);

    const overrides = { ...(config.overrides ?? {}) };
    if (patch.score === null) {
      if (overrides[id]) {
        const { score: _score, ...remaining } = overrides[id]!;
        overrides[id] = remaining;
      }
    } else if (patch.score !== undefined) {
      overrides[id] = { ...overrides[id], score: patch.score };
    }

    updateConfig({
      disabledMetrics: [...disabled],
      metricModes: patch.mode
        ? { ...(config.metricModes ?? {}), [id]: patch.mode }
        : config.metricModes,
      overrides,
      adminNotes: patch.note !== undefined
        ? { ...(config.adminNotes ?? {}), [id]: patch.note }
        : config.adminNotes
    });
  }

  function applyManualInputs() {
    try {
      const parsed = JSON.parse(manualJson) as AbsurdMetricManualInputs;
      updateConfig({ manualInputs: parsed });
      setManualError("");
    } catch {
      setManualError("Invalid JSON. The current inputs were not changed.");
    }
  }

  const weights = { ...defaultSleepingGiantWeights, ...(config.compositeWeights ?? {}) };

  return (
    <section className="space-y-5 border-t border-zincLine pt-5">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-caution">
          Absurd Metrics
        </p>
        <p className="mt-2 text-xs leading-5 text-zinc-500">
          Disable metrics, choose calculation mode, override scores, and document analyst assumptions. Overrides are explicit and remain visible as manual or hybrid.
        </p>
      </div>

      <div className="space-y-2">
        {absurdMetricIds.map((id) => {
          const disabled = config.disabledMetrics?.includes(id) ?? false;
          const result = calculated[id];
          const overrideScore = config.overrides?.[id]?.score;

          return (
            <details key={id} className="rounded border border-zincLine bg-zinc-950/70 p-3">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
                <span className="min-w-0">
                  <span className="block truncate text-xs font-semibold text-zinc-200">{labels[id]}</span>
                  <span className="mt-1 block text-[10px] text-zinc-600">
                    {disabled ? "Disabled" : `${result?.score ?? "—"} · ${result?.confidence ?? "low"} confidence`}
                  </span>
                </span>
                <Toggle
                  checked={!disabled}
                  onChange={(enabled) => setMetricConfig(id, { disabled: !enabled })}
                  label={`Enable ${labels[id]}`}
                />
              </summary>
              <div className="mt-4 grid grid-cols-1 gap-3 border-t border-zincLine pt-3 sm:grid-cols-2">
                <label>
                  <span className="text-[10px] uppercase tracking-wide text-zinc-600">Mode</span>
                  <select
                    value={config.metricModes?.[id] ?? result?.mode ?? "hybrid"}
                    onChange={(event) => setMetricConfig(id, { mode: event.target.value as MetricCalculationMode })}
                    className="mt-1 h-9 w-full rounded border border-zincLine bg-zinc-950 px-2 text-xs text-zinc-200"
                  >
                    <option value="auto">Auto-calculated</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="manual">Manual</option>
                  </select>
                </label>
                <label>
                  <span className="text-[10px] uppercase tracking-wide text-zinc-600">Score override</span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={typeof overrideScore === "number" ? overrideScore : ""}
                    onChange={(event) => setMetricConfig(id, {
                      score: event.target.value === "" ? null : Number(event.target.value)
                    })}
                    placeholder="Auto"
                    className="mt-1 h-9 w-full rounded border border-zincLine bg-zinc-950 px-2 font-mono text-xs text-zinc-200"
                  />
                </label>
              </div>
              <label className="mt-3 block">
                <span className="text-[10px] uppercase tracking-wide text-zinc-600">Assumption note</span>
                <textarea
                  value={config.adminNotes?.[id] ?? ""}
                  onChange={(event) => setMetricConfig(id, { note: event.target.value })}
                  rows={2}
                  className="mt-1 w-full resize-y rounded border border-zincLine bg-zinc-950 p-2 text-xs leading-5 text-zinc-300"
                />
              </label>
            </details>
          );
        })}
      </div>

      <fieldset>
        <legend className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
          Sleeping Giant weights
        </legend>
        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {(Object.keys(weights) as Array<keyof SleepingGiantWeights>).map((key) => (
            <label key={key} className="rounded border border-zincLine bg-zinc-950/70 p-3">
              <span className="flex items-center justify-between gap-2 text-xs">
                <span className="text-zinc-500">{weightLabels[key]}</span>
                <span className="font-mono text-zinc-200">{Math.round(weights[key] * 100)}%</span>
              </span>
              <input
                type="range"
                min="0"
                max="40"
                value={Math.round(weights[key] * 100)}
                onChange={(event) => updateConfig({
                  compositeWeights: {
                    ...(config.compositeWeights ?? {}),
                    [key]: Number(event.target.value) / 100
                  }
                })}
                className="mt-2 w-full accent-[#f4c167]"
              />
            </label>
          ))}
        </div>
      </fieldset>

      <label className="block">
        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
          Manual inputs JSON
        </span>
        <textarea
          value={manualJson}
          onChange={(event) => setManualJson(event.target.value)}
          rows={12}
          spellCheck={false}
          className="mt-2 w-full resize-y rounded border border-zincLine bg-zinc-950 p-3 font-mono text-[11px] leading-5 text-zinc-300 outline-none focus:border-caution/60"
        />
        {manualError ? <span className="mt-2 block text-xs text-red-300">{manualError}</span> : null}
        <button
          type="button"
          onClick={applyManualInputs}
          className="mt-2 rounded border border-caution/40 bg-caution/10 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-caution"
        >
          Apply manual inputs
        </button>
      </label>
    </section>
  );
}
