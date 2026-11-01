import { SectionPresentation } from "../../presenter/presenter";
import type { SectionProps } from "../../types";

export function HowToSection(props: SectionProps) {
  return <SectionPresentation {...props} type="how-to" />;
}
