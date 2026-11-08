import { Section } from "@shared/ui/section";

import { capabilitiesStyles } from "./styles";

export function HomeCapabilitiesSection() {
  return (
    <Section asChild>
      <section aria-label="What you can include" className={capabilitiesStyles.element1}>
        <span>A PLACE FOR</span>
        <span>Your projects</span>
        <i aria-hidden="true">✳</i>
        <span>Your experience</span>
        <i aria-hidden="true">✳</i>
        <span>Your personality</span>
        <i aria-hidden="true">✳</i>
        <span>Your next chapter</span>
      </section>
    </Section>
  );
}
