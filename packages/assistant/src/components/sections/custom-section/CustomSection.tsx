import { SectionPresentation } from "../section-presentation";
import type { SectionProps } from "../types";

export function CustomSection(props: SectionProps) {
  return <SectionPresentation {...props} type="custom" />;
}
