import { SectionPresentation } from "../section-presentation";
import type { SectionProps } from "../types";

export function ProjectsSection(props: SectionProps) {
  return <SectionPresentation {...props} type="projects" />;
}
