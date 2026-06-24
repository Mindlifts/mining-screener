import type { AbsurdMetricResult } from "@/types/absurdMetrics";

export function AbsurdMetricRadarChart({ metrics }: { metrics: AbsurdMetricResult[] }) {
  const selected = metrics
    .filter((metric) => metric.score !== null)
    .slice(0, 6);
  const center = 110;
  const radius = 78;
  const points = selected.map((metric, index) => {
    const angle = (Math.PI * 2 * index) / selected.length - Math.PI / 2;
    const normalized = metric.isHigherBetter ? metric.score! : 100 - metric.score!;
    const r = radius * (normalized / 100);
    return {
      x: center + Math.cos(angle) * r,
      y: center + Math.sin(angle) * r,
      labelX: center + Math.cos(angle) * (radius + 24),
      labelY: center + Math.sin(angle) * (radius + 24),
      metric
    };
  });

  if (selected.length < 3) {
    return (
      <div className="grid min-h-64 place-items-center rounded-lg border border-zincLine bg-zincPanel/70 p-6 text-center text-sm text-zinc-500">
        At least three scored metrics are needed for the radar view.
      </div>
    );
  }

  const polygon = points.map(({ x, y }) => `${x},${y}`).join(" ");

  return (
    <section className="min-w-0 overflow-hidden rounded-lg border border-zincLine bg-zincPanel/75 p-4">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-600">Shape of the thesis</p>
        <h3 className="mt-2 text-lg font-semibold text-zinc-50">Absurd metrics radar</h3>
      </div>
      <svg viewBox="0 0 220 220" className="mx-auto mt-3 aspect-square w-full max-w-sm" role="img" aria-label="Absurd metrics radar chart">
        {[0.25, 0.5, 0.75, 1].map((scale) => {
          const ring = points.map((_, index) => {
            const angle = (Math.PI * 2 * index) / selected.length - Math.PI / 2;
            return `${center + Math.cos(angle) * radius * scale},${center + Math.sin(angle) * radius * scale}`;
          }).join(" ");
          return <polygon key={scale} points={ring} fill="none" stroke="#30343f" strokeWidth="1" />;
        })}
        {points.map(({ labelX, labelY, metric }, index) => (
          <g key={metric.id}>
            <line x1={center} y1={center} x2={labelX} y2={labelY} stroke="#292d36" />
            <text
              x={labelX}
              y={labelY}
              textAnchor={labelX < center - 8 ? "end" : labelX > center + 8 ? "start" : "middle"}
              dominantBaseline="middle"
              fill="#8b909c"
              fontSize="7"
            >
              {index + 1}
            </text>
          </g>
        ))}
        <polygon points={polygon} fill="rgba(157,229,139,.18)" stroke="#9de58b" strokeWidth="2" />
        {points.map(({ x, y, metric }) => <circle key={metric.id} cx={x} cy={y} r="3" fill="#f4c167" />)}
      </svg>
      <div className="grid grid-cols-1 gap-1.5 text-[11px] sm:grid-cols-2">
        {selected.map((metric, index) => (
          <div key={metric.id} className="flex min-w-0 items-center gap-2">
            <span className="font-mono text-caution">{index + 1}</span>
            <span className="truncate text-zinc-500">{metric.shortName}</span>
            <span className="ml-auto font-mono text-zinc-200">
              {metric.isHigherBetter ? metric.score : 100 - metric.score!}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
