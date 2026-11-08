import { SectionPresentation } from "../section-presentation";
import type { SectionProps } from "../types";

export function AboutSection(props: SectionProps) {
  return <SectionPresentation {...props} type="about" />;
}
