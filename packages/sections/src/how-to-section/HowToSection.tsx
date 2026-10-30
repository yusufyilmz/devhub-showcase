import { SectionPresentation } from "../shared/presenter";
import type { SectionProps } from "../types";
export function HowToSection(props: SectionProps) {
  return <SectionPresentation {...props} type="how-to" />;
}
