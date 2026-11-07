export const masonryGridStyles = {
  grid: "block w-full min-w-0 [column-count:var(--masonry-columns)] [column-gap:var(--masonry-gap)] max-[1440px]:[column-count:var(--masonry-columns-l)] max-[1024px]:[column-count:var(--masonry-columns-m)] max-[768px]:[column-count:var(--masonry-columns-s)]",
  item: "flow-root min-w-0 break-inside-avoid mb-[var(--masonry-gap)]",
} as const;
