// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Button } from "./Button";

describe("Shared button composition", () => {
  it("preserves native form-submit defaults and explicit control types for unstyled skins", () => {
    render(
      <>
        <Button variant="unstyled">Save</Button>
        <Button type="button" variant="unstyled">
          Cancel
        </Button>
      </>,
    );
    expect(screen.getByRole("button", { name: "Save" }).getAttribute("type")).toBe("submit");
    expect(screen.getByRole("button", { name: "Cancel" }).getAttribute("type")).toBe("button");
    expect(screen.getByRole("button", { name: "Save" }).className).not.toContain("ui-button");
  });
  afterEach(cleanup);
  it("preserves anchor attributes and handlers used by page actions", () => {
    const click = vi.fn((event: { preventDefault: () => void }) => event.preventDefault());
    render(
      <Button
        aria-label="Open portfolio"
        href="/demo"
        onClick={click}
        rel="noopener noreferrer"
        target="_blank"
      >
        Open
      </Button>,
    );
    const link = screen.getByRole("link", { name: "Open portfolio" });
    expect(link.getAttribute("target")).toBe("_blank");
    fireEvent.click(link);
    expect(click).toHaveBeenCalledOnce();
  });
  it("removes navigation and handlers from disabled link actions", () => {
    const click = vi.fn();
    render(
      <Button disabled href="/demo" onClick={click}>
        Unavailable
      </Button>,
    );
    const link = screen.getByText("Unavailable");
    expect(link.hasAttribute("href")).toBe(false);
    expect(link.getAttribute("aria-disabled")).toBe("true");
    fireEvent.click(link);
    expect(click).not.toHaveBeenCalled();
  });
  it("sets the cursor from the button state", () => {
    render(
      <>
        <Button>Submit</Button>
        <Button aria-busy>Saving...</Button>
        <Button disabled>Confirm</Button>
      </>,
    );
    expect(screen.getByRole("button", { name: "Submit" }).className).toContain("cursor-pointer");
    expect(screen.getByRole("button", { name: "Saving..." }).className).toContain(
      "cursor-progress",
    );
    expect(screen.getByRole("button", { name: "Confirm" }).className).toContain(
      "cursor-not-allowed",
    );
  });
  it("styles the slotted link itself without nesting interactive controls", () => {
    render(
      <Button asChild variant="outline">
        <a href="/demo">View work</a>
      </Button>,
    );
    const link = screen.getByRole("link", { name: "View work" });
    expect(link.dataset.slot).toBe("button");
    expect(screen.queryByRole("button")).toBeNull();
  });
});
