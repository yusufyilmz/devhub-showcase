import { CollectionView } from "../shared/presenter";
import type { SectionProps } from "../types";
export function MasonryGrid(props: SectionProps) {
  return (
    <CollectionView
      {...props}
      section={{ ...props.section, renderer: "masonry" }}
      type="gallery-grid"
    />
  );
}
