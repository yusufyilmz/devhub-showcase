import { SectionPresentation } from "../section-presentation";
import type { SectionProps } from "../types";

export function InstagramSection(props: SectionProps) {
  return <SectionPresentation {...props} type="instagram" />;
}
