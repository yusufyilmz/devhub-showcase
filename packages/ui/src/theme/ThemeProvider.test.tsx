// @vitest-environment jsdom
import { runInNewContext } from "node:vm";

import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { storageThemeScript } from "../stores/storage-theme";
import { USER_STORAGE_KEY, useStorage } from "../stores/use-storage";
import { ThemeProvider } from "./ThemeProvider";
import { ThemeToggle } from "./theme-toggle";

function Page({
  storageKey,
  defaultTheme = "dark",
}: {
  storageKey: string;
  defaultTheme?: "light" | "dark" | "system";
}) {
  return (
    <ThemeProvider accent="cyan" defaultTheme={defaultTheme} storageKey={storageKey}>
      <ThemeToggle />
    </ThemeProvider>
  );
}

describe("Shared document theme", () => {
  let dark: boolean;
  let change: (() => void) | undefined;
  beforeEach(() => {
    dark = false;
    change = undefined;
    useStorage.setState({ theme: null, user: null });
    localStorage.clear();
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
  it("keeps a homepage choice on a differently scoped studio page and before paint", () => {
    const home = render(<Page storageKey="mydevstudio-theme" />);
    fireEvent.click(screen.getByRole("button", { name: "Switch to light theme" }));
    home.unmount();
    document.documentElement.dataset.theme = "dark";
    runInNewContext(storageThemeScript("devhub-theme:owner", "dark"), {
      document,
      localStorage,
      matchMedia: window.matchMedia,
    });
    expect(document.documentElement.dataset.theme).toBe("light");
    render(<Page storageKey="devhub-theme:owner" />);
    expect(screen.getByRole("button", { name: "Switch to dark theme" })).toBeTruthy();
  });
  it("migrates the existing homepage choice ahead of a conflicting profile preference", () => {
    localStorage.setItem("mydevstudio-theme", "light");
    localStorage.setItem("devhub-theme:owner", "dark");
    render(<Page storageKey="devhub-theme:owner" />);
    expect(useStorage.getState().theme).toBe("light");
    expect(document.documentElement.dataset.theme).toBe("light");
  });
  it("follows the device in system mode and preserves an explicit override", () => {
    render(<Page defaultTheme="system" storageKey="legacy" />);
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
    render(<Page storageKey="legacy" />);
    const newValue = JSON.stringify({ state: { theme: "light", user: null }, version: 1 });
    localStorage.setItem(USER_STORAGE_KEY, newValue);
    fireEvent(window, new StorageEvent("storage", { key: USER_STORAGE_KEY, newValue }));
    expect(document.documentElement.dataset.theme).toBe("light");
  });
  it("still toggles when local storage is blocked", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("Blocked");
    });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("Blocked");
    });
    render(<Page storageKey="legacy" />);
    fireEvent.click(screen.getByRole("button", { name: "Switch to light theme" }));
    expect(document.documentElement.dataset.theme).toBe("light");
  });
});
