import { SectionPresentation } from "../presenter";
import type { SectionProps } from "../types";

export function AccordionSection(props: SectionProps) {
  return <SectionPresentation {...props} type="accordion" />;
}
