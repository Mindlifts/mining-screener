"use client";

import dynamic from "next/dynamic";

const AssetMap = dynamic(
  () => import("@/components/AssetMap").then((module) => module.AssetMap),
  {
    ssr: false,
    loading: () => (
      <div className="grid min-h-[520px] w-full place-items-center rounded-lg border border-zincLine bg-[#080a0e]">
        <p className="font-mono text-xs uppercase tracking-wide text-zinc-500">Loading asset intelligence...</p>
      </div>
    )
  }
);

export function AssetMapClient() {
  return <AssetMap />;
}
