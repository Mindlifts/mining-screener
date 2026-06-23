"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup
} from "react-simple-maps";
import countries from "world-atlas/countries-110m.json";
import {
  assetInvestorModes,
  miningAssets,
  type AssetInvestorMode,
  type AssetProductionStage,
  type AssetRiskLevel,
  type MiningAsset
} from "@/data/assets";
import { MapTooltip, type MapTooltipPosition } from "@/components/MapTooltip";

const commodityColors: Record<MiningAsset["commodity"], string> = {
  Gold: "#f4c167",
  Silver: "#d5d9e2",
  Copper: "#e58a55",
  Uranium: "#9de58b",
  Coal: "#8d96a8",
  "Rare Earths": "#bb9cf2",
  "Oil & Gas": "#63b3ed"
};

const stages: Array<AssetProductionStage | "All"> = ["All", "Producer", "Developer", "Explorer"];
const riskLevels: Array<AssetRiskLevel | "All"> = ["All", "Low", "Medium", "High"];
const moneyFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1
});

function formatMarketCap(value: number) {
  return `$${moneyFormatter.format(value * 1_000_000)}`;
}

function markerRadius(asset: MiningAsset, score: number) {
  const marketCapScale = Math.log10(Math.max(asset.marketCap, 40)) - 1.4;
  return Math.max(4.5, Math.min(11, 3.5 + marketCapScale + score / 35));
}

function riskClass(risk: AssetRiskLevel) {
  if (risk === "Low") return "border-terminalGreen/40 bg-terminalGreen/10 text-terminalGreen";
  if (risk === "Medium") return "border-caution/40 bg-caution/10 text-caution";
  return "border-red-400/40 bg-red-400/10 text-red-300";
}

function AssetDetail({
  asset,
  mode,
  onClose,
  mobile = false
}: {
  asset: MiningAsset;
  mode: AssetInvestorMode;
  onClose: () => void;
  mobile?: boolean;
}) {
  const score = asset.investorModeScore[mode];

  return (
    <article className={`min-w-0 overflow-hidden bg-zincPanel ${mobile ? "rounded-t-xl border-t border-zinc-600" : "h-full border-l border-zincLine"}`}>
      <div className="flex min-w-0 items-start justify-between gap-4 border-b border-zincLine p-4">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">Selected asset</p>
          <h2 className="mt-2 truncate text-lg font-semibold text-zinc-50">{asset.assetName}</h2>
          <p className="mt-1 truncate text-sm text-zinc-400">{asset.company} · <span className="font-mono text-caution">{asset.ticker}</span></p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close asset details"
          className="grid h-8 w-8 shrink-0 place-items-center rounded border border-zincLine text-lg text-zinc-400 transition hover:border-zinc-500 hover:text-zinc-50"
        >
          ×
        </button>
      </div>

      <div className="grid min-w-0 grid-cols-2 gap-px bg-zincLine">
        <div className="min-w-0 bg-zincPanel p-3">
          <p className="text-[10px] uppercase tracking-wide text-zinc-500">{mode}</p>
          <p className="mt-1 font-mono text-2xl text-terminalGreen">{score}</p>
        </div>
        <div className="min-w-0 bg-zincPanel p-3">
          <p className="text-[10px] uppercase tracking-wide text-zinc-500">Market cap</p>
          <p className="mt-1 truncate font-mono text-lg text-zinc-50">{formatMarketCap(asset.marketCap)}</p>
        </div>
      </div>

      <dl className="space-y-3 p-4 text-sm">
        <div className="flex min-w-0 items-center justify-between gap-3">
          <dt className="text-zinc-500">Commodity</dt>
          <dd className="flex min-w-0 items-center gap-2 text-zinc-100">
            <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: commodityColors[asset.commodity] }} />
            <span className="truncate">{asset.commodity}</span>
          </dd>
        </div>
        <div className="flex min-w-0 items-center justify-between gap-3">
          <dt className="text-zinc-500">Stage</dt>
          <dd className="truncate text-zinc-100">{asset.productionStage}</dd>
        </div>
        <div className="flex min-w-0 items-center justify-between gap-3">
          <dt className="text-zinc-500">Country</dt>
          <dd className="truncate text-zinc-100">{asset.country}</dd>
        </div>
        <div className="flex min-w-0 items-center justify-between gap-3">
          <dt className="text-zinc-500">Jurisdiction</dt>
          <dd className="truncate text-zinc-100">{asset.jurisdiction}</dd>
        </div>
        <div className="flex min-w-0 items-center justify-between gap-3">
          <dt className="text-zinc-500">Risk</dt>
          <dd className={`rounded border px-2 py-0.5 text-[11px] font-semibold uppercase ${riskClass(asset.riskLevel)}`}>
            {asset.riskLevel}
          </dd>
        </div>
      </dl>

      <div className="border-t border-zincLine p-4">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-500">Key catalyst</p>
        <p className="mt-2 text-sm leading-6 text-zinc-200">{asset.keyCatalyst}</p>
      </div>

      {asset.companySlug ? (
        <div className="border-t border-zincLine p-4">
          <Link
            href={`/companies/${asset.companySlug}`}
            className="block w-full rounded border border-terminalGreen/50 bg-terminalGreen/10 px-3 py-2 text-center text-xs font-semibold uppercase tracking-wide text-terminalGreen transition hover:bg-terminalGreen/15"
          >
            Open company research
          </Link>
        </div>
      ) : null}
    </article>
  );
}

