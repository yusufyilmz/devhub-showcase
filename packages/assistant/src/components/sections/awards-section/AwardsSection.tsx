import { SectionPresentation } from "../section-presentation";
import type { SectionProps } from "../types";

export function AwardsSection(props: SectionProps) {
  return <SectionPresentation {...props} type="awards" />;
}
