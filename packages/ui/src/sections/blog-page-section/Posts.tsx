import { CollectionView } from "../../collections/CollectionView";
import type { SectionProps } from "../types";

export function Posts(props: SectionProps) {
  return <CollectionView {...props} type="posts-grid" />;
}
