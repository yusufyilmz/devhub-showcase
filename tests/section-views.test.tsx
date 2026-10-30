// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";

import {
  SectionAccordion,
  SectionCarousel,
  SectionGrid,
  SectionTabs,
} from "../packages/components/src/section-views";

const items = [
  { content: <p>First content</p>, id: "one", title: "First" },
  { content: <p>Second content</p>, id: "two", title: "Second" },
];
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});
it("tabs support arrow keys and keep panels associated with their tabs", () => {
  render(<SectionTabs items={items} label="Work" />);
  fireEvent.keyDown(screen.getByRole("tab", { name: "First" }), {
    key: "ArrowRight",
  });
  expect(screen.getByRole("tab", { name: "Second" }).getAttribute("aria-selected")).toBe("true");
  expect(screen.getByRole("tabpanel").textContent).toBe("Second content");
  fireEvent.keyDown(screen.getByRole("tab", { name: "Second" }), {
    key: "Home",
  });
  expect(screen.getByRole("tabpanel").textContent).toBe("First content");
});
it("uses native disclosure controls and semantic lists for grids", () => {
  const { unmount } = render(<SectionAccordion items={items} label="FAQ" />);
  expect(screen.getByText("First").closest("summary")).toBeTruthy();
  unmount();
  render(<SectionGrid items={items} label="Gallery" variant="gallery" />);
  expect(screen.getAllByRole("listitem")).toHaveLength(2);
});
it("handles empty interactive views and item removal without a stale active tab", () => {
  const { rerender } = render(<SectionTabs items={items} label="Work" />);
  fireEvent.click(screen.getByRole("tab", { name: "Second" }));
  rerender(<SectionTabs items={items.slice(0, 1)} label="Work" />);
  expect(screen.getByRole("tabpanel").textContent).toBe("First content");
  rerender(<SectionCarousel items={[]} label="Work" />);
  expect(screen.queryByRole("button")).toBeNull();
});

it("carousel controls respect reduced motion and scroll the content viewport", () => {
  const scrollBy = vi.fn();
  vi.stubGlobal("matchMedia", () => ({ matches: true }));
  render(<SectionCarousel items={items} label="Work" />);
  const list = screen.getByRole("list");
  Object.defineProperty(list, "clientWidth", { value: 1000 });
  list.scrollBy = scrollBy;
  fireEvent.click(screen.getByRole("button", { name: "Next items" }));
  expect(scrollBy).toHaveBeenCalledWith({ behavior: "instant", left: 850 });
  fireEvent.click(screen.getByRole("button", { name: "Previous items" }));
  expect(scrollBy).toHaveBeenLastCalledWith({
    behavior: "instant",
    left: -850,
  });
});
