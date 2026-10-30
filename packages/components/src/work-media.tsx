"use client";
import { useState } from "react";
/** No platform request or player is created until the visitor asks to load it. */
export function WorkMedia({
  title,
  imageUrl,
  youtubeId,
  loadLabel = "Load YouTube video",
  unloadLabel = "Unload video",
}: {
  title: string;
  imageUrl?: string;
  youtubeId?: string;
  loadLabel?: string;
  unloadLabel?: string;
}) {
  const [loaded, setLoaded] = useState(false);
  const video =
    youtubeId && /^[a-zA-Z0-9_-]{11}$/.test(youtubeId) ? youtubeId : null;
  return (
    <div className="work-media">
      {imageUrl && /^https?:\/\//i.test(imageUrl) && (
        <img
          src={imageUrl}
          alt={title}
          width={800}
          height={600}
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      )}
      {video &&
        (loaded ? (
          <>
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${video}`}
              title={title}
              allow="encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
            <button type="button" onClick={() => setLoaded(false)}>
              {unloadLabel}
            </button>
          </>
        ) : (
          <button type="button" onClick={() => setLoaded(true)}>
            {loadLabel}: {title}
          </button>
        ))}
    </div>
  );
}
