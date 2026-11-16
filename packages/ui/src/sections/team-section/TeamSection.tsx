import { SectionPresentation } from "../section-presentation";
import type { SectionProps } from "../types";

export function TeamSection(props: SectionProps) {
  return <SectionPresentation {...props} type="team" />;
}
