"use client";

import Link from "next/link";
import type React from "react";
import { useState } from "react";

import { Spinner } from "../../feedback/spinner";
import { iFramePreviewStyles } from "./styles";
import type { IFramePreviewProps } from "./types";

export const IFramePreview: React.FC<IFramePreviewProps> = ({ url }) => {
  const [loading, setLoading] = useState(true);
  const [error, showError] = useState(false);

  const handleLoad = () => {
    setLoading(false);
  };

  const handleError = () => {
    showError(true);
    setLoading(false);
  };

  const IFrame = url ? (
    <a
      aria-label="Open website preview"
      className={iFramePreviewStyles.element1}
      href={url}
      rel="noopener noreferrer"
      target="_blank"
    >
      <iframe
        className={iFramePreviewStyles.element2}
        id="iframe"
        onError={handleError}
        onLoad={handleLoad}
        sandbox="allow-scripts"
        src={url ?? null}
        title="Website Preview"
      />
    </a>
  ) : null;

  return (
    <div className={iFramePreviewStyles.element3}>
      {loading && !error && (
        <div className={iFramePreviewStyles.element4}>
          <Spinner />
        </div>
      )}
      {!error ? (
        IFrame
      ) : (
        <div className={iFramePreviewStyles.element5}>
          <p className={iFramePreviewStyles.element6}>Unable to load the website preview.</p>
          <Link
            className={iFramePreviewStyles.element7}
            href={url}
            rel="noopener noreferrer"
            target="_blank"
          >
            Click here to visit the website
          </Link>
        </div>
      )}
    </div>
  );
};
