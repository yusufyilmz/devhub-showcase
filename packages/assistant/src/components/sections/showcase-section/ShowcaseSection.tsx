import { SectionPresentation } from "../section-presentation";
import type { SectionProps } from "../types";

export function ShowcaseSection(props: SectionProps) {
  return <SectionPresentation {...props} type="showcase" />;
}
