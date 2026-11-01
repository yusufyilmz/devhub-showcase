import { SectionPresentation } from "../presenter";
import type { SectionProps } from "../types";

export function TimelineSection(props: SectionProps) {
  return <SectionPresentation {...props} type="timeline" />;
}
