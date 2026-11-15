import { SectionPresentation } from "../section-presentation";
import type { SectionProps } from "../types";

export function ContactInfoSection(props: SectionProps) {
  return <SectionPresentation {...props} type="contact-info" />;
}
