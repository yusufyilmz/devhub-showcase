"use client";

import { ArrowLeft, ArrowRight, X } from "lucide-react";

import { Button } from "../../buttons/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "../dialog/Dialog";
import { galleryLightboxStyles } from "./styles";
import type { GalleryLightboxOptions } from "./types";

export function GalleryLightbox({ items, index, onIndexChange }: GalleryLightboxOptions) {
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
          className={galleryLightboxStyles.dialog}
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
          showCloseButton={false}
        >
          <header className={galleryLightboxStyles.header}>
            <DialogTitle>{active.title}</DialogTitle>
            <DialogDescription>{active.description || "Gallery preview"}</DialogDescription>
            <DialogClose asChild>
              <Button
                aria-label="Close"
                className={galleryLightboxStyles.close}
                size="icon"
                variant="ghost"
              >
                <X aria-hidden="true" />
              </Button>
            </DialogClose>
          </header>
          <div className={galleryLightboxStyles.stage} key={active.id}>
            {active.content}
          </div>
          <nav aria-label="Gallery navigation" className={galleryLightboxStyles.controls}>
            <Button
              aria-label="Previous item"
              disabled={index === 0}
              onClick={() => move(-1)}
              size="icon"
              variant="outline"
            >
              <ArrowLeft aria-hidden="true" />
            </Button>
            <span aria-live="polite" className="px-xs text-sm text-muted-foreground tabular-nums">
              {(index ?? 0) + 1} / {items.length}
            </span>
            <Button
              aria-label="Next item"
              disabled={index === items.length - 1}
              onClick={() => move(1)}
              size="icon"
              variant="outline"
            >
              <ArrowRight aria-hidden="true" />
            </Button>
            {active.href && (
              <Button href={active.href} variant="outline">
                Open full page ↗
              </Button>
            )}
          </nav>
          <nav aria-label="Gallery thumbnails" className={galleryLightboxStyles.thumbnails}>
            {items.map((item, itemIndex) => (
              <Button
                aria-label={`Show ${item.title}`}
                aria-pressed={itemIndex === index}
                className={galleryLightboxStyles.thumbnail}
                key={item.id}
                onClick={() => onIndexChange(itemIndex)}
                variant="outline"
              >
                <span aria-hidden="true" className={galleryLightboxStyles.thumbnailArt}>
                  {item.thumbnail}
                </span>
                <span className={galleryLightboxStyles.thumbnailTitle}>{item.title}</span>
              </Button>
            ))}
          </nav>
        </DialogContent>
      )}
    </Dialog>
  );
}

export type { GalleryLightboxItem } from "./types";
