import { SectionPresentation } from "../section-presentation";
import type { SectionProps } from "../types";

export function GalleryGridSection(props: SectionProps) {
  return <SectionPresentation {...props} type="gallery-grid" />;
}
