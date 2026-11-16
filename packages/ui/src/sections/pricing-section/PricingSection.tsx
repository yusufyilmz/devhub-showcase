import { PlanComparison } from "../plans-section/PlanComparison";
import { SectionPresentation } from "../section-presentation";
import type { SectionProps } from "../types";

export function PricingSection(props: SectionProps) {
  if (props.section.options?.layout === "pricing-comparison")
    return <PlanComparison {...props} type="pricing" />;
  return <SectionPresentation {...props} type="pricing" />;
}
