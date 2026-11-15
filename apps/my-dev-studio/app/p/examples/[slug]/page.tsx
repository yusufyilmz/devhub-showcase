import "@shared/assistant/examples.css";

import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  examplePath,
  exampleViewProfile,
  getPortfolioExample,
  portfolioExamples,
} from "@shared/assistant/examples-data";
import { PortfolioLayout } from "@shared/assistant/portfolio";

import { EngineerPortfolio } from "../../../[username]/_engineer-portfolio";

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
      <aside
        aria-label="Example portfolio"
        className="example-banner [display:flex] [flex-wrap:wrap] [gap:0.75rem] [justify-content:space-between] [padding:1rem_5%] [font-size:0.8rem] [color:var(--foreground)] [background:var(--card)] [border-bottom:1px_solid_var(--border)] [&_a]:[color:inherit] [text-decoration:underline] [text-underline-offset:4px]"
      >
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
