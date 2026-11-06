import { CollectionView } from "../collection-view/CollectionView";
import type { SectionProps } from "../types";

export function MasonryGridSection(props: SectionProps) {
  return (
    <CollectionView
      {...props}
      section={{ ...props.section, renderer: "masonry" }}
      type="gallery-grid"
    />
  );
}
