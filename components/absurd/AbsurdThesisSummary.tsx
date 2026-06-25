import type { AbsurdThesis } from "@/types/absurdMetrics";

function ThesisColumn({
  title,
  items,
  tone
}: {
  title: string;
  items: string[];
  tone: string;
}) {
  return (
    <section className="min-w-0 border-t border-[#27343d] pt-3 lg:border-l lg:border-t-0 lg:pl-4">
      <h3 className={`text-[10px] font-semibold uppercase tracking-[0.14em] ${tone}`}>{title}</h3>
      <ul className="mt-3 space-y-2 text-[11px] leading-5 text-zinc-400">
        {items.slice(0, 3).map((item) => (
          <li key={item} className="border-l border-[#35434c] pl-2">{item}</li>
        ))}
      </ul>
    </section>
  );
}

export function AbsurdThesisSummary({ thesis }: { thesis: AbsurdThesis }) {
  return (
    <section className="min-w-0 overflow-hidden border border-[#30414b] bg-[#081117]">
      <div className="grid min-w-0 grid-cols-1 gap-4 p-4 lg:grid-cols-[220px_repeat(3,minmax(0,1fr))]">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#45c7c4]">Hidden Alpha Thesis</p>
          <p className="mt-3 font-mono text-4xl text-terminalGreen">
            {thesis.convictionScore ?? "—"}<span className="text-sm text-zinc-600"> / 100</span>
          </p>
          <p className="mt-1 text-[9px] uppercase tracking-wide text-zinc-600">Overall Absurd Conviction</p>
          <div className="mt-4 border border-caution/40 bg-caution/5 p-3">
            <p className="text-[9px] uppercase tracking-wide text-caution">Absurd Archetype</p>
            <p className="mt-1 text-base font-semibold text-zinc-100">{thesis.archetype}</p>
            <p className="mt-2 text-[10px] leading-4 text-zinc-500">{thesis.archetypeExplanation}</p>
          </div>
        </div>
        <ThesisColumn title="Why This Might Work" items={thesis.whyItMightWork} tone="text-terminalGreen" />
        <ThesisColumn title="Why This Might Fail" items={thesis.whyItMightFail} tone="text-red-300" />
        <ThesisColumn title="What Must Go Right" items={thesis.whatMustGoRight} tone="text-caution" />
      </div>
    </section>
  );
}
