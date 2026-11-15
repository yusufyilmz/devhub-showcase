import { SectionPresentation } from "../section-presentation";
import type { SectionProps } from "../types";

export function StudiesSection(props: SectionProps) {
  return <SectionPresentation {...props} type="studies" />;
}
