"use client";

import { useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup
} from "react-simple-maps";
import countries from "world-atlas/countries-110m.json";
import type { InvestmentCaseAsset } from "@/data/investment-cases/types";

export function InvestmentCaseMap({ assets }: { assets: InvestmentCaseAsset[] }) {
  const [selected, setSelected] = useState<InvestmentCaseAsset>(assets[0]);
  const latitudeRange = Math.max(...assets.map((asset) => asset.latitude)) - Math.min(...assets.map((asset) => asset.latitude));
  const broadPortfolio = latitudeRange > 30;
  const mapCenter: [number, number] = broadPortfolio ? [-78, 1] : [-108, 31];
  const mapScale = broadPortfolio ? 210 : 520;

  return (
    <div className="grid min-w-0 grid-cols-1 overflow-hidden rounded-lg border border-zincLine bg-[#080a0e] lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="relative min-h-[360px] min-w-0 overflow-hidden">
        <div className="absolute left-3 top-3 z-10 rounded border border-zincLine bg-zinc-950/90 px-2 py-1 font-mono text-[10px] text-zinc-400">
          {assets.length} OPERATING NODES
        </div>
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ center: mapCenter, scale: mapScale }}
          width={900}
          height={520}
          className="block h-full min-h-[360px] w-full max-w-full bg-[radial-gradient(circle_at_40%_45%,rgba(70,79,94,0.25),transparent_58%)]"
          aria-label="Investment case asset map"
        >
          <ZoomableGroup center={mapCenter} zoom={1} minZoom={1} maxZoom={4}>
            <Geographies geography={countries}>
              {({ geographies }) => geographies.map((geography) => (
                <Geography
                  key={geography.rsmKey}
                  geography={geography}
                  fill="#151922"
                  stroke="#303643"
                  strokeWidth={0.5}
                  style={{
                    default: { outline: "none" },
                    hover: { fill: "#1b202a", outline: "none" },
                    pressed: { fill: "#1b202a", outline: "none" }
                  }}
                />
              ))}
            </Geographies>
            {assets.map((asset) => {
              const active = selected.name === asset.name;
              const producing = asset.stage === "Producing";

              return (
                <Marker
                  key={asset.name}
                  coordinates={[asset.longitude, asset.latitude]}
                  role="button"
                  tabIndex={0}
                  aria-label={`${asset.name}, ${asset.country}, ${asset.stage}`}
                  onMouseEnter={() => setSelected(asset)}
                  onClick={() => setSelected(asset)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") setSelected(asset);
                  }}
                  className="cursor-pointer outline-none"
                >
                  <circle
                    r={active ? 17 : 13}
                    fill={producing ? "#d5d9e2" : "#f4c167"}
                    opacity={active ? 0.16 : 0.08}
                    className="asset-marker-pulse"
                  />
                  <circle
                    r={active ? 8 : 6}
                    fill={producing ? "#d5d9e2" : "#f4c167"}
                    stroke={active ? "#ffffff" : "#090b10"}
                    strokeWidth={active ? 2 : 1}
                  />
                  <circle r="2" fill="#ffffff" />
                </Marker>
              );
            })}
          </ZoomableGroup>
        </ComposableMap>
      </div>

      <aside className="min-w-0 border-t border-zincLine bg-zincPanel p-5 lg:border-l lg:border-t-0">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-caution">{selected.stage}</p>
        <h3 className="mt-3 text-2xl font-semibold text-zinc-50">{selected.name}</h3>
        <p className="mt-1 text-sm text-zinc-500">{selected.jurisdiction}, {selected.country}</p>
        <p className="mt-4 text-sm leading-6 text-zinc-300">{selected.description}</p>
        <div className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded border border-zincLine bg-zincLine">
          <div className="min-w-0 bg-zincPanel p-3">
            <p className="text-[10px] uppercase text-zinc-500">Commodity</p>
            <p className="mt-1 truncate text-sm text-zinc-100">{selected.commodity}</p>
          </div>
          <div className="min-w-0 bg-zincPanel p-3">
            <p className="text-[10px] uppercase text-zinc-500">Reserve life</p>
            <p className="mt-1 truncate font-mono text-sm text-zinc-100">{selected.reserveLife}</p>
            {selected.reserveLifeCalculated ? <p className="mt-1 text-[9px] uppercase text-caution">Calculated ratio</p> : null}
          </div>
          <div className="col-span-2 min-w-0 bg-zincPanel p-3">
            <p className="text-[10px] uppercase text-zinc-500">Production</p>
            <p className="mt-1 break-words font-mono text-sm text-zinc-100">{selected.production}</p>
          </div>
        </div>
        <p className="mt-4 text-[10px] uppercase tracking-wide text-zinc-600">
          Corporate presentation · PDF page {selected.sourcePage}
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {assets.map((asset) => (
            <button
              key={asset.name}
              type="button"
              onClick={() => setSelected(asset)}
              className={`rounded border px-2 py-1 text-[10px] font-semibold uppercase transition ${
                selected.name === asset.name
                  ? "border-zinc-300 bg-zinc-100 text-zinc-950"
                  : "border-zincLine text-zinc-500 hover:border-zinc-500 hover:text-zinc-200"
              }`}
            >
              {asset.name}
            </button>
          ))}
        </div>
      </aside>
    </div>
  );
}
