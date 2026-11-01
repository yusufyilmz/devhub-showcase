import { SectionPresentation } from "../presenter";
import type { SectionProps } from "../types";

export function CareersSection(props: SectionProps) {
  return <SectionPresentation {...props} type="careers" />;
}
