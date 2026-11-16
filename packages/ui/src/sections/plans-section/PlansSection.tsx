import { SectionPresentation } from "../section-presentation";
import type { SectionProps } from "../types";
import { PlanComparison } from "./PlanComparison";

export function PlansSection(props: SectionProps) {
  if (props.section.options?.layout === "pricing-comparison")
    return <PlanComparison {...props} type="plans" />;
  return <SectionPresentation {...props} type="plans" />;
}
