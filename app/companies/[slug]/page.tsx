import { notFound } from "next/navigation";
import { CompanyDetail } from "@/components/CompanyDetail";
import { companies, getCompanyBySlug } from "@/data/screener-data";

export function generateStaticParams() {
  return companies.map((company) => ({
    slug: company.slug
  }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const company = getCompanyBySlug(slug);

  if (!company) {
    return {
      title: "Company not found"
    };
  }

  return {
    title: `${company.company} (${company.ticker}) | Mining Intelligence`,
    description: `${company.company} valuation, production, cost, balance sheet, and risk profile.`
  };
}

export default async function CompanyPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const company = getCompanyBySlug(slug);

  if (!company) {
    notFound();
  }

  return <CompanyDetail company={company} />;
}
