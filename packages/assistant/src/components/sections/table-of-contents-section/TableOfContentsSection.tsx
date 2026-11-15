import { SectionPresentation } from "../section-presentation";
import type { SectionProps } from "../types";

export function TableOfContentsSection(props: SectionProps) {
  return <SectionPresentation {...props} type="table-of-contents" />;
}
