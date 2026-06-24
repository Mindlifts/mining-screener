import type { AbsurdMetricResult } from "@/types/absurdMetrics";

const series: Record<string, number[]> = {
  "barrick-bother": [24, 31, 27, 43, 38, 52, 48, 64, 58, 72],
  "hype-liability": [18, 28, 23, 41, 37, 45, 52, 48, 61, 70],
  "geology-reality": [15, 21, 29, 31, 40, 46, 58, 64, 71, 82],
  "double-without-news": [22, 25, 24, 31, 35, 44, 51, 62, 72, 88],
  "sleeping-giant": [28, 30, 35, 34, 43, 48, 54, 63, 72, 84]
};

function Sparkline({ metric, color }: { metric: AbsurdMetricResult; color: string }) {
  const values = series[metric.id] ?? [20, 35, 30, 48, 42, 60, 55, 76];
  const points = values.map((value, index) => `${index * 18},${62 - value * 0.55}`).join(" ");

  return (
    <svg viewBox="0 0 162 68" className="h-16 w-full" aria-hidden="true">
      <path d="M0 62H162M0 42H162M0 22H162" stroke="#202a31" strokeWidth="1" />
      <polyline points={points} fill="none" stroke={color} strokeWidth="2.5" />
      <polyline points={`0,68 ${points} 162,68`} fill={color} opacity=".08" stroke="none" />
    </svg>
  );
}

function Gauge({ metric, color }: { metric: AbsurdMetricResult; color: string }) {
  const score = metric.score ?? 0;
  const angle = -90 + score * 1.8;

  return (
    <svg viewBox="0 0 160 84" className="h-20 w-full" aria-hidden="true">
      <path d="M25 72a55 55 0 0 1 110 0" fill="none" stroke="#263039" strokeWidth="10" strokeLinecap="round" />
      <path d="M25 72a55 55 0 0 1 38-52" fill="none" stroke="#ef5b61" strokeWidth="10" strokeLinecap="round" />
      <path d="M63 20a55 55 0 0 1 48 8" fill="none" stroke="#f2ad4f" strokeWidth="10" />
      <path d="M111 28a55 55 0 0 1 24 44" fill="none" stroke="#75cf68" strokeWidth="10" strokeLinecap="round" />
      <g transform={`rotate(${angle} 80 72)`}>
        <path d="M80 72 77 29h6l-3 43Z" fill={color} />
      </g>
      <circle cx="80" cy="72" r="6" fill={color} />
    </svg>
  );
}

function Bars({ metric, color }: { metric: AbsurdMetricResult; color: string }) {
  const score = metric.score ?? 0;
  return (
    <div className="space-y-2 py-2">
      {[0.55, 0.72, 0.88, 1].map((factor, index) => (
        <div key={factor} className="flex items-center gap-2">
          <span className="w-4 font-mono text-[8px] text-zinc-700">{index + 1}</span>
          <div className="h-1.5 flex-1 overflow-hidden bg-[#202932]">
            <div className="h-full" style={{ width: `${Math.min(100, score * factor)}%`, backgroundColor: color }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function People({ metric, color }: { metric: AbsurdMetricResult; color: string }) {
  const active = Math.round(((metric.score ?? 0) / 100) * 8);
  return (
    <div className="flex items-end justify-center gap-1.5 py-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <span key={index} className="grid gap-1">
          <span className="h-3 w-3 rounded-full border" style={{ borderColor: color, backgroundColor: index < active ? color : "#1b242b" }} />
          <span className="h-5 w-3 border" style={{ borderColor: color, backgroundColor: index < active ? `${color}55` : "#11181d" }} />
        </span>
      ))}
    </div>
  );
}

function Dominoes({ metric, color }: { metric: AbsurdMetricResult; color: string }) {
  const count = Math.max(1, Math.round(((metric.score ?? 0) / 100) * 7));
  return (
    <div className="flex h-20 items-end justify-center gap-2 py-2">
      {Array.from({ length: 7 }).map((_, index) => (
        <span
          key={index}
          className="block h-12 w-4 border transition-transform duration-300 group-hover:-rotate-6"
          style={{
            borderColor: index < count ? color : "#29323a",
            backgroundColor: index < count ? `${color}22` : "#10161b",
            transform: `translateY(${index * 2}px) rotate(${index * 2}deg)`
          }}
        />
      ))}
    </div>
  );
}

export function AbsurdMetricMicroViz({
  metric,
  color
}: {
  metric: AbsurdMetricResult;
  color: string;
}) {
  if (metric.id === "ceo-sleep" || metric.id === "institutional-comfort") {
    return <Gauge metric={metric} color={color} />;
  }
  if (metric.id === "road-to-starbucks" || metric.id === "geology-reality") {
    return <Bars metric={metric} color={color} />;
  }
  if (metric.id === "shovel-density") {
    return <People metric={metric} color={color} />;
  }
  if (metric.id === "things-must-go-right") {
    return <Dominoes metric={metric} color={color} />;
  }
  return <Sparkline metric={metric} color={color} />;
}
