import { SectionPresentation } from "../../presenter/presenter";
import type { SectionProps } from "../../types";

export function PlansSection(props: SectionProps) {
  return <SectionPresentation {...props} type="plans" />;
}
