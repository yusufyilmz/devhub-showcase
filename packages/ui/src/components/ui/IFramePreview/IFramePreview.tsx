"use client";

import type React from "react";
import { useState } from "react";

import { CircularProgress as Spinner } from "@mui/material";
import Link from "next/link";

interface IFramePreviewProps {
  url: string;
}

export const IFramePreview: React.FC<IFramePreviewProps> = ({ url }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleLoad = () => {
    setLoading(false);
  };

  const handleError = () => {
    setError(true);
    setLoading(false);
  };

  const IFrame = url ? (
    <a
      aria-label="Open website preview"
      className="block overflow-y-auto"
      href={url}
      rel="noopener noreferrer"
      target="_blank"
    >
      <iframe
        className="w-full h-[100vh] transition-opacity duration-500 opacity-100 pointer-events-none"
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
    <div className="border rounded-lg shadow-lg overflow-hidden cursor-pointer relative">
      {loading && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/50">
          <Spinner />
        </div>
      )}
      {!error ? (
        IFrame
      ) : (
        <div className="flex flex-col items-center justify-center p-4">
          <p className="text-red-500">Unable to load the website preview.</p>
          <Link
            className="text-main-blue hover:underline"
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
