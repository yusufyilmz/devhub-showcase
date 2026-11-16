import { SectionPresentation } from "../section-presentation";
import type { SectionProps } from "../types";

export function BlogPageSection(props: SectionProps) {
  return <SectionPresentation {...props} type="blog-page" />;
}
