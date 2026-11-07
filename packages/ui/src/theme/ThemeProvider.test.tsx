// @vitest-environment jsdom
import { runInNewContext } from "node:vm";

import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { storage } from "@shared/config/storage";
import { themeBootstrapScript, themeStorage } from "@shared/runtime/storage";
import { useThemeStore, useUserConfigStore } from "@shared/runtime/user";

import { ThemeProvider } from "./ThemeProvider";
import { ThemeToggle } from "./theme-toggle";

function Page({ defaultTheme = "dark" }: { defaultTheme?: "light" | "dark" | "system" }) {
  return (
    <ThemeProvider accent="cyan" defaultTheme={defaultTheme}>
      <ThemeToggle />
    </ThemeProvider>
  );
}

describe("Shared document theme", () => {
  it("restores appearance before paint and preserves it when mode changes", () => {
    useThemeStore.getState().setThemePreferences({
      accent: "violet",
      brand: "aqua",
      radius: "pill",
      scale: "110",
      spacing: "compact",
    });
    runInNewContext(themeBootstrapScript("dark"), {
      document,
      localStorage,
      matchMedia: window.matchMedia,
    });
    expect(document.documentElement.dataset.spacing).toBe("compact");
    expect(document.documentElement.style.getPropertyValue("--text-scale")).toBe("1.1");
    render(<Page />);
    expect(document.documentElement.dataset.accent).toBe("violet");
    fireEvent.click(screen.getByRole("button", { name: "Switch to light theme" }));
    expect(document.documentElement.dataset.spacing).toBe("compact");
    expect(document.documentElement.dataset.brand).toBe("aqua");
    act(() => useThemeStore.setState({ themePreferences: { spacing: "spacious" } }));
    expect(document.documentElement.dataset.spacing).toBe("spacious");
    act(() => useThemeStore.setState({ themePreferences: {} }));
    expect(document.documentElement.dataset.accent).toBe("cyan");
  });
  let dark: boolean;
  let change: (() => void) | undefined;
  beforeEach(() => {
    dark = false;
    change = undefined;
    useThemeStore.setState({ activeMode: null, themePreferences: {} });
    useUserConfigStore.getState().clearUser();
    localStorage.clear();
    document.documentElement.removeAttribute("data-appearance-defaults");
    document.documentElement.removeAttribute("data-spacing");
    document.documentElement.removeAttribute("data-brand");
    vi.stubGlobal("matchMedia", () => ({
      addEventListener: (_: string, cb: () => void) => {
        change = cb;
      },
      matches: dark,
      removeEventListener: vi.fn(),
    }));
  });
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });
  it("keeps a homepage choice on a different studio page and before paint", () => {
    const home = render(<Page />);
    fireEvent.click(screen.getByRole("button", { name: "Switch to light theme" }));
    home.unmount();
    document.documentElement.dataset.theme = "dark";
    runInNewContext(themeBootstrapScript("dark"), {
      document,
      localStorage,
      matchMedia: window.matchMedia,
    });
    expect(document.documentElement.dataset.theme).toBe("light");
    render(<Page />);
    expect(screen.getByRole("button", { name: "Switch to dark theme" })).toBeTruthy();
  });
  it("follows the device in system mode and preserves an explicit override", () => {
    render(<Page defaultTheme="system" />);
    dark = true;
    // Drive the same callback matchMedia dispatches in a browser.
    act(() => change?.());
    expect(document.documentElement.dataset.theme).toBe("dark");
    fireEvent.click(screen.getByRole("button", { name: "Switch to light theme" }));
    dark = false;
    act(() => change?.());
    dark = true;
    act(() => change?.());
    expect(document.documentElement.dataset.theme).toBe("light");
  });
  it("accepts preference changes from another tab", () => {
    render(<Page />);
    const newValue = JSON.stringify({
      state: {
        activeMode: "light",
        themePreferences: { accent: "emerald", spacing: "spacious" },
      },
      version: storage.version,
    });
    localStorage.setItem(themeStorage.name, newValue);
    fireEvent(window, new StorageEvent("storage", { key: themeStorage.name, newValue }));
    expect(document.documentElement.dataset.theme).toBe("light");
    expect(document.documentElement.dataset.spacing).toBe("spacious");
    expect(document.documentElement.dataset.accent).toBe("emerald");
  });
  it("still toggles when local storage is blocked", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("Blocked");
    });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("Blocked");
    });
    render(<Page />);
    fireEvent.click(screen.getByRole("button", { name: "Switch to light theme" }));
    expect(document.documentElement.dataset.theme).toBe("light");
  });
  it("ignores old theme keys and leaves the cached user alone when the theme is cleared", () => {
    localStorage.setItem("mydevstudio-theme", "light");
    localStorage.setItem("data-spacing", "spacious");
    useUserConfigStore.getState().setUser({ id: "owner", name: "Yusuf" });
    render(<Page />);
    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(useThemeStore.getState().themePreferences).toEqual({});

    fireEvent.click(screen.getByRole("button", { name: "Switch to light theme" }));
    localStorage.removeItem(themeStorage.name);
    fireEvent(window, new StorageEvent("storage", { key: themeStorage.name }));
    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(localStorage.getItem(themeStorage.name)).toBeNull();
    expect(useUserConfigStore.getState().user?.id).toBe("owner");
  });
});
