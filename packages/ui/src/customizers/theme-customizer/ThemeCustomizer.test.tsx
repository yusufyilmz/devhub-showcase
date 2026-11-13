// @vitest-environment jsdom
import { cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { useThemeStore } from "@shared/runtime/user";

import { ThemeCustomizer } from "./ThemeCustomizer";

describe("ThemeCustomizer", () => {
  afterEach(() => {
    cleanup();
    useThemeStore.setState({ activeMode: null, themePreferences: {} });
    vi.unstubAllGlobals();
  });

  it("updates the preview shell that pins data-theme", () => {
    useThemeStore.setState({ activeMode: "light", themePreferences: {} });
    vi.stubGlobal("matchMedia", () => ({
      addEventListener: vi.fn(),
      matches: false,
      removeEventListener: vi.fn(),
    }));
    const view = render(
      <div data-brand="violet" data-theme="light">
        <ThemeCustomizer showCode={false} showPreview={false} showReset={false} />
      </div>,
    );
    const shell = view.container.firstElementChild as HTMLElement;
    expect(shell.dataset.theme).toBe("light");
    fireEvent.change(view.container.querySelectorAll("select")[0] as HTMLSelectElement, {
      target: { value: "dark" },
    });
    expect(shell.dataset.theme).toBe("dark");
    expect(shell.dataset.brand).toBe("violet");
    expect(shell.classList.contains("dark")).toBe(true);
    expect(document.documentElement.dataset.theme).toBe("dark");
    view.unmount();
    expect(shell.dataset.theme).toBe("light");
    expect(shell.classList.contains("dark")).toBe(false);
  });

  it("keeps the preview mode and palette when no mode is selected", () => {
    vi.stubGlobal("matchMedia", () => ({
      addEventListener: vi.fn(),
      matches: false,
      removeEventListener: vi.fn(),
    }));
    const view = render(
      <div data-brand="sand" data-theme="dark">
        <ThemeCustomizer showCode={false} showPreview={false} showReset={false} />
      </div>,
    );
    expect(view.container.firstElementChild?.getAttribute("data-theme")).toBe("dark");
    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(document.documentElement.dataset.brand).toBe("sand");
  });
});
