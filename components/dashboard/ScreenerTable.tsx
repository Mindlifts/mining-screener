import Link from "next/link";
import type { Company } from "@/data/mining-universe";
import type { CompanyScore } from "@/lib/scoring";

export type EnrichedCompany = {
  company: Company;
  score: CompanyScore;
};

export type SortKey = keyof CompanyScore | keyof Company;

export type SortDirection = "asc" | "desc";

export type Column = {
  key: SortKey;
  label: string;
  align?: "left" | "right";
  render: (row: EnrichedCompany) => React.ReactNode;
};

export function ScorePill({ value, strong = false }: { value: number; strong?: boolean }) {
  const tone = value >= 75 ? "bg-terminalGreen" : value >= 55 ? "bg-caution" : "bg-red-400";

  return (
    <div className="flex items-center justify-end gap-2">
      <div className={`${strong ? "w-20" : "w-14"} h-1.5 overflow-hidden rounded-full bg-zinc-800`}>
        <div className={`h-full ${tone} transition-all duration-300`} style={{ width: `${value}%` }} />
      </div>
      <span className={`${strong ? "text-zinc-50" : "text-zinc-200"} w-8 text-right font-mono`}>{value}</span>
    </div>
  );
}

function SortButton({
  label,
  sortKey,
  activeSort,
  direction,
  onSort
}: {
  label: string;
  sortKey: SortKey;
  activeSort: SortKey;
  direction: SortDirection;
  onSort: (key: SortKey) => void;
}) {
  const isActive = activeSort === sortKey;

  return (
    <button
      type="button"
      onClick={() => onSort(sortKey)}
      className="flex w-full items-center justify-end gap-1 text-right font-medium uppercase tracking-wide text-zinc-500 hover:text-zinc-100"
    >
      <span>{label}</span>
      <span className="w-3 text-zinc-400">{isActive ? (direction === "asc" ? "↑" : "↓") : ""}</span>
    </button>
  );
}

export function CompanyCell({ company }: { company: Company }) {
  return (
    <div className="max-w-[230px]">
      <Link href={`/companies/${company.slug}`} className="font-medium text-zinc-50 hover:text-terminalGreen">
        {company.company}
      </Link>
      <p className="mt-1 font-mono text-[11px] text-caution">
        {company.ticker} · {company.exchange}
      </p>
    </div>
  );
}

export function ScreenerTable({
  rows,
  columns,
  sortKey,
  sortDirection,
  onSort
}: {
  rows: EnrichedCompany[];
  columns: Column[];
  sortKey: SortKey;
  sortDirection: SortDirection;
  onSort: (key: SortKey) => void;
}) {
  return (
    <section className="overflow-hidden rounded-lg border border-zincLine bg-zincPanel/85 transition-all duration-300">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1120px] border-collapse text-xs">
          <thead>
            <tr className="border-b border-zincLine bg-zinc-950/80 text-zinc-500">
              {columns.map((column) => (
                <th
                  key={`${column.key}-${column.label}`}
                  className={`px-3 py-2 ${column.align === "left" ? "text-left" : "text-right"}`}
                >
                  {column.align === "left" ? (
                    <span className="font-medium uppercase tracking-wide text-zinc-500">{column.label}</span>
                  ) : (
                    <SortButton
                      label={column.label}
                      sortKey={column.key}
                      activeSort={sortKey}
                      direction={sortDirection}
                      onSort={onSort}
                    />
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.company.slug}
                className="border-b border-zincLine/80 text-zinc-200 transition-colors duration-150 last:border-0 hover:bg-zinc-900/80"
              >
                {columns.map((column) => (
                  <td
                    key={`${row.company.slug}-${column.key}-${column.label}`}
                    className={`px-3 py-3 ${column.align === "left" ? "text-left" : "text-right"}`}
                  >
                    {column.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
