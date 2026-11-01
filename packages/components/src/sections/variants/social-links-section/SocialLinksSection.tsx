import { SectionPresentation } from "../../presenter/presenter";
import type { SectionProps } from "../../types";

export function SocialLinksSection(props: SectionProps) {
  return <SectionPresentation {...props} type="social-links" />;
}
