import { SectionPresentation } from "../section-presentation";
import type { SectionProps } from "../types";

export function MenuSection(props: SectionProps) {
  return <SectionPresentation {...props} type="menu" />;
}
