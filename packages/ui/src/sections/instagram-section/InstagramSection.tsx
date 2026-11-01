import { SectionPresentation } from "../presenter";
import type { SectionProps } from "../types";

export function InstagramSection(props: SectionProps) {
  return <SectionPresentation {...props} type="instagram" />;
}
