import { CollectionView } from "../collection-view/CollectionView";
import type { SectionProps } from "../types";

export function Posts(props: SectionProps) {
  return <CollectionView {...props} type="posts-grid" />;
}
