import { SectionPresentation } from "../section-presentation";
import type { SectionProps } from "../types";

export function TextSection(props: SectionProps) {
  return <SectionPresentation {...props} type="text" />;
}
