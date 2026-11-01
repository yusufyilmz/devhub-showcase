import { SectionPresentation } from "../presenter";
import type { SectionProps } from "../types";

export function HeadingSection(props: SectionProps) {
  return <SectionPresentation {...props} type="heading" />;
}
