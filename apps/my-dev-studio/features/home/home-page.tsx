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
} from "@shared/ui/sections";

import { ExampleCarousel, StudioPlanDetails } from "@/features/studio";

export function HomePage({
  action,
  exampleHref,
}: {
  action: PageAction;
  exampleHref: string | null;
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
        <ExampleCarousel />
        <HomeFeaturesSection />
        <HomeOptionsSection />
        <HomePricingSection action={action}>
          <StudioPlanDetails />
        </HomePricingSection>
        <HomeLibrarySection href={action.href} />
        <HomeProcessSection />
        <HomeFAQSection />
        <HomeCTASection action={action} />
      </main>
      <HomeFooter action={action} />
    </div>
  );
}
