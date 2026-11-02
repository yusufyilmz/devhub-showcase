// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ResponsivePortfolioPreview } from "./ResponsivePortfolioPreview";

describe("ResponsivePortfolioPreview", () => {
  afterEach(cleanup);

  it("does not mount a preview until opened, including empty legacy content", () => {
    render(<ResponsivePortfolioPreview>{null}</ResponsivePortfolioPreview>);
    expect(screen.queryByTitle("Private draft preview")).toBeNull();
    expect(screen.getByText("Preview your draft")).toBeDefined();
  });

  it("blocks preview form submissions from bubbling to the editor save form", async () => {
    const save = vi.fn();
    render(
      <form onSubmit={save}>
        <ResponsivePortfolioPreview>
          <form data-testid="preview-form">
            <button type="submit">Send inquiry</button>
            <a href="https://example.test/download">External download</a>
          </form>
        </ResponsivePortfolioPreview>
      </form>,
    );
    const details = screen.getByText("Preview your draft").closest("details");
    if (!details) throw new Error("Preview disclosure missing");
    details.open = true;
    fireEvent(details, new Event("toggle"));
    const frame = await screen.findByTitle<HTMLIFrameElement>("Private draft preview");
    expect(frame.getAttribute("sandbox")).toBe("allow-same-origin");
    await waitFor(() => expect(frame.contentDocument?.readyState).toBe("complete"));
    const doc = frame.contentDocument;
    if (!doc) throw new Error("Frame document missing");
    doc.body.innerHTML = '<div id="portfolio-preview-root"></div>';
    fireEvent.load(frame);
    fireEvent.click(screen.getByRole("button", { name: "Tablet · 768px" }));
    await waitFor(() => expect(doc.querySelector("form")).not.toBeNull());
    const form = doc.querySelector("form");
    if (!form) throw new Error("Preview form missing");
    expect(fireEvent.submit(form)).toBe(false);
    const link = doc.querySelector("a");
    if (!link) throw new Error("Preview link missing");
    expect(fireEvent.click(link)).toBe(false);
    expect(save).not.toHaveBeenCalled();
  });
});
