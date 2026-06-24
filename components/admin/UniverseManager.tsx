"use client";

import { Toggle } from "@/components/admin/Toggle";
import type { Company } from "@/types/company";

function StatusBadge({ company }: { company: Company }) {
  const visible = company.active && !company.hidden;

  return (
    <span
      className={`rounded border px-2 py-1 text-[10px] font-semibold uppercase ${
        visible
          ? "border-terminalGreen/40 bg-terminalGreen/10 text-terminalGreen"
          : "border-zinc-700 bg-zinc-900 text-zinc-500"
      }`}
    >
      {visible ? "In screener" : "Excluded"}
    </span>
  );
}

export function UniverseManager({
  companies,
  selectedSlug,
  onSelect,
  onChange
}: {
  companies: Company[];
  selectedSlug: string | null;
  onSelect: (slug: string) => void;
  onChange: (slug: string, patch: Partial<Company>) => void;
}) {
  return (
    <section className="min-w-0">
      <div className="hidden overflow-hidden rounded-lg border border-zincLine bg-zincPanel/80 lg:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse text-left text-xs">
            <thead className="bg-zinc-950 text-[10px] uppercase tracking-[0.14em] text-zinc-500">
              <tr>
                <th className="px-4 py-3">Company</th>
                <th className="px-3 py-3">Classification</th>
                <th className="px-3 py-3">Active</th>
                <th className="px-3 py-3">Hidden</th>
                <th className="px-3 py-3">Investor universes</th>
                <th className="px-3 py-3">Updated</th>
                <th className="px-4 py-3 text-right">Edit</th>
              </tr>
            </thead>
            <tbody>
              {companies.map((company) => (
                <tr
                  key={company.slug}
                  className={`border-t border-zincLine transition ${
                    selectedSlug === company.slug ? "bg-zinc-800/60" : "hover:bg-zinc-900/70"
                  }`}
                >
                  <td className="max-w-64 px-4 py-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <StatusBadge company={company} />
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-zinc-100">{company.company}</p>
                        <p className="mt-1 font-mono text-[11px] text-caution">
                          {company.ticker} · {company.exchange}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <p className="text-zinc-200">{company.commodity}</p>
                    <p className="mt-1 capitalize text-zinc-600">{company.status}</p>
                  </td>
                  <td className="px-3 py-3">
                    <Toggle
                      checked={company.active}
                      onChange={(active) => onChange(company.slug, { active })}
                      label={`Set ${company.company} active`}
                    />
                  </td>
                  <td className="px-3 py-3">
                    <Toggle
                      checked={company.hidden}
                      onChange={(hidden) => onChange(company.slug, { hidden })}
                      label={`Set ${company.company} hidden`}
                    />
                  </td>
                  <td className="max-w-72 px-3 py-3">
                    <div className="flex flex-wrap gap-1">
                      {company.investorUniverses.slice(0, 3).map((universe) => (
                        <span key={universe} className="rounded border border-zincLine px-2 py-1 text-[10px] text-zinc-400">
                          {universe}
                        </span>
                      ))}
                      {company.investorUniverses.length > 3 ? (
                        <span className="px-1 py-1 text-[10px] text-zinc-600">
                          +{company.investorUniverses.length - 3}
                        </span>
                      ) : null}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 font-mono text-zinc-500">
                    {company.lastUpdated}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => onSelect(company.slug)}
                      className="rounded border border-zincLine px-3 py-2 text-[10px] font-semibold uppercase tracking-wide text-zinc-300 transition hover:border-terminalGreen/50 hover:text-terminalGreen"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-3 lg:hidden">
        {companies.map((company) => (
          <article
            key={company.slug}
            className={`min-w-0 overflow-hidden rounded-lg border p-4 ${
              selectedSlug === company.slug
                ? "border-zinc-500 bg-zinc-800/70"
                : "border-zincLine bg-zincPanel/80"
            }`}
          >
            <div className="flex min-w-0 items-start justify-between gap-3">
              <div className="min-w-0">
                <StatusBadge company={company} />
                <h3 className="mt-3 truncate text-base font-semibold text-zinc-50">{company.company}</h3>
                <p className="mt-1 font-mono text-xs text-caution">
                  {company.ticker} · {company.exchange}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onSelect(company.slug)}
                className="shrink-0 rounded border border-zincLine px-3 py-2 text-[10px] font-semibold uppercase text-zinc-300"
              >
                Edit
              </button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="rounded border border-zincLine bg-zinc-950 p-3">
                <p className="text-[10px] uppercase text-zinc-600">Commodity</p>
                <p className="mt-1 text-sm text-zinc-200">{company.commodity}</p>
              </div>
              <div className="rounded border border-zincLine bg-zinc-950 p-3">
                <p className="text-[10px] uppercase text-zinc-600">Status</p>
                <p className="mt-1 text-sm capitalize text-zinc-200">{company.status}</p>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-5 border-t border-zincLine pt-3">
              <label className="flex items-center gap-2 text-xs text-zinc-400">
                <Toggle
                  checked={company.active}
                  onChange={(active) => onChange(company.slug, { active })}
                  label={`Set ${company.company} active`}
                />
                Active
              </label>
              <label className="flex items-center gap-2 text-xs text-zinc-400">
                <Toggle
                  checked={company.hidden}
                  onChange={(hidden) => onChange(company.slug, { hidden })}
                  label={`Set ${company.company} hidden`}
                />
                Hidden
              </label>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
