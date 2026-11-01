import { SectionPresentation } from "../../presenter/presenter";
import type { SectionProps } from "../../types";

export function PinterestSection(props: SectionProps) {
  return <SectionPresentation {...props} type="pinterest" />;
}
