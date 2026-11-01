// @vitest-environment jsdom
import { runInNewContext } from "node:vm";

import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  USER_CONFIG_STORAGE_KEY,
  userConfigThemeScript,
  useUserConfigStore,
} from "@shared/runtime/user";

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
    useUserConfigStore.setState({ activeMode: null, user: null });
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
    runInNewContext(userConfigThemeScript("devhub-theme:owner", "dark"), {
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
    expect(useUserConfigStore.getState().activeMode).toBe("light");
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
    const newValue = JSON.stringify({ state: { activeMode: "light", user: null }, version: 2 });
    localStorage.setItem(USER_CONFIG_STORAGE_KEY, newValue);
    fireEvent(window, new StorageEvent("storage", { key: USER_CONFIG_STORAGE_KEY, newValue }));
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
  it("imports the temporary store once without resurrecting a signed-out user", () => {
    localStorage.setItem(
      "mydevstudio-storage",
      JSON.stringify({
        state: { theme: "light", user: { id: "owner", name: "Yusuf" } },
        version: 1,
      }),
    );
    const page = render(<Page storageKey="legacy" />);
    expect(useUserConfigStore.getState().activeMode).toBe("light");
    expect(useUserConfigStore.getState().user?.id).toBe("owner");
    expect(localStorage.getItem("mydevstudio-storage")).toBeNull();
    useUserConfigStore.getState().clearUser();
    page.unmount();
    render(<Page storageKey="legacy" />);
    expect(useUserConfigStore.getState().user).toBeNull();
    expect(useUserConfigStore.getState().activeMode).toBe("light");
  });
});
