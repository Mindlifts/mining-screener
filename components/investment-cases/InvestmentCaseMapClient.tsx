"use client";

import dynamic from "next/dynamic";
import type { InvestmentCaseAsset } from "@/data/investment-cases/types";

const InvestmentCaseMap = dynamic(
  () => import("@/components/investment-cases/InvestmentCaseMap").then((module) => module.InvestmentCaseMap),
  {
    ssr: false,
    loading: () => (
      <div className="grid min-h-[520px] place-items-center rounded-lg border border-zincLine bg-[#080a0e]">
        <p className="font-mono text-xs uppercase tracking-wide text-zinc-500">Loading operating footprint...</p>
      </div>
    )
  }
);

export function InvestmentCaseMapClient({ assets }: { assets: InvestmentCaseAsset[] }) {
  return <InvestmentCaseMap assets={assets} />;
}
