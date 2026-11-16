import { SectionPresentation } from "../section-presentation";
import type { SectionProps } from "../types";

export function WorkExperienceSection(props: SectionProps) {
  return <SectionPresentation {...props} type="work-experience" />;
}
