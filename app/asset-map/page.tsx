import type { Metadata } from "next";
import { AppNavigation } from "@/components/AppNavigation";
import { AssetMapClient } from "@/components/AssetMapClient";

export const metadata: Metadata = {
  title: "Asset Map | Mining Intelligence",
  description: "Interactive world map of mining companies, assets, catalysts, risk, and investor-framework scores."
};

export default function AssetMapPage() {
  return (
    <main className="min-h-screen w-full max-w-full overflow-x-hidden bg-zinc-950 text-zinc-100">
      <div className="mx-auto flex w-full max-w-[1540px] flex-col gap-4 overflow-hidden px-3 py-3 sm:px-5 lg:px-6">
        <AppNavigation />
        <header className="flex min-w-0 flex-col gap-3 border-b border-zincLine pb-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-terminalGreen">Global asset intelligence</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-50 sm:text-3xl">Mining Asset Map</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-400">
              Explore operating mines, development projects, and exploration optionality through each investor framework.
            </p>
          </div>
          <div className="grid w-full min-w-0 grid-cols-3 gap-px overflow-hidden rounded border border-zincLine bg-zincLine text-xs lg:max-w-[430px]">
            <div className="min-w-0 bg-zincPanel px-3 py-2">
              <p className="truncate text-zinc-500">Coverage</p>
              <p className="mt-1 font-mono text-zinc-50">Global</p>
            </div>
            <div className="min-w-0 bg-zincPanel px-3 py-2">
              <p className="truncate text-zinc-500">Layer</p>
              <p className="mt-1 font-mono text-zinc-50">Assets</p>
            </div>
            <div className="min-w-0 bg-zincPanel px-3 py-2">
              <p className="truncate text-zinc-500">Status</p>
              <p className="mt-1 font-mono text-terminalGreen">Sourced</p>
            </div>
          </div>
        </header>

        <AssetMapClient />
      </div>
    </main>
  );
}
