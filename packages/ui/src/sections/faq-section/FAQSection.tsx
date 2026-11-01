import { SectionPresentation } from "../presenter";
import type { SectionProps } from "../types";

export function FAQSection(props: SectionProps) {
  return <SectionPresentation {...props} type="faq" />;
}
