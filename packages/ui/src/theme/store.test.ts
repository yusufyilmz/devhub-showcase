// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from "vitest";

import { USER_CONFIG_STORAGE_KEY, useUserConfigStore } from "@shared/runtime/user";

import { themeActions, themeStore } from "./store";

describe("Theme store compatibility with user preferences", () => {
  beforeEach(() => {
    useUserConfigStore.getState().reset();
    localStorage.clear();
  });
  it("writes explicit theme actions into the canonical record, including default-valued choices", () => {
    themeActions.setBrand("blue");
    themeActions.setSpacing("compact");
    themeActions.setTheme("dark");
    expect(useUserConfigStore.getState().themePreferences).toMatchObject({
      brand: "blue",
      spacing: "compact",
    });
    expect(useUserConfigStore.getState().activeMode).toBe("dark");
    expect(localStorage.getItem("ui-theme")).toBeNull();
    expect(localStorage.getItem(USER_CONFIG_STORAGE_KEY)).toContain("compact");
  });
  it("updates legacy selectors when canonical settings change without clearing the user", () => {
    useUserConfigStore.getState().setUser({ id: "owner", name: "Owner" });
    useUserConfigStore
      .getState()
      .setThemePreferences({ border: "thin", font: "mono", radius: "pill" });
    expect(themeStore.getState()).toMatchObject({ borders: "thin", font: "mono", radius: "pill" });
    expect(useUserConfigStore.getState().user?.id).toBe("owner");
  });
});
