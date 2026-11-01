import { SectionPresentation } from "../presenter";
import type { SectionProps } from "../types";

export function QuickstartSection(props: SectionProps) {
  return <SectionPresentation {...props} type="quickstart" />;
}
