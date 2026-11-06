import { SectionPresentation } from "../section-presentation";
import type { SectionProps } from "../types";

export function AboutHeroSection(props: SectionProps) {
  return <SectionPresentation {...props} type="about-hero" />;
}
