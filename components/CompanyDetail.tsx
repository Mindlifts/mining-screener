import Link from "next/link";
import type { Company } from "@/lib/data";
import { scoreCompany } from "@/lib/scoring";

const moneyFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1
});

const numberFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 1
});

function formatMoney(value: number) {
  return `$${moneyFormatter.format(value * 1_000_000)}`;
}

function formatPercent(value: number | null) {
  return value === null ? "N/A" : `${numberFormatter.format(value)}%`;
}

function formatMultiple(value: number | null) {
  return value === null ? "N/A" : `${numberFormatter.format(value)}x`;
}

function Card({
  title,
  children,
  className = ""
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-lg border border-zincLine bg-zincPanel/85 p-4 ${className}`}>
      <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-400">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-zincLine py-3 last:border-0">
      <p className="text-xs uppercase tracking-wide text-zinc-500">{label}</p>
      <p className="mt-1 font-mono text-base text-zinc-50">{value}</p>
    </div>
  );
}

function ThesisList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3 text-sm text-zinc-300">
      {items.map((item) => (
        <li key={item} className="border-l border-zinc-700 pl-3">{item}</li>
      ))}
    </ul>
  );
}

function ScoreRow({ label, value }: { label: string; value: number }) {
  const tone = value >= 75 ? "bg-terminalGreen" : value >= 55 ? "bg-caution" : "bg-red-400";

  return (
    <div>
      <div className="flex items-center justify-between text-xs">
        <span className="uppercase tracking-wide text-zinc-500">{label}</span>
        <span className="font-mono text-zinc-100">{value}</span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-zinc-800">
        <div className={`h-full ${tone}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export function CompanyDetail({ company }: { company: Company }) {
  const score = scoreCompany(company);

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-3 py-3 sm:px-5 lg:px-6">
        <header className="border-b border-zincLine pb-4">
          <Link href="/" className="text-xs font-semibold uppercase tracking-wide text-terminalGreen hover:text-zinc-50">
            Back to screener
          </Link>
          <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">
                {company.commodity} · {company.stage} · {company.exchange}
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-50">{company.company}</h1>
              <p className="mt-2 font-mono text-sm text-caution">{company.ticker}</p>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs sm:min-w-[460px]">
              <div className="border border-zincLine bg-zincPanel px-3 py-2">
                <p className="text-zinc-500">Total Score</p>
                <p className="mt-1 font-mono text-xl text-terminalGreen">{score.total}</p>
              </div>
              <div className="border border-zincLine bg-zincPanel px-3 py-2">
                <p className="text-zinc-500">EV/EBITDA</p>
                <p className="mt-1 font-mono text-xl text-zinc-50">{formatMultiple(company.evEbitda)}</p>
              </div>
              <div className="border border-zincLine bg-zincPanel px-3 py-2">
                <p className="text-zinc-500">FCF Yield</p>
                <p className="mt-1 font-mono text-xl text-zinc-50">{formatPercent(company.fcfYield)}</p>
              </div>
            </div>
          </div>
        </header>

        <section className="grid gap-4 lg:grid-cols-[1fr_340px]">
          <div className="grid gap-4 md:grid-cols-2">
            <Card title="Valuation Snapshot">
              <Metric label="Market Cap" value={formatMoney(company.marketCap)} />
              <Metric label="Enterprise Value" value={formatMoney(company.enterpriseValue)} />
              <Metric label="Revenue" value={formatMoney(company.revenue)} />
              <Metric label="EBITDA" value={formatMoney(company.ebitda)} />
              <Metric label="Dividend Yield" value={formatPercent(company.dividendYield)} />
            </Card>

            <Card title="Production Profile">
              <Metric label="Production" value={`${numberFormatter.format(company.production)} ${company.productionUnit}`} />
              <Metric label="Reserve Life" value={`${company.reserveLife} years`} />
              <Metric label="Country" value={company.country} />
              <Metric label="Primary Jurisdiction" value={company.jurisdiction} />
              <Metric label="Stage" value={company.stage} />
            </Card>

            <Card title="Cost Profile">
              <Metric
                label="AISC"
                value={company.aisc === null ? "N/A" : `${numberFormatter.format(company.aisc)} ${company.aiscUnit}`}
              />
              <Metric label="Cost Score" value={`${score.cost}/100`} />
              <Metric label="Reserve Cushion" value={`${company.reserveLife} years`} />
            </Card>

            <Card title="Balance Sheet">
              <Metric label="Net Debt" value={formatMoney(company.netDebt)} />
              <Metric label="Cash" value={formatMoney(company.cash)} />
              <Metric label="Balance Sheet Score" value={`${score.balanceSheet}/100`} />
              <Metric label="Insider Ownership" value={formatPercent(company.insiderOwnership)} />
            </Card>

            <Card title="Jurisdiction Risk">
              <Metric label="Risk Level" value={company.jurisdictionRisk} />
              <Metric label="Jurisdiction Score" value={`${score.jurisdiction}/100`} />
              <div className="mt-4 space-y-2">
                {company.riskFlags.map((flag) => (
                  <p key={flag} className="border-l-2 border-red-400/70 pl-3 text-sm text-zinc-300">{flag}</p>
                ))}
              </div>
            </Card>

            <Card title="Scoring Model">
              <div className="space-y-4">
                <ScoreRow label="Valuation" value={score.valuation} />
                <ScoreRow label="Balance Sheet" value={score.balanceSheet} />
                <ScoreRow label="Cost" value={score.cost} />
                <ScoreRow label="Jurisdiction" value={score.jurisdiction} />
                <ScoreRow label="Insider" value={score.insider} />
              </div>
            </Card>
          </div>

          <aside className="space-y-4">
            <Card title="Bull Case">
              <ThesisList items={company.bullCase} />
            </Card>
            <Card title="Bear Case">
              <ThesisList items={company.bearCase} />
            </Card>
            <Card title="Key Catalysts">
              <ThesisList items={company.keyCatalysts} />
            </Card>
          </aside>
        </section>
      </div>
    </main>
  );
}
