export function AbsurdMetricTooltip({
  label,
  children
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <span className="group/tooltip relative inline-flex">
      {children}
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-40 mb-2 hidden w-64 -translate-x-1/2 rounded border border-zinc-600 bg-zinc-950 p-2 text-[11px] leading-5 text-zinc-300 shadow-xl group-hover/tooltip:block group-focus-within/tooltip:block"
      >
        {label}
      </span>
    </span>
  );
}
