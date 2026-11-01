"use client";

import { useState } from "react";

import type { CustomSection } from "@shared/config";

import { Button } from "../../buttons/button";
import { GalleryLightbox } from "../../overlays/dialog";

export function GalleryCollection({ section }: { section: CustomSection }) {
  const [index, setIndex] = useState<number | null>(null);
  const items = section.items.filter(
    (item) => item.imageUrl && /^https?:\/\//i.test(item.imageUrl),
  );
  const image = (item: (typeof items)[number]) => (
    <img alt={item.title} loading="lazy" src={item.imageUrl} />
  );
  return (
    <>
      <div className="gallery-lightbox-grid">
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
