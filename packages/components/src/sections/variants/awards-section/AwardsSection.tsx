import { SectionPresentation } from "../../presenter/presenter";
import type { SectionProps } from "../../types";

export function AwardsSection(props: SectionProps) {
  return <SectionPresentation {...props} type="awards" />;
}