function RankingList({
  title,
  subtitle,
  assets,
  mode,
  onSelect
}: {
  title: string;
  subtitle: string;
  assets: MiningAsset[];
  mode: AssetInvestorMode;
  onSelect: (asset: MiningAsset) => void;
}) {
  return (
    <section className="w-full max-w-full overflow-hidden rounded-lg border border-zincLine bg-zincPanel/85">
      <div className="border-b border-zincLine p-4">
        <h2 className="text-sm font-semibold text-zinc-50">{title}</h2>
        <p className="mt-1 text-xs text-zinc-500">{subtitle}</p>
      </div>
      <div className="divide-y divide-zincLine">
        {assets.length > 0 ? (
          assets.map((asset, index) => (
            <button
              key={asset.id}
              type="button"
              onClick={() => onSelect(asset)}
              className="flex w-full min-w-0 items-center gap-3 px-4 py-3 text-left transition hover:bg-zinc-900"
            >
              <span className="w-5 shrink-0 font-mono text-xs text-zinc-600">{String(index + 1).padStart(2, "0")}</span>
              <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: commodityColors[asset.commodity] }} />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-zinc-100">{asset.assetName}</span>
                <span className="mt-0.5 block truncate text-[11px] text-zinc-500">{asset.ticker} · {asset.country}</span>
              </span>
              <span className="shrink-0 font-mono text-sm text-terminalGreen">{asset.investorModeScore[mode]}</span>
            </button>
          ))
        ) : (
          <p className="px-4 py-6 text-center text-xs text-zinc-500">No assets match the active filters.</p>
        )}
      </div>
    </section>
  );
}

