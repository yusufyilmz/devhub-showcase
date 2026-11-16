"use client";

import { useState } from "react";

import { Button } from "../../buttons";
import { GalleryLightbox } from "../../overlays/dialog";
import { isSectionImage } from "../item-media/section-image";
import { galleryCollectionStyles } from "./styles";
import type { GalleryCollectionOptions } from "./types";

export function GalleryCollection({ section }: GalleryCollectionOptions) {
  const [index, setIndex] = useState<number | null>(null);
  const items = section.items.filter((item) => isSectionImage(item.imageUrl));
  const image = (item: (typeof items)[number]) => (
    <img alt={item.title} loading="lazy" src={item.imageUrl} />
  );
  return (
    <>
      <div className={galleryCollectionStyles.element1}>
        {items.map((item, itemIndex) => (
          <Button
            aria-label={`View ${item.title}`}
            className="grid h-auto min-w-0 grid-cols-[minmax(0,1fr)] gap-s rounded-lg border-border/75 bg-card p-sm text-start whitespace-normal wrap-anywhere hover:border-primary/40 [&_img]:aspect-[4/3] [&_img]:w-full [&_img]:rounded-md [&_img]:object-cover"
            key={item.id}
            onClick={() => setIndex(itemIndex)}
            variant="outline"
          >
            {image(item)}
            <span>{item.title}</span>
          </Button>
        ))}
      </div>
      <GalleryLightbox
        index={index}
        items={items.map((item) => ({
          content: image(item),
          description: item.body,
          id: item.id,
          thumbnail: image(item),
          title: item.title,
        }))}
        onIndexChange={setIndex}
      />
    </>
  );
}
