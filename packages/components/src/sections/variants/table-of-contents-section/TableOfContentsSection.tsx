import { SectionPresentation } from "../../presenter/presenter";
import type { SectionProps } from "../../types";

export function TableOfContentsSection(props: SectionProps) {
  return <SectionPresentation {...props} type="table-of-contents" />;
}
