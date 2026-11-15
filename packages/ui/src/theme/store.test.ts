// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from "vitest";

import { themeStorage } from "@shared/runtime/storage";
import { useThemeStore, useUserConfigStore } from "@shared/runtime/user";

import { themeActions, themeStore } from "./store";

describe("Theme store compatibility with user preferences", () => {
  beforeEach(() => {
    useThemeStore.setState({ activeMode: null, themePreferences: {} });
    localStorage.clear();
  });
  it("writes explicit theme actions into the canonical record, including default-valued choices", () => {
    themeActions.setBrand("blue");
    themeActions.setSpacing("compact");
    themeActions.setTheme("dark");
    expect(useThemeStore.getState().themePreferences).toMatchObject({
      brand: "blue",
      spacing: "compact",
    });
    expect(useThemeStore.getState().activeMode).toBe("dark");
    expect(localStorage.getItem("ui-theme")).toBeNull();
    expect(localStorage.getItem(themeStorage.name)).toContain("compact");
  });
  it("updates existing selectors when canonical settings change without clearing the user", () => {
    useUserConfigStore.getState().setUser({ id: "owner", name: "Owner" });
    useThemeStore.getState().setThemePreferences({ border: "thin", font: "mono", radius: "pill" });
    expect(themeStore.getState()).toMatchObject({ borders: "thin", font: "mono", radius: "pill" });
    expect(useUserConfigStore.getState().user?.id).toBe("owner");
  });
});
