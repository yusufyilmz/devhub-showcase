// @vitest-environment jsdom

import { beforeEach, describe, expect, it } from "vitest";

import { storage } from "@shared/config/storage";

import { themeStorage, userStorage } from "../storage";
import { useThemeStore } from "./themeStore";
import { useUserConfigStore } from "./userConfigStore";

describe("browser user and theme stores", () => {
  beforeEach(() => {
    useThemeStore.setState({ activeMode: null, themePreferences: {} });
    useUserConfigStore.getState().clearUser();
    localStorage.clear();
  });

  it("persists user and theme in separate records and restores only valid fields", async () => {
    useThemeStore.getState().setActiveMode("dark");
    useThemeStore.getState().setThemePreferences({ border: "invalid", spacing: "spacious" });
    useUserConfigStore.getState().setUser({ id: "owner", name: "Yusuf" });

    expect(JSON.parse(localStorage.getItem(themeStorage.name) ?? "null")).toEqual({
      state: { activeMode: "dark", themePreferences: { spacing: "spacious" } },
      version: storage.version,
    });
    expect(JSON.parse(localStorage.getItem(userStorage.name) ?? "null")).toEqual({
      state: { user: { id: "owner", name: "Yusuf" } },
      version: storage.version,
    });

    await useThemeStore.persist.rehydrate();
    await useUserConfigStore.persist.rehydrate();
    expect(useThemeStore.getState().activeMode).toBe("dark");
    expect(useUserConfigStore.getState().user?.name).toBe("Yusuf");

    useUserConfigStore.getState().clearUser();
    await useUserConfigStore.persist.rehydrate();
    expect(useUserConfigStore.getState().user).toBeNull();
    expect(useThemeStore.getState().activeMode).toBe("dark");
  });

  it("ignores malformed records and unsupported versions", async () => {
    localStorage.setItem(
      themeStorage.name,
      JSON.stringify({
        state: { activeMode: "dark", themePreferences: { brand: "cyan" } },
        version: 1,
      }),
    );
    localStorage.setItem(userStorage.name, "{invalid-json");

    await useThemeStore.persist.rehydrate();
    await useUserConfigStore.persist.rehydrate();
    expect(useThemeStore.getState().activeMode).toBeNull();
    expect(useThemeStore.getState().themePreferences).toEqual({});
    expect(useUserConfigStore.getState().user).toBeNull();
  });
});
