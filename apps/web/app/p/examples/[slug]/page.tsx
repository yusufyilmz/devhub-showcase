import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  examplePath,
  exampleViewProfile,
  getPortfolioExample,
  portfolioExamples,
} from "@/features/examples/data";
import { EngineerPortfolio } from "@/features/portfolio/engineer-portfolio";
import { PortfolioLayout } from "@/features/portfolio/portfolio-layout";
import "@/features/examples/examples.css";

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() {
  return portfolioExamples.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const item = getPortfolioExample((await params).slug);
  if (!item) notFound();
  const title = `${item.profile.name} | Fictional portfolio example`;
  const description = `Explore a fictional ${item.profile.portfolioType} portfolio with the ${item.profile.appearance?.theme} theme.`;
  return {
    alternates: { canonical: examplePath(item.slug) },
    description,
    openGraph: {
      description,
      title,
      type: "website",
      url: examplePath(item.slug),
    },
    robots: { follow: false, index: false },
    title,
    twitter: { card: "summary", description, title },
  };
}
export default async function ExamplePage({ params }: Props) {
  const item = getPortfolioExample((await params).slug);
  if (!item) notFound();
  const profile = exampleViewProfile(item);
  return (
    <>
      <aside aria-label="Example portfolio" className="example-banner">
        <a href="/#examples">← All examples</a>
        <span>Fictional portfolio · Sample work and CV</span>
        <a href="/admin">Create your portfolio ↗</a>
      </aside>
      {profile.portfolioType === "engineer" ? (
        <EngineerPortfolio profile={profile} />
      ) : (
        <PortfolioLayout profile={profile} username={`p/examples/${item.slug}`} />
      )}
    </>
  );
}
