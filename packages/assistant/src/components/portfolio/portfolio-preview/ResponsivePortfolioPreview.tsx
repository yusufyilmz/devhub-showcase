"use client";
import "./preview.css";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { useIsMobile } from "@shared/runtime/browser";
import { Button } from "@shared/ui/button";

import { preparePreviewFrame } from "./frame";
import { previewDocument, previewSizeLabels, previewSizes, previewWidthStyle } from "./styles";
import type { ResponsivePortfolioPreviewProps } from "./types";

export function ResponsivePortfolioPreview({
  children,
  appearance,
  arrange,
  initiallyOpen = false,
  openRequest,
}: ResponsivePortfolioPreviewProps) {
  const [open, setOpen] = useState(initiallyOpen);
  const isMobile = useIsMobile();
  const [selectedSize, setSize] = useState<keyof typeof previewSizes | null>(null);
  const size = selectedSize ?? (isMobile ? "Mobile" : "Desktop");
  const [doc, setDocument] = useState<Document | null>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const [availableWidth, setAvailableWidth] = useState(0);
  const width = previewSizes[size];
  const scale = availableWidth ? Math.min(1, availableWidth / width) : 1;

  useEffect(() => {
    const container = viewport.current;
    if (!open || !container) return;
    const measure = () => setAvailableWidth(container.clientWidth);
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    return () => observer.disconnect();
  }, [open]);
  useEffect(() => {
    if (openRequest) setOpen(true);
  }, [openRequest]);
  useEffect(() => {
    const loaded = frame.current?.contentDocument;
    if (open && loaded?.getElementById("portfolio-preview-root")) setDocument(loaded);
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
      id="portfolio-draft-preview"
      onToggle={(event) => {
        setOpen(event.currentTarget.open);
        if (!event.currentTarget.open) setDocument(null);
      }}
      open={open}
    >
      <summary>Preview your draft</summary>
      <p>
        {arrange?.active
          ? "Drag section handles in the preview to change your draft. Save your changes before reviewing publication."
          : "Private layout preview of unsaved changes. External links, downloads and theme controls are disabled. This does not save or publish."}
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
          {arrange && (
            <div className="draft-preview-sizes">
              <Button
                aria-pressed={arrange.active}
                disabled={arrange.disabled}
                onClick={arrange.onToggle}
                type="button"
                variant="outline"
              >
                Arrange sections
              </Button>
              {arrange.active && arrange.saveAction}
            </div>
          )}
          <div className="draft-preview-scroll" ref={viewport}>
            <iframe
              onLoad={() => setDocument(frame.current?.contentDocument ?? null)}
              ref={frame}
              sandbox="allow-same-origin"
              srcDoc={previewDocument}
              style={{ ...previewWidthStyle(width), zoom: scale }}
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
