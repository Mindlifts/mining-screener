"use client";

export function Toggle({
  checked,
  onChange,
  label
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full border transition ${
        checked
          ? "border-terminalGreen/60 bg-terminalGreen/25"
          : "border-zinc-700 bg-zinc-900"
      }`}
    >
      <span
        className={`absolute top-0.5 h-4 w-4 rounded-full transition ${
          checked ? "left-5 bg-terminalGreen" : "left-1 bg-zinc-500"
        }`}
      />
    </button>
  );
}
