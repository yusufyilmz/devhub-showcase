"use client";

import { useState } from "react";

import { Button } from "../../buttons/button";
import { GalleryLightbox } from "../../overlays/dialog";
import { galleryCollectionStyles } from "./styles";
import type { GalleryCollectionOptions } from "./types";

export function GalleryCollection({ section }: GalleryCollectionOptions) {
  const [index, setIndex] = useState<number | null>(null);
  const items = section.items.filter(
    (item) => item.imageUrl && /^https?:\/\//i.test(item.imageUrl),
  );
  const image = (item: (typeof items)[number]) => (
    <img alt={item.title} loading="lazy" src={item.imageUrl} />
  );
  return (
    <>
      <div className={galleryCollectionStyles.element1}>
        {items.map((item, itemIndex) => (
          <Button
            aria-label={`View ${item.title}`}
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
