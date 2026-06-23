import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { InvestmentCaseTemplate } from "@/components/investment-cases/InvestmentCaseTemplate";
import { getInvestmentCase, investmentCases } from "@/data/investment-cases";

export function generateStaticParams() {
  return investmentCases.map((investmentCase) => ({
    slug: investmentCase.slug
  }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const investmentCase = getInvestmentCase(slug);

  if (!investmentCase) {
    return { title: "Investment case not found" };
  }

  return {
    title: `${investmentCase.company} Investment Case | Mining Intelligence`,
    description: investmentCase.thesis
  };
}

export default async function InvestmentCasePage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const investmentCase = getInvestmentCase(slug);

  if (!investmentCase) {
    notFound();
  }

  return <InvestmentCaseTemplate data={investmentCase} />;
}
