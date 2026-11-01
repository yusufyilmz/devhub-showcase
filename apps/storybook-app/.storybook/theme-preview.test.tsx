// @vitest-environment jsdom
import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { ThemePreview } from "./theme-preview";

describe("Storybook theme isolation", () => {
  afterEach(cleanup);

  it("switches the root theme for portaled controls and restores the host on unmount", () => {
    const root = document.documentElement;
    root.dataset.brand = "sand";
    root.dataset.theme = "light";
    const view = render(
      <ThemePreview globals={{ brand: "aqua", mode: "dark" }}>Preview</ThemePreview>,
    );
    expect(root.dataset.brand).toBe("aqua");
    expect(root.dataset.theme).toBe("dark");
    expect(root.classList.contains("dark")).toBe(true);
    view.rerender(<ThemePreview globals={{ brand: "white", mode: "light" }}>Preview</ThemePreview>);
    expect(root.dataset.brand).toBe("white");
    expect(root.classList.contains("dark")).toBe(false);
    view.unmount();
    expect(root.dataset.brand).toBe("sand");
    expect(root.dataset.theme).toBe("light");
    expect(root.hasAttribute("data-spacing")).toBe(false);
    delete root.dataset.brand;
    delete root.dataset.theme;
  });
});
