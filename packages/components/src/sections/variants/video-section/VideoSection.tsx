import { SectionPresentation } from "../../presenter/presenter";
import type { SectionProps } from "../../types";

export function VideoSection(props: SectionProps) {
  return <SectionPresentation {...props} type="video" />;
}
