import { SectionPresentation } from "../../presenter/presenter";
import type { SectionProps } from "../../types";

export function ShowcaseSection(props: SectionProps) {
  return <SectionPresentation {...props} type="showcase" />;
}
