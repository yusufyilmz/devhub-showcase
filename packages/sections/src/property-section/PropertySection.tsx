import { SectionPresentation } from "../shared/presenter";
import type { SectionProps } from "../types";
export function PropertySection(props: SectionProps) {
  return <SectionPresentation {...props} type="property" />;
}
