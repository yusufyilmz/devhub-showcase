import { SectionPresentation } from "../section-presentation";
import type { SectionProps } from "../types";

export function PricingSection(props: SectionProps) {
  return <SectionPresentation {...props} type="pricing" />;
}
