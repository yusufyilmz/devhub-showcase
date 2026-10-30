// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { ExampleCarousel } from "../apps/web/features/examples/example-carousel";

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
  expect(screen.getAllByRole("link")).toHaveLength(8);
  for (const name of ["Engineer", "Designer", "Consultant", "Minimal"]) {
    fireEvent.click(screen.getByRole("button", { name }));
    expect(screen.getAllByRole("link")).toHaveLength(2);
    expect(
      screen.getByRole("button", { name }).getAttribute("aria-pressed"),
    ).toBe("true");
    expect(screen.getByRole("status").textContent).toBe("1 / 2 examples");
    expect(
      screen
        .getByRole("button", { name: "Previous portfolio examples" })
        .hasAttribute("disabled"),
    ).toBe(true);
  }
  fireEvent.click(screen.getByRole("button", { name: "All layouts" }));
  expect(screen.getAllByRole("link")).toHaveLength(8);
});
