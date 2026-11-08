"use client";

import "../portfolio/portfolio.css";

import { useEffect, useRef, useState } from "react";

import { Button as LibraryButton } from "../../buttons/button/Button";
import { heroSurfaceStyles } from "./styles";
import type { HeroSurfaceOptions } from "./types";

export function HeroSurface({
  media,
  children,
  labels = { pause: "Pause background video", play: "Play background video" },
}: HeroSurfaceOptions) {
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const mediaUrl = media?.url;
  useEffect(() => {
    const node = video.current;
    if (!node || media?.kind !== "video" || !mediaUrl || !/^https?:\/\//i.test(mediaUrl)) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      if (motion.matches) node.pause();
      else node.play().catch(() => {});
    };
    apply();
    motion.addEventListener("change", apply);
    return () => {
      motion.removeEventListener("change", apply);
      node.pause();
    };
  }, [media?.kind, mediaUrl]);
  if (!media || !/^https?:\/\//i.test(media.url))
    return <div className={heroSurfaceStyles.element1}>{children}</div>;
  const position = { objectPosition: media.position };
  return (
    <div className={heroSurfaceStyles.element2} data-overlay={media.overlay}>
      {media.kind === "image" ? (
        <img
          alt=""
          className={heroSurfaceStyles.element3}
          referrerPolicy="no-referrer"
          src={media.url}
          style={position}
        />
      ) : (
        <>
          {media.poster && /^https?:\/\//i.test(media.poster) && (
            <img
              alt=""
              className={heroSurfaceStyles.element4}
              referrerPolicy="no-referrer"
              src={media.poster}
              style={position}
            />
          )}
          <video
            aria-hidden="true"
            className={heroSurfaceStyles.element5}
            loop
            muted
            onPause={() => setPlaying(false)}
            onPlay={() => setPlaying(true)}
            playsInline
            preload="none"
            ref={video}
            src={media.url}
            style={position}
            tabIndex={-1}
          />
        </>
      )}
      <div className={heroSurfaceStyles.element6} />
      <div className={heroSurfaceStyles.element7}>{children}</div>
      {media.kind === "video" && (
        <LibraryButton
          className={heroSurfaceStyles.element8}
          onClick={() => {
            const node = video.current;
            if (node?.paused) node.play().catch(() => {});
            else node?.pause();
          }}
          type="button"
          variant="unstyled"
        >
          {playing ? labels.pause : labels.play}
        </LibraryButton>
      )}
    </div>
  );
}

export type { HeroMedia } from "./types";
