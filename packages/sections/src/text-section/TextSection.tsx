import { SectionPresentation } from "../shared/presenter";
import type { SectionProps } from "../types";
export function TextSection(props: SectionProps) {
  return <SectionPresentation {...props} type="text" />;
}
