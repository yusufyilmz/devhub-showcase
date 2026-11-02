"use client";

import { useState } from "react";

import { workMediaStyles } from "./styles";
import type { WorkMediaOptions } from "./types";
/** No platform request or player is created until the visitor asks to load it. */
export function WorkMedia({
  title,
  imageUrl,
  youtubeId,
  loadLabel = "Load YouTube video",
  unloadLabel = "Unload video",
}: WorkMediaOptions) {
  const [loaded, setLoaded] = useState(false);
  const video = youtubeId && /^[a-zA-Z0-9_-]{11}$/.test(youtubeId) ? youtubeId : null;
  return (
    <div className={workMediaStyles.element1}>
      {imageUrl && (/^https?:\/\//i.test(imageUrl) || /^\/(?!\/)/.test(imageUrl)) && (
        <img
          alt={title}
          height={600}
          loading="lazy"
          referrerPolicy="no-referrer"
          src={imageUrl}
          width={800}
        />
      )}
      {video &&
        (loaded ? (
          <>
            <iframe
              allow="encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
              src={`https://www.youtube-nocookie.com/embed/${video}`}
              title={title}
            />
            <button onClick={() => setLoaded(false)} type="button">
              {unloadLabel}
            </button>
          </>
        ) : (
          <button onClick={() => setLoaded(true)} type="button">
            {loadLabel}: {title}
          </button>
        ))}
    </div>
  );
}
