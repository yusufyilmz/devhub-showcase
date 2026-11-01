import { SectionPresentation } from "../../presenter/presenter";
import type { SectionProps } from "../../types";

export function CTASection(props: SectionProps) {
  return <SectionPresentation {...props} type="cta" />;
}
