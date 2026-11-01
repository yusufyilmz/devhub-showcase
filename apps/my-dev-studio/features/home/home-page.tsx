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
  HomeProcessSection,
  type PageAction,
} from "@shared/components/sections";
import { ExampleCarousel } from "@shared/components/studio";

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
        <ExampleCarousel />
        <HomeFeaturesSection />
        <HomeOptionsSection />
        <HomePricingSection action={action} />
        <HomeLibrarySection href={action.href} />
        <HomeProcessSection />
        <HomeFAQSection />
        <HomeCTASection action={action} />
      </main>
      <HomeFooter action={action} />
    </div>
  );
}
