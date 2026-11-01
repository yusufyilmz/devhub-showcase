import {
  Capabilities,
  Faq,
  Features,
  Final,
  Footer,
  Header,
  Hero,
  Library,
  Options,
  type PageAction,
  Pricing,
  Process,
} from "@shared/components/containers";
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
      <Header action={action} />
      <main id="home-content">
        <Hero action={action} exampleHref={exampleHref} />
        <Capabilities />
        <ExampleCarousel />
        <Features />
        <Options />
        <Pricing action={action} />
        <Library href={action.href} />
        <Process />
        <Faq />
        <Final action={action} />
      </main>
      <Footer action={action} />
    </div>
  );
}
