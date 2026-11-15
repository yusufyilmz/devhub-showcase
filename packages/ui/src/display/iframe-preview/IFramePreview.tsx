"use client";

import { useState } from "react";

import { Button } from "../../buttons/button";
import { Spinner } from "../../feedback/spinner";
import { NativeSelect } from "../../forms/native-select";
import { iFramePreviewStyles } from "./styles";
import type { IFramePreviewProps } from "./types";

export function IFramePreview({ url, scale = 1 }: IFramePreviewProps) {
  if (!/^(https?:\/\/|\/(?![/\\])|about:blank$)/i.test(url)) {
    return <p className="text-muted-foreground text-sm">Enter a website URL to preview it.</p>;
  }
  const initialScale = Number.isFinite(scale) ? Math.min(1, Math.max(0.25, scale)) : 1;
  return <PreviewFrame key={`${url}:${initialScale}`} scale={initialScale} url={url} />;
}

function PreviewFrame({ url, scale }: Required<IFramePreviewProps>) {
  const [zoom, setZoom] = useState(scale);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const zoomLevels = [...new Set([0.5, 0.75, 1, scale])].sort((a, b) => a - b);

  return (
    <div className={iFramePreviewStyles.container}>
      <div className={iFramePreviewStyles.toolbar}>
        <NativeSelect
          aria-label="Preview scale"
          onChange={(event) => setZoom(Number(event.target.value))}
          value={zoom}
        >
          {zoomLevels.map((level) => (
            <option key={level} value={level}>
              {Math.round(level * 100)}%
            </option>
          ))}
        </NativeSelect>
        <Button href={url} rel="noopener noreferrer" size="sm" target="_blank" variant="outline">
          Open website preview
        </Button>
      </div>
      <div aria-busy={status === "loading"} className={iFramePreviewStyles.viewport}>
        {status === "error" ? (
          <p className={iFramePreviewStyles.status}>
            Unable to load this preview. Open the website to view it.
          </p>
        ) : (
          <iframe
            className={iFramePreviewStyles.frame}
            onError={() => setStatus("error")}
            onLoad={() => setStatus("ready")}
            sandbox="allow-scripts"
            src={url}
            style={{
              height: `${100 / zoom}%`,
              transform: `scale(${zoom})`,
              width: `${100 / zoom}%`,
            }}
            tabIndex={-1}
            title="Website preview"
          />
        )}
        {status === "loading" && (
          <div className={iFramePreviewStyles.status}>
            <Spinner />
          </div>
        )}
      </div>
    </div>
  );
}
