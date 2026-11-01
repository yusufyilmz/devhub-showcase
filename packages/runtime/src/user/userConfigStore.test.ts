// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from "vitest";

import { USER_CONFIG_STORAGE_KEY, useUserConfigStore } from "./userConfigStore";

describe("useUserConfigStore persisted browser state", () => {
  beforeEach(() => {
    useUserConfigStore.setState({ activeMode: null, user: null });
    localStorage.clear();
  });
  it("rehydrates a theme and display user without persisting arbitrary account data", async () => {
    useUserConfigStore.getState().setActiveMode("light");
    useUserConfigStore.getState().setUser({
      email: "owner@example.test",
      id: "owner",
      name: "Yusuf",
      ...{ access_token: "never-store-this" },
    });
    const serialized = localStorage.getItem(USER_CONFIG_STORAGE_KEY);
    expect(serialized).not.toContain("access_token");
    useUserConfigStore.setState({ activeMode: null, user: null });
    localStorage.setItem(USER_CONFIG_STORAGE_KEY, serialized ?? "");
    await useUserConfigStore.persist.rehydrate();
    expect(useUserConfigStore.getState().activeMode).toBe("light");
    expect(useUserConfigStore.getState().user?.name).toBe("Yusuf");
    useUserConfigStore.getState().clearUser();
    expect(useUserConfigStore.getState().user).toBeNull();
    expect(useUserConfigStore.getState().activeMode).toBe("light");
  });
  it("ignores invalid persisted preferences and malformed user fields", async () => {
    localStorage.setItem(
      USER_CONFIG_STORAGE_KEY,
      JSON.stringify({
        state: { activeMode: "neon", user: { id: 12, name: "Bad record" } },
        version: 2,
      }),
    );
    await useUserConfigStore.persist.rehydrate();
    expect(useUserConfigStore.getState().activeMode).toBeNull();
    expect(useUserConfigStore.getState().user).toBeNull();
  });
  it("migrates the existing key and drops obsolete fields", async () => {
    localStorage.setItem(
      USER_CONFIG_STORAGE_KEY,
      JSON.stringify({
        state: { activeMode: "dark", chatWidth: 600, showNginxStats: true, useVba: true },
        version: 1,
      }),
    );
    await useUserConfigStore.persist.rehydrate();
    expect(useUserConfigStore.getState().activeMode).toBe("dark");
    const record = JSON.parse(localStorage.getItem(USER_CONFIG_STORAGE_KEY) ?? "null");
    expect(record.version).toBe(2);
    expect(record.state).toEqual({ activeMode: "dark", user: null });
    expect(useUserConfigStore.getState()).not.toHaveProperty("showNginxStats");
  });
});
