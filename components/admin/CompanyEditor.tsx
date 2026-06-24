"use client";

import { Toggle } from "@/components/admin/Toggle";
import { commodities } from "@/data/mining-universe";
import {
  companyStatuses,
  companyTags,
  investorUniverses
} from "@/lib/universe";
import type {
  Company,
  CompanyStatus,
  CompanyTag,
  InvestorUniverse
} from "@/types/company";
import { AbsurdMetricsAdminEditor } from "@/components/admin/AbsurdMetricsAdminEditor";

function MultiSelect<T extends string>({
  label,
  options,
  selected,
  onChange
}: {
  label: string;
  options: T[];
  selected: T[];
  onChange: (selected: T[]) => void;
}) {
  return (
    <fieldset>
      <legend className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
        {label}
      </legend>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((option) => {
          const active = selected.includes(option);

          return (
            <button
              key={option}
              type="button"
              onClick={() =>
                onChange(
                  active
                    ? selected.filter((item) => item !== option)
                    : [...selected, option]
                )
              }
              className={`rounded border px-2 py-1 text-[11px] transition ${
                active
                  ? "border-terminalGreen/50 bg-terminalGreen/10 text-terminalGreen"
                  : "border-zincLine text-zinc-500 hover:border-zinc-600 hover:text-zinc-200"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

export function CompanyEditor({
  company,
  onChange
}: {
  company: Company | null;
  onChange: (patch: Partial<Company>) => void;
}) {
  if (!company) {
    return (
      <aside className="grid min-h-72 place-items-center rounded-lg border border-zincLine bg-zincPanel/70 p-6 text-center">
        <div>
          <p className="text-sm font-semibold text-zinc-300">Select a company</p>
          <p className="mt-2 text-xs leading-5 text-zinc-600">
            Choose a row or card to edit universe membership and research metadata.
          </p>
        </div>
      </aside>
    );
  }

  return (
    <aside className="min-w-0 overflow-hidden rounded-lg border border-zincLine bg-zincPanel/90">
      <header className="border-b border-zincLine p-4">
        <p className="font-mono text-xs text-caution">
          {company.ticker} · {company.exchange}
        </p>
        <h2 className="mt-2 truncate text-xl font-semibold text-zinc-50">
          {company.company}
        </h2>
        <p className="mt-1 text-xs text-zinc-600">Updated {company.lastUpdated}</p>
      </header>

      <div className="space-y-5 p-4">
        <div className="grid grid-cols-2 gap-3">
          <label className="flex items-center justify-between gap-3 rounded border border-zincLine bg-zinc-950 p-3">
            <span className="text-xs text-zinc-300">Active</span>
            <Toggle
              checked={company.active}
              onChange={(active) => onChange({ active })}
              label={`Set ${company.company} active`}
            />
          </label>
          <label className="flex items-center justify-between gap-3 rounded border border-zincLine bg-zinc-950 p-3">
            <span className="text-xs text-zinc-300">Hidden</span>
            <Toggle
              checked={company.hidden}
              onChange={(hidden) => onChange({ hidden })}
              label={`Set ${company.company} hidden`}
            />
          </label>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-1">
          <label className="min-w-0">
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
              Commodity
            </span>
            <select
              value={company.commodity}
              onChange={(event) =>
                onChange({ commodity: event.target.value as Company["commodity"] })
              }
              className="mt-2 h-10 w-full rounded border border-zincLine bg-zinc-950 px-3 text-sm text-zinc-100 outline-none focus:border-terminalGreen/60"
            >
              {commodities.map((commodity) => (
                <option key={commodity}>{commodity}</option>
              ))}
            </select>
          </label>

          <label className="min-w-0">
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
              Company status
            </span>
            <select
              value={company.status}
              onChange={(event) => {
                const status = event.target.value as CompanyStatus;
                onChange({
                  status,
                  stage: status === "producer" ? "Producer" : "Developer"
                });
              }}
              className="mt-2 h-10 w-full rounded border border-zincLine bg-zinc-950 px-3 text-sm capitalize text-zinc-100 outline-none focus:border-terminalGreen/60"
            >
              {companyStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>
        </div>

        <MultiSelect<InvestorUniverse>
          label="Investor universes"
          options={investorUniverses}
          selected={company.investorUniverses}
          onChange={(investorUniverses) => onChange({ investorUniverses })}
        />

        <MultiSelect<CompanyTag>
          label="Research tags"
          options={companyTags}
          selected={company.tags}
          onChange={(tags) => onChange({ tags })}
        />

        <label className="block">
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
            Notes
          </span>
          <textarea
            value={company.notes}
            onChange={(event) => onChange({ notes: event.target.value })}
            rows={5}
            placeholder="Internal research notes"
            className="mt-2 w-full resize-y rounded border border-zincLine bg-zinc-950 p-3 text-sm leading-6 text-zinc-100 outline-none placeholder:text-zinc-700 focus:border-terminalGreen/60"
          />
        </label>

        <label className="block">
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
            Source URL
          </span>
          <input
            type="url"
            value={company.sourceUrl}
            onChange={(event) => onChange({ sourceUrl: event.target.value })}
            placeholder="https://..."
            className="mt-2 h-10 w-full rounded border border-zincLine bg-zinc-950 px-3 text-sm text-zinc-100 outline-none placeholder:text-zinc-700 focus:border-terminalGreen/60"
          />
        </label>

        <AbsurdMetricsAdminEditor company={company} onChange={onChange} />
      </div>
    </aside>
  );
}
