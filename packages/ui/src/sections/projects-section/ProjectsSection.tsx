import { SectionPresentation } from "../section-presentation";
import type { SectionProps } from "../types";

export function ProjectsSectionPresentation(props: SectionProps) {
  return <SectionPresentation {...props} type="projects" />;
}
