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
    <main className="min-h-screen w-full max-w-full overflow-x-hidden bg-zinc-950 text-zinc-100">
      <div className="mx-auto flex w-full max-w-[1540px] flex-col gap-5 overflow-hidden px-3 py-3 sm:px-5 lg:px-6">
        <AppNavigation />
        <header className="border-b border-zincLine pb-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-caution">
            Serious inputs. Memorable outputs.
          </p>
          <h1 className="mt-3 max-w-4xl text-3xl font-semibold tracking-tight text-zinc-50 sm:text-5xl">
            Absurd But True Mining Metrics
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-zinc-400 sm:text-base">
            A playful analytics layer for takeover appeal, financing runway, infrastructure, investability, promotion risk and project complexity. Missing evidence lowers confidence instead of creating fake precision.
          </p>
        </header>
        <AbsurdMetricsExplorer companies={companies} />
      </div>
    </main>
  );
}
