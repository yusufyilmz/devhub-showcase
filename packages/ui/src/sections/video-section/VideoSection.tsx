import { SectionPresentation } from "../section-presentation";
import type { SectionProps } from "../types";

export function VideoSection(props: SectionProps) {
  return <SectionPresentation {...props} type="video" />;
}
