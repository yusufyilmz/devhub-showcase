// @vitest-environment jsdom

import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ResponsivePortfolioPreview } from "./ResponsivePortfolioPreview";

describe("ResponsivePortfolioPreview", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "matchMedia",
      vi.fn(() => ({ addEventListener: vi.fn(), matches: false, removeEventListener: vi.fn() })),
    );
    vi.stubGlobal("innerWidth", 1440);
  });
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("does not mount a preview until opened, including empty legacy content", () => {
    render(<ResponsivePortfolioPreview>{null}</ResponsivePortfolioPreview>);
    expect(screen.queryByTitle("Private draft preview")).toBeNull();
    expect(screen.getByText("Preview your draft")).toBeDefined();
  });

  it("defaults to the desktop viewport on a desktop screen", () => {
    render(<ResponsivePortfolioPreview initiallyOpen>{null}</ResponsivePortfolioPreview>);
    expect(
      screen.getByRole("button", { name: "Desktop · 1280px" }).getAttribute("aria-pressed"),
    ).toBe("true");
    expect(screen.getByTitle("Private draft preview").getAttribute("style")).toContain(
      "width: 1280px",
    );
  });

  it("defaults to mobile on a phone and preserves a manually selected viewport", () => {
    const listeners: (() => void)[] = [];
    vi.stubGlobal("innerWidth", 390);
    vi.stubGlobal(
      "matchMedia",
      vi.fn(() => ({
        addEventListener: (_: string, listener: () => void) => listeners.push(listener),
        matches: true,
        removeEventListener: vi.fn(),
      })),
    );
    const content = <ResponsivePortfolioPreview initiallyOpen>{null}</ResponsivePortfolioPreview>;
    const view = render(content);
    expect(
      screen.getByRole("button", { name: "Mobile · 375px" }).getAttribute("aria-pressed"),
    ).toBe("true");
    fireEvent.click(screen.getByRole("button", { name: "Tablet · 768px" }));
    act(() => {
      vi.stubGlobal("innerWidth", 1440);
      for (const listener of listeners) listener();
    });
    view.rerender(content);
    expect(
      screen.getByRole("button", { name: "Tablet · 768px" }).getAttribute("aria-pressed"),
    ).toBe("true");
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
