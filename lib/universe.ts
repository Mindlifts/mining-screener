import companiesJson from "@/data/companies.json";
import type {
  Company,
  CompanyStatus,
  CompanyTag,
  InvestorUniverse
} from "@/types/company";

export const companyStatuses: CompanyStatus[] = [
  "producer",
  "developer",
  "explorer",
  "royalty",
  "streamer",
  "delisted",
  "acquired"
];

export const investorUniverses: InvestorUniverse[] = [
  "Rick Rule",
  "Eric Sprott",
  "Ross Beaty",
  "Tavi Costa",
  "Lobo Tigre"
];

export const companyTags: CompanyTag[] = [
  "high torque",
  "dilution risk",
  "tier 1 asset",
  "takeover candidate",
  "low cost",
  "high risk"
];

export function getAllCompanies(): Company[] {
  return companiesJson as Company[];
}

export function isCompanyVisible(company: Company) {
  return company.active && !company.hidden;
}

export function getVisibleCompanies(): Company[] {
  return getAllCompanies().filter(isCompanyVisible);
}

export function getVisibleCompanyBySlug(slug: string) {
  return getVisibleCompanies().find((company) => company.slug === slug);
}

export function searchUniverse(companies: Company[], query: string) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return companies;

  return companies.filter((company) =>
    [
      company.company,
      company.ticker,
      company.exchange,
      company.commodity,
      company.country,
      company.jurisdiction,
      company.status,
      ...company.tags,
      ...company.investorUniverses
    ]
      .join(" ")
      .toLowerCase()
      .includes(normalized)
  );
}

export function updateCompanyRecord(
  companies: Company[],
  slug: string,
  patch: Partial<Company>
) {
  return companies.map((company) =>
    company.slug === slug
      ? {
          ...company,
          ...patch,
          lastUpdated: new Date().toISOString().slice(0, 10)
        }
      : company
  );
}
