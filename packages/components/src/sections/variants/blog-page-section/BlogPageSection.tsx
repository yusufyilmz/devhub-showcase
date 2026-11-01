import { SectionPresentation } from "../../presenter/presenter";
import type { SectionProps } from "../../types";

export function BlogPageSection(props: SectionProps) {
  return <SectionPresentation {...props} type="blog-page" />;
}
