"use client";
import { type ReactNode, useEffect, useRef, useState } from "react";
export type HeroMedia = {
  kind: "image" | "video";
  url: string;
  poster?: string;
  position: "center" | "top" | "bottom";
  overlay: "soft" | "strong";
};
export function HeroSurface({
  media,
  children,
  labels = { play: "Play background video", pause: "Pause background video" },
}: {
  media?: HeroMedia;
  children: ReactNode;
  labels?: { play: string; pause: string };
}) {
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    const node = video.current;
    if (!node || media?.kind !== "video") return;
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
  }, [media?.kind, media?.url]);
  if (!media || !/^https?:\/\//i.test(media.url)) return <>{children}</>;
  const position = { objectPosition: media.position };
  return (
    <div className="hero-surface" data-overlay={media.overlay}>
      {media.kind === "image" ? (
        <img
          className="hero-surface-media"
          src={media.url}
          alt=""
          style={position}
          referrerPolicy="no-referrer"
        />
      ) : (
        <>
          {media.poster && /^https?:\/\//i.test(media.poster) && (
            <img
              className="hero-surface-media"
              src={media.poster}
              alt=""
              style={position}
              referrerPolicy="no-referrer"
            />
          )}
          <video
            className="hero-surface-media hero-surface-video"
            ref={video}
            src={media.url}
            muted
            loop
            playsInline
            preload="none"
            style={position}
            aria-hidden="true"
            tabIndex={-1}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
          />
        </>
      )}
      <div className="hero-surface-shade" />
      <div className="hero-surface-content">{children}</div>
      {media.kind === "video" && (
        <button
          className="hero-surface-toggle"
          type="button"
          onClick={() => {
            const node = video.current;
            if (node?.paused) node.play().catch(() => {});
            else node?.pause();
          }}
        >
          {playing ? labels.pause : labels.play}
        </button>
      )}
    </div>
  );
}
