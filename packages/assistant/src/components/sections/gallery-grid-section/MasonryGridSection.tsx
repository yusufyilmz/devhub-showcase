import { SectionPresentation } from "../section-presentation";
import type { SectionProps } from "../types";

export function MasonryGridSection(props: SectionProps) {
  return (
    <SectionPresentation
      {...props}
      section={{ ...props.section, renderer: "masonry" }}
      type="gallery-grid"
    />
  );
}
