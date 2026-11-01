import { SectionPresentation } from "../../presenter/presenter";
import type { SectionProps } from "../../types";

export function TeamSection(props: SectionProps) {
  return <SectionPresentation {...props} type="team" />;
}
