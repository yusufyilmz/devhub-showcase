import { CollectionView } from "../../collections/CollectionView";
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
