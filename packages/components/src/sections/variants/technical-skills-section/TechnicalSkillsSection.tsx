import { SectionPresentation } from "../../presenter/presenter";
import type { SectionProps } from "../../types";

export function TechnicalSkillsSection(props: SectionProps) {
  return <SectionPresentation {...props} type="technical-skills" />;
}
