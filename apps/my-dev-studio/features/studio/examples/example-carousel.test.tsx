// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ExampleCarousel } from "@/features/studio";

describe("ExampleCarousel", () => {
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });
  it("shows all examples before filtering each portfolio layout", () => {
    vi.stubGlobal(
      "ResizeObserver",
      class {
        observe() {}
        disconnect() {}
      },
    );
    HTMLElement.prototype.scrollTo = vi.fn();
    render(<ExampleCarousel />);
    expect(screen.getAllByRole("link")).toHaveLength(16);
    for (const name of [
      "Engineer",
      "Designer",
      "Consultant",
      "Minimal",
      "Trainer",
      "Content creator",
    ]) {
      fireEvent.click(screen.getByRole("button", { name }));
      const count = ["Engineer", "Trainer"].includes(name) ? 2 : 3;
      expect(screen.getAllByRole("link")).toHaveLength(count);
      expect(screen.getByRole("button", { name }).getAttribute("aria-pressed")).toBe("true");
      expect(screen.getByRole("status").textContent).toBe(`1 / ${count} examples`);
      expect(
        screen
          .getByRole("button", { name: "Previous portfolio examples" })
          .hasAttribute("disabled"),
      ).toBe(true);
    }
    fireEvent.click(screen.getByRole("button", { name: "All layouts" }));
    expect(screen.getAllByRole("link")).toHaveLength(16);
  });
});
