import { SectionPresentation } from "../../presenter/presenter";
import type { SectionProps } from "../../types";

export function StudiesSection(props: SectionProps) {
  return <SectionPresentation {...props} type="studies" />;
}
