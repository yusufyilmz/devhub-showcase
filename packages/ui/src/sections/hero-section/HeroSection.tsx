import { SectionPresentation } from "../section-presentation";
import type { SectionProps } from "../types";

export function HeroSection(props: SectionProps) {
  return <SectionPresentation {...props} type="hero" />;
}
