import { SectionPresentation } from "../section-presentation";
import type { SectionProps } from "../types";

export function PostsGridSection(props: SectionProps) {
  return <SectionPresentation {...props} type="posts-grid" />;
}
