import { CollectionView } from "../shared/presenter";
import type { SectionProps } from "../types";
export function MasonryGrid(props: SectionProps) {
  return (
    <CollectionView
      {...props}
      type="gallery-grid"
      section={{ ...props.section, renderer: "masonry" }}
    />
  );
}
