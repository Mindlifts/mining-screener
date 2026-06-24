import type { Metadata } from "next";
import { AppNavigation } from "@/components/AppNavigation";
import { AbsurdMetricsExplorer } from "@/components/absurd/AbsurdMetricsExplorer";
import { companies } from "@/data/screener-data";

export const metadata: Metadata = {
  title: "Absurd But True Mining Metrics | Mining Intelligence",
  description: "Memorable, evidence-aware mining metrics for valuation, financing, infrastructure, promotion and execution risk."
};

export default function AbsurdMetricsPage() {
  return (
    <main className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#050b10] bg-[repeating-linear-gradient(0deg,rgba(78,126,137,0.025)_0,rgba(78,126,137,0.025)_1px,transparent_1px,transparent_4px)] text-zinc-100">
      <div className="mx-auto flex w-full max-w-[1780px] flex-col gap-2 overflow-hidden px-2 py-2 sm:px-3 lg:px-4">
        <AppNavigation />
        <header className="border-b border-[#20313a] bg-[#071016] px-3 py-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#45c7c4]">
            Mining intelligence special situations desk
          </p>
          <h1 className="mt-2 max-w-5xl text-3xl font-semibold uppercase tracking-tight text-zinc-50 sm:text-4xl">
            Absurdly Brilliant Metrics
          </h1>
          <p className="mt-1 text-sm font-medium uppercase tracking-wide text-caution">
            That find reasons to invest in mining companies
          </p>
          <p className="mt-3 max-w-3xl text-xs leading-5 text-zinc-500">
            Ten unconventional but evidence-aware metrics that cut through valuation noise, financing risk, infrastructure, promotion and project complexity.
          </p>
        </header>
        <AbsurdMetricsExplorer companies={companies} />
      </div>
    </main>
  );
}
