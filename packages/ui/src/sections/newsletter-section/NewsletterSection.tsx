import { SectionPresentation } from "../presenter";
import type { SectionProps } from "../types";

export function NewsletterSection(props: SectionProps) {
  return <SectionPresentation {...props} type="newsletter" />;
}
