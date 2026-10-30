import { SectionPresentation } from "../shared/presenter";
import type { SectionProps } from "../types";
export function SocialLinksSection(props: SectionProps) {
  return <SectionPresentation {...props} type="social-links" />;
}
