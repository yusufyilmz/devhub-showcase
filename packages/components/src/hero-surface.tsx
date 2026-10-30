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
  labels = { pause: "Pause background video", play: "Play background video" },
}: {
  media?: HeroMedia;
  children: ReactNode;
  labels?: { play: string; pause: string };
}) {
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
  if (!media || !/^https?:\/\//i.test(media.url)) return <>{children}</>;
  const position = { objectPosition: media.position };
  return (
    <div className="hero-surface" data-overlay={media.overlay}>
      {media.kind === "image" ? (
        <img
          alt=""
          className="hero-surface-media"
          referrerPolicy="no-referrer"
          src={media.url}
          style={position}
        />
      ) : (
        <>
          {media.poster && /^https?:\/\//i.test(media.poster) && (
            <img
              alt=""
              className="hero-surface-media"
              referrerPolicy="no-referrer"
              src={media.poster}
              style={position}
            />
          )}
          <video
            aria-hidden="true"
            className="hero-surface-media hero-surface-video"
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
      <div className="hero-surface-shade" />
      <div className="hero-surface-content">{children}</div>
      {media.kind === "video" && (
        <button
          className="hero-surface-toggle"
          onClick={() => {
            const node = video.current;
            if (node?.paused) node.play().catch(() => {});
            else node?.pause();
          }}
          type="button"
        >
          {playing ? labels.pause : labels.play}
        </button>
      )}
    </div>
  );
}
