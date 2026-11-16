import { SectionPresentation } from "../section-presentation";
import type { SectionProps } from "../types";

export function LegalTextSection(props: SectionProps) {
  return <SectionPresentation {...props} type="legal-text" />;
}
