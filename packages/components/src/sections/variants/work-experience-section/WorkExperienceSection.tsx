import { SectionPresentation } from "../../presenter/presenter";
import type { SectionProps } from "../../types";

export function WorkExperienceSection(props: SectionProps) {
  return <SectionPresentation {...props} type="work-experience" />;
}
