import { SectionPresentation } from "../presenter";
import type { SectionProps } from "../types";

export function TechnicalSkillsSection(props: SectionProps) {
  return <SectionPresentation {...props} type="technical-skills" />;
}
