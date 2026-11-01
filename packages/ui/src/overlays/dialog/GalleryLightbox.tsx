"use client";

import "./gallery-lightbox.css";

import type { ReactNode } from "react";

import { Button } from "../../buttons/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "./Dialog";

export type GalleryLightboxItem = {
  id: string;
  title: string;
  description?: string;
  thumbnail: ReactNode;
  content: ReactNode;
  href?: string;
};

export function GalleryLightbox({
  items,
  index,
  onIndexChange,
}: {
  items: GalleryLightboxItem[];
  index: number | null;
  onIndexChange: (index: number | null) => void;
}) {
  const active = index === null ? undefined : items[index];
  const move = (direction: number) => {
    if (index !== null) onIndexChange(Math.max(0, Math.min(items.length - 1, index + direction)));
  };
  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) onIndexChange(null);
      }}
      open={Boolean(active)}
    >
      {active && (
        <DialogContent
          className="gallery-lightbox"
          onKeyDown={(event) => {
            if (
              event.target instanceof HTMLElement &&
              event.target.closest("input, textarea, select")
            )
              return;
            if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
              event.preventDefault();
              move(event.key === "ArrowLeft" ? -1 : 1);
            }
          }}
        >
          <header className="gallery-lightbox-heading">
            <DialogTitle>{active.title}</DialogTitle>
            <DialogDescription>{active.description || "Gallery preview"}</DialogDescription>
          </header>
          <div className="gallery-lightbox-stage" key={active.id}>
            {active.content}
          </div>
          <nav aria-label="Gallery navigation" className="gallery-lightbox-controls">
            <Button
              aria-label="Previous item"
              disabled={index === 0}
              onClick={() => move(-1)}
              variant="outline"
            >
              ←
            </Button>
            <span aria-live="polite">
              {(index ?? 0) + 1} / {items.length}
            </span>
            <Button
              aria-label="Next item"
              disabled={index === items.length - 1}
              onClick={() => move(1)}
              variant="outline"
            >
              →
            </Button>
            {active.href && (
              <Button href={active.href} variant="outline">
                Open full page ↗
              </Button>
            )}
          </nav>
          <nav aria-label="Gallery thumbnails" className="gallery-lightbox-thumbnails">
            {items.map((item, itemIndex) => (
              <Button
                aria-label={`Show ${item.title}`}
                aria-pressed={itemIndex === index}
                className="gallery-lightbox-thumbnail"
                key={item.id}
                onClick={() => onIndexChange(itemIndex)}
                variant="outline"
              >
                {item.thumbnail}
              </Button>
            ))}
          </nav>
        </DialogContent>
      )}
    </Dialog>
  );
}
