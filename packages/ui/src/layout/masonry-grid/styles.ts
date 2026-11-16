export const masonryGridStyles = {
  grid: "block w-full min-w-0 [column-gap:var(--masonry-gap)] [column-count:var(--masonry-columns-s)] md:[column-count:var(--masonry-columns-m)] lg:[column-count:var(--masonry-columns-l)]",
  item: "mb-(--masonry-gap) flow-root min-w-0 break-inside-avoid wrap-anywhere",
} as const;
