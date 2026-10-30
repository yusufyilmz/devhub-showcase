import { SectionPresentation } from "../shared/presenter";
import type { SectionProps } from "../types";
export function LegalTextSection(props: SectionProps) {
  return <SectionPresentation {...props} type="legal-text" />;
}
