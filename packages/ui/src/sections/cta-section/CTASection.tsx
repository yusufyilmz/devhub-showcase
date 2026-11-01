import { SectionPresentation } from "../presenter";
import type { SectionProps } from "../types";

export function CTASection(props: SectionProps) {
  return <SectionPresentation {...props} type="cta" />;
}
