"use client";
import "./work-media.css";

import { useState } from "react";

import { getSocialWork } from "@shared/config";

import { Button } from "../../buttons/button";
import { workMediaStyles } from "./styles";
import type { VideoPlayerOptions, WorkMediaOptions } from "./types";

/** A changed source gets fresh consent and loading state. Never fetch a provider on mount. */
export function WorkMedia(props: WorkMediaOptions) {
  return (
    <MediaContent key={`${props.youtubeId}:${props.imageUrl}:${props.sourceUrl}`} {...props} />
  );
}
function MediaContent(props: WorkMediaOptions) {
  const { title, imageUrl, youtubeId, sourceUrl } = props;
  const [imageFailed, setImageFailed] = useState(false);
  const video = youtubeId && /^[a-zA-Z0-9_-]{11}$/.test(youtubeId) ? youtubeId : null;
  const work = getSocialWork(sourceUrl ?? "");
  const image = imageUrl && (/^https?:\/\//i.test(imageUrl) || /^\/(?!\/)/.test(imageUrl));
  return (
    <div className={workMediaStyles.element1}>
      {image && !imageFailed && (
        <img
          alt={title}
          height={600}
          loading="lazy"
          onError={() => setImageFailed(true)}
          referrerPolicy="no-referrer"
          src={imageUrl}
          width={800}
        />
      )}
      {imageFailed && (
        <p role="status">
          Image unavailable: {title}. The description and original work remain available.
        </p>
      )}
      {video && <VideoPlayer {...props} video={video} />}
      {work && work.provider !== "youtube" && (
        <>
          <p className="media-notice">
            Selected public work on {work.provider === "instagram" ? "Instagram" : "Pinterest"}.
            Open the original to view it; no account feed or tracking script is loaded here.
          </p>
          <Button
            className={workMediaStyles.action}
            href={`https://www.${work.provider}.com${work.id}`}
            rel="noopener noreferrer"
            target="_blank"
            variant="outline"
          >
            Open original: {title} ↗
          </Button>
        </>
      )}
    </div>
  );
}
function VideoPlayer({
  video,
  title,
  loadLabel = "Load YouTube video",
  unloadLabel = "Unload video",
}: VideoPlayerOptions) {
  const [loaded, setLoaded] = useState(false);
  const [ready, setReady] = useState(false);
  const status = ready
    ? "If playback is unavailable or blocked, open the original video below."
    : "Loading YouTube. If it is blocked or unavailable, open the original below.";
  return (
    <>
      {loaded ? (
        <>
          {
            <iframe
              allow="encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
              loading="lazy"
              onLoad={() => setReady(true)}
              referrerPolicy="strict-origin-when-cross-origin"
              src={`https://www.youtube-nocookie.com/embed/${video}`}
              title={title}
            />
          }
          <p role="status">{status}</p>
          <Button
            className={workMediaStyles.action}
            onClick={() => {
              setLoaded(false);
              setReady(false);
            }}
            type="button"
            variant="outline"
          >
            {unloadLabel}
          </Button>
        </>
      ) : (
        <>
          <p className="media-notice">
            Loading this video connects to YouTube. You can open the original instead.
          </p>
          <Button onClick={() => setLoaded(true)} type="button">
            {loadLabel}: {title}
          </Button>
        </>
      )}
      <Button
        className={workMediaStyles.action}
        href={`https://www.youtube.com/watch?v=${video}`}
        rel="noopener noreferrer"
        target="_blank"
        variant="outline"
      >
        Open original: {title} ↗
      </Button>
    </>
  );
}
