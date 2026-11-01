import { SectionPresentation } from "../../presenter/presenter";
import type { SectionProps } from "../../types";

export function NewsletterSection(props: SectionProps) {
  return <SectionPresentation {...props} type="newsletter" />;
}
