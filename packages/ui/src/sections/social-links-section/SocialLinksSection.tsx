import { SectionPresentation } from "../presenter";
import type { SectionProps } from "../types";

export function SocialLinksSection(props: SectionProps) {
  return <SectionPresentation {...props} type="social-links" />;
}
