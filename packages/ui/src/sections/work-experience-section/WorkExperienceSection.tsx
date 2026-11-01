import { SectionPresentation } from "../presenter";
import type { SectionProps } from "../types";

export function WorkExperienceSection(props: SectionProps) {
  return <SectionPresentation {...props} type="work-experience" />;
}
