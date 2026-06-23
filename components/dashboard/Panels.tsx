import Link from "next/link";
import type { Company } from "@/data/mining-universe";
import { investorModes, scoreCompany, type InvestorMode, type ScoreWeights } from "@/lib/scoring";
import { formatMultiple, formatPercent } from "@/components/dashboard/formatters";
import type { EnrichedCompany } from "@/components/dashboard/ScreenerTable";

function Panel({
  title,
  children,
  subtitle
}: {
  title: string;
  children: React.ReactNode;
  subtitle?: string;
}) {
  return (
    <section className="rounded-lg border border-zincLine bg-zincPanel/85 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-zinc-50">{title}</h2>
          {subtitle ? <p className="mt-1 text-xs text-zinc-500">{subtitle}</p> : null}
        </div>
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export function OpportunityPanel({
  rows,
  title,
  subtitle,
  activeMode
}: {
  rows: EnrichedCompany[];
  title: string;
  subtitle: string;
  activeMode: InvestorMode;
}) {
  const topRows = rows.slice(0, 4);

  return (
    <Panel title={title} subtitle={subtitle}>
      <div className="space-y-3">
        {topRows.map(({ company, score }) => (
          <div key={company.slug} className="border-b border-zincLine pb-3 last:border-0 last:pb-0">
            <div className="flex items-center justify-between gap-3">
              <Link href={`/companies/${company.slug}`} className="text-sm font-medium text-zinc-100 hover:text-terminalGreen">
                {company.ticker}
              </Link>
              <span className="font-mono text-sm text-caution">{score.total}</span>
            </div>
            <p className="mt-1 text-xs text-zinc-500">
              {activeMode === "Eric Sprott"
                ? `${score.torque} torque · ${score.catalysts} catalysts · ${formatPercent(company.insiderOwnership)} insider`
                : activeMode === "Ross Beaty"
                  ? `${score.management} management · ${company.executionTrackRecord} execution · ${company.capitalAllocation} capital`
                  : activeMode === "Tavi Costa"
                    ? `${score.macro} macro · ${score.commodityCycle} cycle · ${company.commodity}`
                    : activeMode === "Lobo Tigre"
                      ? `${company.navDiscount}% NAV discount · ${company.evResource} EV/resource · ${score.contrarian} contrarian`
                      : `${score.survival} survival · ${score.valuation} value · ${company.jurisdiction}`}
            </p>
          </div>
        ))}
      </div>
    </Panel>
  );
}

export function ConsensusPanel({
  companies,
  customWeights
}: {
  companies: Company[];
  customWeights: ScoreWeights;
}) {
  const consensus = companies
    .map((company) => {
      const modeScores = investorModes.map((mode) => ({
        mode: mode.mode,
        total: scoreCompany(company, mode.mode, customWeights).total
      }));
      const average = Math.round(modeScores.reduce((sum, item) => sum + item.total, 0) / modeScores.length);
      const leader = modeScores.slice().sort((a, b) => b.total - a.total)[0];

      return { company, average, leader };
    })
    .sort((a, b) => b.average - a.average)
    .slice(0, 6);

  return (
    <Panel title="Investor Consensus" subtitle="Average score across every investor DNA mode.">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[360px] text-xs">
          <thead className="text-zinc-500">
            <tr className="border-b border-zincLine">
              <th className="pb-2 text-left font-medium uppercase tracking-wide">Name</th>
              <th className="pb-2 text-right font-medium uppercase tracking-wide">Avg</th>
              <th className="pb-2 text-right font-medium uppercase tracking-wide">Best Fit</th>
            </tr>
          </thead>
          <tbody>
            {consensus.map(({ company, average, leader }) => (
              <tr key={company.slug} className="border-b border-zincLine/80 last:border-0">
                <td className="py-2">
                  <Link href={`/companies/${company.slug}`} className="font-medium text-zinc-100 hover:text-terminalGreen">
                    {company.ticker}
                  </Link>
                  <p className="mt-0.5 text-[11px] text-zinc-500">{company.commodity}</p>
                </td>
                <td className="py-2 text-right font-mono text-terminalGreen">{average}</td>
                <td className="py-2 text-right text-zinc-400">{leader.mode}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

export function ComparisonPanel({ rows }: { rows: EnrichedCompany[] }) {
  const compared = rows.slice(0, 3);

  return (
    <Panel title="Company Comparison" subtitle="Current top three names under the active filter and ranking.">
      <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
        {compared.map(({ company, score }) => (
          <div key={company.slug} className="rounded border border-zincLine bg-zinc-950/70 p-3">
            <div className="flex items-center justify-between gap-2">
              <Link href={`/companies/${company.slug}`} className="text-sm font-semibold text-zinc-50 hover:text-terminalGreen">
                {company.ticker}
              </Link>
              <span className="font-mono text-sm text-terminalGreen">{score.total}</span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] text-zinc-500">
              <span>EV/EBITDA</span>
              <span className="text-right font-mono text-zinc-200">{formatMultiple(company.evEbitda)}</span>
              <span>FCF Yield</span>
              <span className="text-right font-mono text-zinc-200">{formatPercent(company.fcfYield)}</span>
              <span>Survival</span>
              <span className="text-right font-mono text-zinc-200">{score.survival}</span>
              <span>Torque</span>
              <span className="text-right font-mono text-zinc-200">{score.torque}</span>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}
