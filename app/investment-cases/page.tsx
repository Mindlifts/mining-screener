import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AppNavigation } from "@/components/AppNavigation";
import { investmentCases } from "@/data/investment-cases";

export const metadata: Metadata = {
  title: "Investment Cases | Mining Intelligence",
  description: "Source-mapped mining investment cases built from official company presentations."
};

export default function InvestmentCasesPage() {
  return (
    <main className="min-h-screen w-full max-w-full overflow-x-hidden bg-zinc-950 text-zinc-100">
      <div className="mx-auto w-full max-w-[1540px] px-3 py-3 sm:px-5 lg:px-6">
        <AppNavigation />

        <section className="border-b border-zincLine py-10 sm:py-14">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-terminalGreen">
            Source-mapped research
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-50 sm:text-5xl">
            Investment Cases
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-400">
            Visual company briefs built from official investor presentations, with page-level citations and clearly labelled calculations.
          </p>
        </section>

        <section className="grid min-w-0 grid-cols-1 gap-3 py-8 md:grid-cols-2 xl:grid-cols-3">
          {investmentCases.map((investmentCase) => (
            <Link
              key={investmentCase.slug}
              href={`/investment-cases/${investmentCase.slug}`}
              className="group flex min-h-72 min-w-0 flex-col overflow-hidden rounded-lg border border-zincLine bg-zincPanel/80 p-5 transition hover:border-zinc-500 hover:bg-zinc-900"
            >
              <div className="flex min-w-0 items-start justify-between gap-4">
                <div className="grid h-16 w-28 shrink-0 place-items-center overflow-hidden rounded border border-zincLine bg-zinc-950 p-2">
                  <Image
                    src={investmentCase.logo}
                    alt={`${investmentCase.company} logo`}
                    width={140}
                    height={80}
                    className="h-full w-full object-contain"
                  />
                </div>
                <div className="text-right">
                  <p className="font-mono text-3xl font-semibold text-terminalGreen">{investmentCase.score}</p>
                  <p className="text-[9px] uppercase tracking-wide text-zinc-600">Score / 100</p>
                </div>
              </div>

              <div className="mt-6 min-w-0">
                <p className="font-mono text-xs text-caution">{investmentCase.exchange}: {investmentCase.ticker}</p>
                <h2 className="mt-2 break-words text-xl font-semibold text-zinc-50">{investmentCase.company}</h2>
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-zinc-500">{investmentCase.thesis}</p>
              </div>

              <div className="mt-auto flex min-w-0 items-end justify-between gap-3 pt-6">
                <div className="flex min-w-0 flex-wrap gap-1">
                  {investmentCase.commodityExposure.slice(0, 3).map((commodity) => (
                    <span key={commodity} className="rounded border border-zincLine px-2 py-1 text-[9px] uppercase text-zinc-500">
                      {commodity}
                    </span>
                  ))}
                </div>
                <span className="shrink-0 text-xs font-semibold uppercase tracking-wide text-zinc-300 transition group-hover:text-zinc-50">
                  Open case
                </span>
              </div>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}
