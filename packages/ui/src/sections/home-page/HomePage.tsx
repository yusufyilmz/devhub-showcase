import "../../styles/components/sections/home.css";

import type { ReactNode } from "react";

import {
  HomeCapabilitiesSection,
  HomeChatLauncher,
  HomeCTASection,
  HomeFAQSection,
  HomeFeaturesSection,
  HomeFooter,
  HomeHeader,
  HomeHeroSection,
  HomeLibrarySection,
  HomeOptionsSection,
  HomePricingSection,
  HomeProcessSection,
  type PageAction,
} from "../home-section";

export function HomePage({
  action,
  exampleHref,
  examples,
  planDetails,
}: {
  action: PageAction;
  exampleHref: string | null;
  examples: ReactNode;
  planDetails: ReactNode;
}) {
  return (
    <div className="home-page">
      <a className="skip-link" href="#home-content">
        Skip to content
      </a>
      <HomeHeader action={action} />
      <main id="home-content">
        <HomeHeroSection action={action} exampleHref={exampleHref} />
        <HomeCapabilitiesSection />
        <HomeChatLauncher />
        {examples}
        <HomeFeaturesSection />
        <HomeOptionsSection />
        <HomePricingSection action={action}>{planDetails}</HomePricingSection>
        <HomeLibrarySection href={action.href} />
        <HomeProcessSection />
        <HomeFAQSection />
        <HomeCTASection action={action} />
      </main>
      <HomeFooter action={action} />
    </div>
  );
}
