"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CompanyEditor } from "@/components/admin/CompanyEditor";
import { UniverseManager } from "@/components/admin/UniverseManager";
import { searchUniverse, updateCompanyRecord } from "@/lib/universe";
import type { Company } from "@/types/company";

const localStorageKey = "mining-intelligence-admin-universe-v1";

export function AdminDashboard({ initialCompanies }: { initialCompanies: Company[] }) {
  const [companies, setCompanies] = useState(initialCompanies);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(initialCompanies[0]?.slug ?? null);
  const [search, setSearch] = useState("");
  const [visibility, setVisibility] = useState<"all" | "visible" | "excluded">("all");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(localStorageKey);
    if (saved) {
      try {
        setCompanies(JSON.parse(saved) as Company[]);
      } catch {
        window.localStorage.removeItem(localStorageKey);
      }
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      window.localStorage.setItem(localStorageKey, JSON.stringify(companies));
    }
  }, [companies, loaded]);

  const filteredCompanies = useMemo(() => {
    const searched = searchUniverse(companies, search);
    if (visibility === "visible") return searched.filter((company) => company.active && !company.hidden);
    if (visibility === "excluded") return searched.filter((company) => !company.active || company.hidden);
    return searched;
  }, [companies, search, visibility]);

  const selectedCompany = companies.find((company) => company.slug === selectedSlug) ?? null;
  const visibleCount = companies.filter((company) => company.active && !company.hidden).length;
  const hiddenCount = companies.filter((company) => company.hidden).length;
  const inactiveCount = companies.filter((company) => !company.active).length;

  function handleChange(slug: string, patch: Partial<Company>) {
    setCompanies((current) => updateCompanyRecord(current, slug, patch));
  }

  function handleSelect(slug: string) {
    setSelectedSlug(slug);
    window.requestAnimationFrame(() => {
      if (window.innerWidth < 1280) {
        document.getElementById("company-editor")?.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    });
  }

  function exportJson() {
    const blob = new Blob([`${JSON.stringify(companies, null, 2)}\n`], {
      type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "companies.json";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  function resetDraft() {
    window.localStorage.removeItem(localStorageKey);
    setCompanies(initialCompanies);
    setSelectedSlug(initialCompanies[0]?.slug ?? null);
  }

  return (
    <main className="min-h-screen w-full max-w-full overflow-x-hidden bg-zinc-950 text-zinc-100">
      <div className="mx-auto flex w-full max-w-[1680px] flex-col gap-4 px-3 py-4 sm:px-5 lg:px-6">
        <header className="border-b border-zincLine pb-4">
          <div className="flex min-w-0 flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <Link href="/" className="text-xs font-semibold uppercase tracking-wide text-zinc-500 hover:text-zinc-200">
                  Screener
                </Link>
                <span className="text-zinc-700">/</span>
                <span className="text-xs font-semibold uppercase tracking-wide text-terminalGreen">Admin</span>
              </div>
              <h1 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-50 sm:text-3xl">
                Company Universe Manager
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-500">
                Control screener membership, classifications and research metadata. V1 saves drafts in this browser; export JSON to publish changes.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={resetDraft}
                className="rounded border border-zincLine px-3 py-2 text-xs font-semibold uppercase tracking-wide text-zinc-400 hover:border-zinc-600 hover:text-zinc-100"
              >
                Reset draft
              </button>
              <button
                type="button"
                onClick={exportJson}
                className="rounded border border-terminalGreen/50 bg-terminalGreen/10 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-terminalGreen hover:bg-terminalGreen/15"
              >
                Export JSON
              </button>
            </div>
          </div>
        </header>

        <section className="grid grid-cols-2 gap-2 text-xs md:grid-cols-4">
          {[
            ["Universe", companies.length],
            ["In screener", visibleCount],
            ["Inactive", inactiveCount],
            ["Hidden", hiddenCount]
          ].map(([label, value]) => (
            <div key={label} className="min-w-0 rounded border border-zincLine bg-zincPanel px-3 py-3">
              <p className="truncate text-zinc-600">{label}</p>
              <p className="mt-1 font-mono text-xl text-zinc-50">{value}</p>
            </div>
          ))}
        </section>

        <section className="sticky top-0 z-30 rounded-lg border border-zincLine bg-zincPanel/95 p-3 shadow-glow backdrop-blur lg:static lg:shadow-none">
          <div className="grid min-w-0 grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_220px]">
            <label className="min-w-0">
              <span className="sr-only">Search companies</span>
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search company, ticker, commodity, tag or investor universe"
                className="h-10 w-full rounded border border-zincLine bg-zinc-950 px-3 text-sm text-zinc-100 outline-none placeholder:text-zinc-700 focus:border-terminalGreen/60"
              />
            </label>
            <label className="min-w-0">
              <span className="sr-only">Visibility filter</span>
              <select
                value={visibility}
                onChange={(event) => setVisibility(event.target.value as typeof visibility)}
                className="h-10 w-full rounded border border-zincLine bg-zinc-950 px-3 text-sm text-zinc-100 outline-none focus:border-terminalGreen/60"
              >
                <option value="all">All companies</option>
                <option value="visible">In screener</option>
                <option value="excluded">Excluded</option>
              </select>
            </label>
          </div>
        </section>

        <div className="grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_380px] xl:items-start">
          <div className="order-2 min-w-0 xl:order-1">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-zinc-100">Universe</h2>
                <p className="mt-1 text-xs text-zinc-600">
                  Public rule: active must be on and hidden must be off.
                </p>
              </div>
              <span className="shrink-0 border border-zincLine px-3 py-1 font-mono text-xs text-zinc-500">
                {filteredCompanies.length} rows
              </span>
            </div>
            <UniverseManager
              companies={filteredCompanies}
              selectedSlug={selectedSlug}
              onSelect={handleSelect}
              onChange={handleChange}
            />
          </div>
          <div id="company-editor" className="order-1 min-w-0 scroll-mt-24 xl:order-2 xl:sticky xl:top-4">
            <CompanyEditor
              company={selectedCompany}
              onChange={(patch) => {
                if (selectedCompany) handleChange(selectedCompany.slug, patch);
              }}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
