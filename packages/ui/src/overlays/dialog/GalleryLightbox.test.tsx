// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { GalleryLightbox } from "./GalleryLightbox";

describe("GalleryLightbox", () => {
  afterEach(cleanup);
  const items = [
    { content: "First image", id: "first", thumbnail: "First", title: "First" },
    { content: "Second image", id: "second", thumbnail: "Second", title: "Second" },
  ];
  it("opens only the selected content and supports navigation and closing", () => {
    const change = vi.fn();
    render(<GalleryLightbox index={0} items={items} onIndexChange={change} />);
    expect(screen.getByRole("dialog")).toBeTruthy();
    expect(screen.getByText("First image")).toBeTruthy();
    expect(screen.queryByText("Second image")).toBeNull();
    expect(screen.getByRole("button", { name: "Previous item" }).hasAttribute("disabled")).toBe(
      true,
    );
    fireEvent.click(screen.getByRole("button", { name: "Next item" }));
    expect(change).toHaveBeenCalledWith(1);
    fireEvent.click(screen.getByRole("button", { name: "Show Second" }));
    expect(change).toHaveBeenCalledWith(1);
    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(change).toHaveBeenCalledWith(null);
  });
  it("does not mount preview content when closed", () => {
    render(<GalleryLightbox index={null} items={items} onIndexChange={vi.fn()} />);
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(screen.queryByText("First image")).toBeNull();
  });
});
