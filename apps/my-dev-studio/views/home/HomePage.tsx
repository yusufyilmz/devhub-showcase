import "@shared/ui/home.css";

import type { ReactNode } from "react";

import {
  HomeCapabilitiesSection,
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
} from "@shared/ui/home-section";
import { SkipLink } from "@shared/ui/navigation";

export function HomePage({
  accountMenu,
  action,
  exampleHref,
  examples,
  planDetails,
  chatLauncher,
}: {
  accountMenu?: ReactNode;
  action: PageAction;
  exampleHref: string | null;
  examples: ReactNode;
  planDetails: ReactNode;
  chatLauncher?: ReactNode;
}) {
  return (
    <div className="home-page">
      <SkipLink href="#home-content">Skip to content</SkipLink>
      <HomeHeader accountMenu={accountMenu} action={action} />
      <main id="home-content">
        <HomeHeroSection action={action} exampleHref={exampleHref} />
        <HomeCapabilitiesSection />
        {chatLauncher}
        {examples}
        <HomeFeaturesSection />
        <HomeOptionsSection />
        <HomePricingSection action={action}>{planDetails}</HomePricingSection>
        <HomeLibrarySection action={action} />
        <HomeFAQSection />
        <HomeCTASection action={action} />
      </main>
      <HomeFooter action={action} />
    </div>
  );
}
