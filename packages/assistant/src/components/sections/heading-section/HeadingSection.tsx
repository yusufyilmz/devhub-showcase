import { SectionPresentation } from "../section-presentation";
import type { SectionProps } from "../types";

export function HeadingSection(props: SectionProps) {
  return <SectionPresentation {...props} type="heading" />;
}
