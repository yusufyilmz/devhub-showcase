import { SectionPresentation } from "../presenter";
import type { SectionProps } from "../types";

export function AboutHeroSection(props: SectionProps) {
  return <SectionPresentation {...props} type="about-hero" />;
}
