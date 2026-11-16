import { SectionPresentation } from "../section-presentation";
import type { SectionProps } from "../types";

export function PropertySection(props: SectionProps) {
  return <SectionPresentation {...props} type="property" />;
}
