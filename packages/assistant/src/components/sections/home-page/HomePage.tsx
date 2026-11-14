import "../home-section/home.css";

import type { ReactNode } from "react";

import { SkipLink } from "@shared/ui/header";

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
  type PageAction,
} from "../home-section";

export function HomePage({
  accountMenu,
  action,
  exampleHref,
  examples,
  planDetails,
}: {
  accountMenu?: ReactNode;
  action: PageAction;
  exampleHref: string | null;
  examples: ReactNode;
  planDetails: ReactNode;
}) {
  return (
    <div className="home-page [--home-width:1200px] [&_>_main]:[overflow:clip]">
      <SkipLink href="#home-content">Skip to content</SkipLink>
      <HomeHeader accountMenu={accountMenu} action={action} />
      <main id="home-content">
        <HomeHeroSection action={action} exampleHref={exampleHref} />
        <HomeCapabilitiesSection />
        <HomeChatLauncher />
        {examples}
        <HomeFeaturesSection />
        <HomeOptionsSection />
        <HomePricingSection action={action}>{planDetails}</HomePricingSection>
        <HomeLibrarySection href={action.href} />
        <HomeFAQSection />
        <HomeCTASection action={action} />
      </main>
      <HomeFooter action={action} />
    </div>
  );
}
