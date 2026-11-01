import { SectionPresentation } from "../../presenter/presenter";
import type { SectionProps } from "../../types";

export function YouTubeSection(props: SectionProps) {
  return <SectionPresentation {...props} type="youtube" />;
}
