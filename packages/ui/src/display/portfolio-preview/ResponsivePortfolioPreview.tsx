"use client";
import "./preview.css";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { useIsMobile } from "@shared/runtime/browser";

import { Button } from "../../buttons/button/Button";
import { preparePreviewFrame } from "./frame";
import { previewDocument, previewSizeLabels, previewSizes, previewWidthStyle } from "./styles";
import type { ResponsivePortfolioPreviewProps } from "./types";

export function ResponsivePortfolioPreview({
  children,
  appearance,
  defaultOpen = false,
}: ResponsivePortfolioPreviewProps) {
  const [open, setOpen] = useState(defaultOpen);
  const isMobile = useIsMobile();
  const [selectedSize, setSize] = useState<keyof typeof previewSizes | null>(null);
  const size = selectedSize ?? (isMobile ? "Mobile" : "Desktop");
  const [doc, setDocument] = useState<Document | null>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  useEffect(() => {
    if (!open) return;
    const content = frame.current?.contentDocument;
    // A server-rendered open frame can finish loading before hydration attaches onLoad.
    if (content?.readyState === "complete") setDocument(content);
  }, [open]);
  useEffect(() => {
    if (!doc) return;
    const sync = () => preparePreviewFrame(doc, appearance);
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(document.head, { childList: true });
    observer.observe(document.documentElement, {
      attributeFilter: ["data-theme"],
      attributes: true,
    });
    return () => observer.disconnect();
  }, [appearance, doc]);
  const target = doc?.getElementById("portfolio-preview-root");
  return (
    <details
      className="draft-preview"
      onToggle={(event) => {
        setOpen(event.currentTarget.open);
        if (!event.currentTarget.open) setDocument(null);
      }}
      open={open}
    >
      <summary>Preview your draft</summary>
      <p>
        Private layout preview of unsaved changes. External links, downloads and theme controls are
        disabled. This does not save or publish.
      </p>
      {open && (
        <>
          <fieldset className="draft-preview-sizes">
            <legend className="sr-only">Preview sizes</legend>
            {previewSizeLabels.map((value) => (
              <Button
                aria-pressed={size === value}
                key={value}
                onClick={() => setSize(value)}
                type="button"
                variant="outline"
              >
                {value} · {previewSizes[value]}px
              </Button>
            ))}
          </fieldset>
          <div className="draft-preview-scroll">
            <iframe
              onLoad={() => setDocument(frame.current?.contentDocument ?? null)}
              ref={frame}
              sandbox="allow-same-origin"
              srcDoc={previewDocument}
              style={previewWidthStyle(previewSizes[size])}
              title="Private draft preview"
            />
          </div>
          {target &&
            createPortal(
              <div
                onClickCapture={(event) => {
                  const link = (event.target as HTMLElement).closest?.("a");
                  if (!link) return;
                  event.preventDefault();
                  const href = link.getAttribute("href");
                  if (href?.startsWith("#")) doc?.getElementById(href.slice(1))?.scrollIntoView();
                }}
                onSubmitCapture={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                }}
              >
                {children}
              </div>,
              target,
            )}
        </>
      )}
    </details>
  );
}