export function AssetMap() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [commodity, setCommodity] = useState<MiningAsset["commodity"] | "All">("All");
  const [mode, setMode] = useState<AssetInvestorMode>("Rick Rule");
  const [stage, setStage] = useState<AssetProductionStage | "All">("All");
  const [risk, setRisk] = useState<AssetRiskLevel | "All">("All");
  const [selectedAsset, setSelectedAsset] = useState<MiningAsset | null>(null);
  const [hoveredAsset, setHoveredAsset] = useState<MiningAsset | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<MapTooltipPosition>({ x: 0, y: 0 });
  const [mapPosition, setMapPosition] = useState<{ coordinates: [number, number]; zoom: number }>({
    coordinates: [8, 12],
    zoom: 1
  });

  const commodities = useMemo(
    () => Array.from(new Set(miningAssets.map((asset) => asset.commodity))).sort(),
    []
  );

  const filteredAssets = useMemo(
    () => miningAssets
      .filter((asset) => commodity === "All" || asset.commodity === commodity)
      .filter((asset) => stage === "All" || asset.productionStage === stage)
      .filter((asset) => risk === "All" || asset.riskLevel === risk),
    [commodity, risk, stage]
  );

  const highestScoreAssets = useMemo(
    () => filteredAssets
      .slice()
      .sort((left, right) => right.investorModeScore[mode] - left.investorModeScore[mode])
      .slice(0, 5),
    [filteredAssets, mode]
  );

  const highRiskRewardAssets = useMemo(
    () => filteredAssets
      .filter((asset) => asset.riskLevel === "High" || asset.riskLevel === "Medium")
      .slice()
      .sort((left, right) => right.investorModeScore[mode] - left.investorModeScore[mode])
      .slice(0, 5),
    [filteredAssets, mode]
  );

  const topJurisdictions = useMemo(() => {
    const jurisdictions = new Map<string, { count: number; score: number; risk: AssetRiskLevel }>();

    filteredAssets.forEach((asset) => {
      const current = jurisdictions.get(asset.country) ?? { count: 0, score: 0, risk: asset.riskLevel };
      jurisdictions.set(asset.country, {
        count: current.count + 1,
        score: current.score + asset.investorModeScore[mode],
        risk: current.risk === "High" || asset.riskLevel === "High"
          ? "High"
          : current.risk === "Medium" || asset.riskLevel === "Medium"
            ? "Medium"
            : "Low"
      });
    });

    return Array.from(jurisdictions.entries())
      .map(([country, value]) => ({
        country,
        count: value.count,
        averageScore: Math.round(value.score / value.count),
        risk: value.risk
      }))
      .sort((left, right) => right.averageScore - left.averageScore)
      .slice(0, 6);
  }, [filteredAssets, mode]);

  function updateTooltip(event: React.MouseEvent<SVGPathElement>, asset: MiningAsset) {
    const bounds = mapContainerRef.current?.getBoundingClientRect();
    if (!bounds) return;

    setTooltipPosition({
      x: Math.max(8, Math.min(event.clientX - bounds.left, bounds.width - 310)),
      y: Math.max(54, Math.min(event.clientY - bounds.top, bounds.height - 90))
    });
    setHoveredAsset(asset);
  }

  function selectAsset(asset: MiningAsset) {
    setSelectedAsset(asset);
    setMapPosition({
      coordinates: [asset.longitude, asset.latitude],
      zoom: Math.max(mapPosition.zoom, 1.8)
    });
  }

  function changeZoom(delta: number) {
    setMapPosition((current) => ({
      ...current,
      zoom: Math.max(1, Math.min(5, current.zoom + delta))
    }));
  }

  return (
    <>
      <section className="sticky top-0 z-40 w-full max-w-full overflow-hidden rounded-lg border border-zincLine bg-zincPanel/95 p-3 shadow-glow backdrop-blur md:static md:shadow-none">
        <div className="grid min-w-0 grid-cols-2 gap-3 lg:grid-cols-4">
          <label className="min-w-0">
            <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-zinc-500">Commodity</span>
            <select
              value={commodity}
              onChange={(event) => setCommodity(event.target.value as MiningAsset["commodity"] | "All")}
              className="h-10 w-full rounded border border-zincLine bg-zinc-950 px-2 text-sm text-zinc-100 outline-none transition focus:ring-2 focus:ring-terminalGreen/40 sm:px-3"
            >
              <option>All</option>
              {commodities.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <label className="min-w-0">
            <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-zinc-500">Investor mode</span>
            <select
              value={mode}
              onChange={(event) => setMode(event.target.value as AssetInvestorMode)}
              className="h-10 w-full rounded border border-zincLine bg-zinc-950 px-2 text-sm text-zinc-100 outline-none transition focus:ring-2 focus:ring-terminalGreen/40 sm:px-3"
            >
              {assetInvestorModes.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <label className="min-w-0">
            <span className="mb-1 block truncate text-[10px] font-semibold uppercase tracking-wide text-zinc-500">Production stage</span>
            <select
              value={stage}
              onChange={(event) => setStage(event.target.value as AssetProductionStage | "All")}
              className="h-10 w-full rounded border border-zincLine bg-zinc-950 px-2 text-sm text-zinc-100 outline-none transition focus:ring-2 focus:ring-terminalGreen/40 sm:px-3"
            >
              {stages.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <label className="min-w-0">
            <span className="mb-1 block truncate text-[10px] font-semibold uppercase tracking-wide text-zinc-500">Jurisdiction risk</span>
            <select
              value={risk}
              onChange={(event) => setRisk(event.target.value as AssetRiskLevel | "All")}
              className="h-10 w-full rounded border border-zincLine bg-zinc-950 px-2 text-sm text-zinc-100 outline-none transition focus:ring-2 focus:ring-terminalGreen/40 sm:px-3"
            >
              {riskLevels.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
        </div>
      </section>

      <section className="grid min-w-0 grid-cols-1 overflow-hidden rounded-lg border border-zincLine bg-[#080a0e] xl:grid-cols-[minmax(0,1fr)_340px]">
        <div ref={mapContainerRef} className="relative min-w-0 overflow-hidden">
          <div className="absolute left-3 top-3 z-20 flex min-w-0 flex-wrap gap-1.5">
            <span className="rounded border border-zincLine bg-zinc-950/90 px-2 py-1 font-mono text-[10px] text-zinc-400 backdrop-blur">
              {filteredAssets.length} ASSETS
            </span>
            <span className="rounded border border-zincLine bg-zinc-950/90 px-2 py-1 font-mono text-[10px] text-zinc-400 backdrop-blur">
              SIZE = MKT CAP + SCORE
            </span>
          </div>

          <div className="absolute right-3 top-3 z-20 flex flex-col gap-1">
            <button
              type="button"
              onClick={() => changeZoom(0.5)}
              aria-label="Zoom in"
              className="grid h-8 w-8 place-items-center rounded border border-zincLine bg-zinc-950/90 font-mono text-lg text-zinc-300 transition hover:border-zinc-500 hover:text-zinc-50"
            >
              +
            </button>
            <button
              type="button"
              onClick={() => changeZoom(-0.5)}
              aria-label="Zoom out"
              className="grid h-8 w-8 place-items-center rounded border border-zincLine bg-zinc-950/90 font-mono text-lg text-zinc-300 transition hover:border-zinc-500 hover:text-zinc-50"
            >
              −
            </button>
            <button
              type="button"
              onClick={() => setMapPosition({ coordinates: [8, 12], zoom: 1 })}
              className="h-8 rounded border border-zincLine bg-zinc-950/90 px-2 font-mono text-[9px] text-zinc-400 transition hover:border-zinc-500 hover:text-zinc-50"
            >
              RESET
            </button>
          </div>

          <ComposableMap
            projection="geoEqualEarth"
            projectionConfig={{ scale: 158, center: [0, 3] }}
            width={1000}
            height={520}
            className="block h-auto min-h-[340px] w-full max-w-full touch-pan-y bg-[radial-gradient(circle_at_50%_45%,rgba(35,45,58,0.55),rgba(8,10,14,0)_62%)] sm:min-h-0"
            aria-label="Interactive world map of mining assets"
          >
            <defs>
              <filter id="asset-glow" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <pattern id="map-grid" width="24" height="24" patternUnits="userSpaceOnUse">
                <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#1a1e26" strokeWidth="0.6" />
              </pattern>
            </defs>
            <rect width="1000" height="520" fill="url(#map-grid)" opacity="0.42" />
            <ZoomableGroup
              center={mapPosition.coordinates}
              zoom={mapPosition.zoom}
              minZoom={1}
              maxZoom={5}
              onMoveEnd={(position) => setMapPosition(position)}
            >
              <Geographies geography={countries}>
                {({ geographies }) => geographies.map((geography) => (
                  <Geography
                    key={geography.rsmKey}
                    geography={geography}
                    fill="#151922"
                    stroke="#303643"
                    strokeWidth={0.55}
                    style={{
                      default: { outline: "none" },
                      hover: { fill: "#1b202a", outline: "none" },
                      pressed: { fill: "#1b202a", outline: "none" }
                    }}
                  />
                ))}
              </Geographies>

              {filteredAssets.map((asset) => {
                const score = asset.investorModeScore[mode];
                const radius = markerRadius(asset, score);
                const color = commodityColors[asset.commodity];
                const active = selectedAsset?.id === asset.id;

                return (
                  <Marker
                    key={asset.id}
                    coordinates={[asset.longitude, asset.latitude]}
                    onMouseEnter={(event) => updateTooltip(event, asset)}
                    onMouseMove={(event) => updateTooltip(event, asset)}
                    onMouseLeave={() => setHoveredAsset(null)}
                    onClick={() => selectAsset(asset)}
                    role="button"
                    tabIndex={0}
                    aria-label={`${asset.company}, ${asset.assetName}, ${score} score`}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") selectAsset(asset);
                    }}
                    className="cursor-pointer outline-none"
                  >
                    <circle
                      r={radius + 5}
                      fill={color}
                      opacity={active ? 0.28 : 0.12}
                      className="asset-marker-pulse"
                    />
                    <circle
                      r={radius}
                      fill={color}
                      fillOpacity={active ? 1 : 0.88}
                      stroke={active ? "#ffffff" : color}
                      strokeWidth={active ? 2 : 0.8}
                      filter="url(#asset-glow)"
                      className="transition-all duration-200"
                    />
                    <circle r={Math.max(1.5, radius * 0.28)} fill="#ffffff" opacity="0.86" />
                  </Marker>
                );
              })}
            </ZoomableGroup>
          </ComposableMap>

          <div className="absolute bottom-3 left-3 z-20 hidden max-w-[calc(100%-24px)] flex-wrap gap-x-3 gap-y-1 rounded border border-zincLine bg-zinc-950/90 px-3 py-2 backdrop-blur sm:flex">
            {Object.entries(commodityColors).map(([name, color]) => (
              <span key={name} className="flex items-center gap-1.5 text-[10px] text-zinc-400">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
                {name}
              </span>
            ))}
          </div>

          <MapTooltip
            asset={hoveredAsset}
            score={hoveredAsset ? hoveredAsset.investorModeScore[mode] : 0}
            position={tooltipPosition}
          />

          {filteredAssets.length === 0 ? (
            <div className="absolute inset-0 z-20 grid place-items-center bg-[#080a0e]/75 p-6 backdrop-blur-sm">
              <div className="max-w-xs text-center">
                <p className="text-sm font-semibold text-zinc-100">No assets match this screen.</p>
                <button
                  type="button"
                  onClick={() => {
                    setCommodity("All");
                    setStage("All");
                    setRisk("All");
                  }}
                  className="mt-3 rounded border border-terminalGreen/50 bg-terminalGreen/10 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-terminalGreen"
                >
                  Clear filters
                </button>
              </div>
            </div>
          ) : null}
        </div>

        <div className="hidden min-w-0 xl:block">
          {selectedAsset ? (
            <AssetDetail asset={selectedAsset} mode={mode} onClose={() => setSelectedAsset(null)} />
          ) : (
            <div className="flex h-full min-h-[520px] flex-col justify-between border-l border-zincLine bg-zincPanel p-5">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-terminalGreen">Asset intelligence</p>
                <h2 className="mt-3 text-xl font-semibold text-zinc-50">Select a mine to open its field brief.</h2>
                <p className="mt-3 text-sm leading-6 text-zinc-400">
                  Marker size blends company market capitalization with the active investor framework score.
                </p>
              </div>
              <div className="space-y-3 border-t border-zincLine pt-4 text-xs text-zinc-500">
                <p>Drag to pan · Scroll to zoom</p>
                <p>Hover for a quick brief · Click for details</p>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-3">
        <section className="w-full max-w-full overflow-hidden rounded-lg border border-zincLine bg-zincPanel/85">
          <div className="border-b border-zincLine p-4">
            <h2 className="text-sm font-semibold text-zinc-50">Top jurisdictions</h2>
            <p className="mt-1 text-xs text-zinc-500">Average {mode} score across visible assets.</p>
          </div>
          <div className="divide-y divide-zincLine">
            {topJurisdictions.length > 0 ? (
              topJurisdictions.map((jurisdiction, index) => (
                <div key={jurisdiction.country} className="flex min-w-0 items-center gap-3 px-4 py-3">
                  <span className="w-5 shrink-0 font-mono text-xs text-zinc-600">{String(index + 1).padStart(2, "0")}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-zinc-100">{jurisdiction.country}</span>
                    <span className="mt-0.5 block text-[11px] text-zinc-500">
                      {jurisdiction.count} visible {jurisdiction.count === 1 ? "asset" : "assets"}
                    </span>
                  </span>
                  <span className={`shrink-0 rounded border px-1.5 py-0.5 text-[10px] uppercase ${riskClass(jurisdiction.risk)}`}>
                    {jurisdiction.risk}
                  </span>
                  <span className="w-7 shrink-0 text-right font-mono text-sm text-terminalGreen">{jurisdiction.averageScore}</span>
                </div>
              ))
            ) : (
              <p className="px-4 py-6 text-center text-xs text-zinc-500">No jurisdiction data for this screen.</p>
            )}
          </div>
        </section>

        <RankingList
          title="Highest score assets"
          subtitle={`Leaders through the ${mode} framework.`}
          assets={highestScoreAssets}
          mode={mode}
          onSelect={selectAsset}
        />
        <RankingList
          title="High-risk / high-reward"
          subtitle="Elevated jurisdiction risk with asymmetric scores."
          assets={highRiskRewardAssets}
          mode={mode}
          onSelect={selectAsset}
        />
      </section>

      {selectedAsset ? (
        <div className="fixed inset-0 z-50 flex items-end bg-black/55 backdrop-blur-sm xl:hidden" onClick={() => setSelectedAsset(null)}>
          <div className="max-h-[82vh] w-full overflow-y-auto" onClick={(event) => event.stopPropagation()}>
            <AssetDetail asset={selectedAsset} mode={mode} onClose={() => setSelectedAsset(null)} mobile />
          </div>
        </div>
      ) : null}
    </>
  );
}
