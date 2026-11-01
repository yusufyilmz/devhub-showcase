import { SectionPresentation } from "../../presenter/presenter";
import type { SectionProps } from "../../types";

export function InstagramSection(props: SectionProps) {
  return <SectionPresentation {...props} type="instagram" />;
}
