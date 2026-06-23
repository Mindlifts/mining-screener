import type { MiningAsset } from "@/data/assets";

export type MapTooltipPosition = {
  x: number;
  y: number;
};

export function MapTooltip({
  asset,
  score,
  position
}: {
  asset: MiningAsset | null;
  score: number;
  position: MapTooltipPosition;
}) {
  if (!asset) return null;

  return (
    <div
      className="pointer-events-none absolute z-30 hidden w-72 max-w-[calc(100%-24px)] rounded border border-zinc-600 bg-[#090b10]/95 p-3 text-xs shadow-2xl backdrop-blur md:block"
      style={{
        left: position.x + 14,
        top: Math.max(12, position.y - 56)
      }}
    >
      <div className="flex min-w-0 items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-semibold text-zinc-50">{asset.company}</p>
          <p className="mt-0.5 font-mono text-[11px] text-caution">{asset.ticker}</p>
        </div>
        <span className="shrink-0 rounded border border-zincLine px-1.5 py-0.5 text-[10px] uppercase text-zinc-400">
          {asset.commodity}
        </span>
      </div>
      <dl className="mt-3 grid grid-cols-[88px_minmax(0,1fr)] gap-x-2 gap-y-1.5 text-zinc-400">
        <dt>Asset</dt><dd className="truncate text-zinc-100">{asset.assetName}</dd>
        <dt>Country</dt><dd className="truncate text-zinc-100">{asset.country}</dd>
        <dt>Investor score</dt><dd className="font-mono text-terminalGreen">{score}/100</dd>
        <dt>Risk</dt><dd className="text-zinc-100">{asset.riskLevel}</dd>
        <dt>Catalyst</dt><dd className="line-clamp-2 text-zinc-100">{asset.keyCatalyst}</dd>
      </dl>
    </div>
  );
}
