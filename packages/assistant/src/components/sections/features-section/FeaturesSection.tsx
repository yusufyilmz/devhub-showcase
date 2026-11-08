import { SectionPresentation } from "../section-presentation";
import type { SectionProps } from "../types";

export function FeaturesSection(props: SectionProps) {
  return <SectionPresentation {...props} type="features" />;
}
