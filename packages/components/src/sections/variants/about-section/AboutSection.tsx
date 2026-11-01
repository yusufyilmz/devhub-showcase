import { SectionPresentation } from "../../presenter/presenter";
import type { SectionProps } from "../../types";

export function AboutSection(props: SectionProps) {
  return <SectionPresentation {...props} type="about" />;
}
