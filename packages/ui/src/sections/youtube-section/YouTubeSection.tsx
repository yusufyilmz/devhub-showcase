import { SectionPresentation } from "../presenter";
import type { SectionProps } from "../types";

export function YouTubeSection(props: SectionProps) {
  return <SectionPresentation {...props} type="youtube" />;
}
