import { SectionPresentation } from "../presenter";
import type { SectionProps } from "../types";

export function PricingSection(props: SectionProps) {
  return <SectionPresentation {...props} type="pricing" />;
}
