import { SectionPresentation } from "../section-presentation";
import type { SectionProps } from "../types";

export function TabsSection(props: SectionProps) {
  return <SectionPresentation {...props} type="tabs" />;
}
