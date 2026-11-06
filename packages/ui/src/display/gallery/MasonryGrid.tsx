"use client";

import styles from "./Gallery.module.scss";

import Masonry from "react-masonry-css";

import { cn } from "cn";

import SmartImage from "../../assets/SmartImage";

export default function MasonryGrid({ images }: { images: Image[] }) {
  return (
    <Masonry
      breakpointCols={{
        default: 2,
        720: 1,
      }}
      className={cn(styles.masonryGrid)}
      columnClassName={styles.masonryGridColumn}
    >
      {images.map((image, index) => (
        <SmartImage
          priority={index < 10}
          sizes="(max-width: 560px) 100vw, 50vw"
          key={index}
          radius="m"
          aspectRatio={image.orientation === "horizontal" ? "16 / 9" : "3 / 4"}
          src={image.src}
          alt={image.alt}
          className={styles.gridItem}
        />
      ))}
    </Masonry>
  );
}
