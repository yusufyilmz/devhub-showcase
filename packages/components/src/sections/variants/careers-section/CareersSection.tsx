import { SectionPresentation } from "../../presenter/presenter";
import type { SectionProps } from "../../types";

export function CareersSection(props: SectionProps) {
  return <SectionPresentation {...props} type="careers" />;
}
