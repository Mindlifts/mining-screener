import { investorModes, type InvestorMode } from "@/lib/scoring";

export function ModeNavigation({
  activeMode,
  onSelect
}: {
  activeMode: InvestorMode;
  onSelect: (mode: InvestorMode) => void;
}) {
  return (
    <nav className="grid gap-2 sm:grid-cols-2 xl:grid-cols-6">
      {investorModes.map((mode) => (
        <button
          key={mode.mode}
          type="button"
          onClick={() => onSelect(mode.mode)}
          className={`rounded-lg border px-3 py-3 text-left transition duration-200 ${
            activeMode === mode.mode
              ? "border-terminalGreen/70 bg-terminalGreen/10 text-zinc-50 shadow-glow"
              : "border-zincLine bg-zinc-950/80 text-zinc-400 hover:border-zinc-600 hover:bg-zinc-900"
          }`}
        >
          <span className="block text-sm font-semibold">{mode.mode}</span>
          <span className="mt-1 block text-[11px] uppercase tracking-wide text-zinc-500">{mode.shortLabel}</span>
        </button>
      ))}
    </nav>
  );
}
