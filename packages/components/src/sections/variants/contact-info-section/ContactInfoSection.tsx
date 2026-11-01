import { SectionPresentation } from "../../presenter/presenter";
import type { SectionProps } from "../../types";

export function ContactInfoSection(props: SectionProps) {
  return <SectionPresentation {...props} type="contact-info" />;
}
