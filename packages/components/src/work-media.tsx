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
  const video = youtubeId && /^[a-zA-Z0-9_-]{11}$/.test(youtubeId) ? youtubeId : null;
  return (
    <div className="work-media">
      {imageUrl && /^https?:\/\//i.test(imageUrl) && (
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
