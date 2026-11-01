// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from "vitest";

import { USER_STORAGE_KEY, useStorage } from "./use-storage";

describe("useStorage persisted browser state", () => {
  beforeEach(() => {
    useStorage.setState({ theme: null, user: null });
    localStorage.clear();
  });
  it("rehydrates a theme and display user without persisting arbitrary account data", async () => {
    useStorage.getState().setTheme("light");
    useStorage.getState().setUser({
      email: "owner@example.test",
      id: "owner",
      name: "Yusuf",
      ...{ access_token: "never-store-this" },
    });
    const serialized = localStorage.getItem(USER_STORAGE_KEY);
    expect(serialized).not.toContain("access_token");
    useStorage.setState({ theme: null, user: null });
    localStorage.setItem(USER_STORAGE_KEY, serialized ?? "");
    await useStorage.persist.rehydrate();
    expect(useStorage.getState().theme).toBe("light");
    expect(useStorage.getState().user?.name).toBe("Yusuf");
    useStorage.getState().clearUser();
    expect(useStorage.getState().user).toBeNull();
    expect(useStorage.getState().theme).toBe("light");
  });
  it("ignores invalid persisted preferences and malformed user fields", async () => {
    localStorage.setItem(
      USER_STORAGE_KEY,
      JSON.stringify({
        state: { theme: "neon", user: { id: 12, name: "Bad record" } },
        version: 1,
      }),
    );
    await useStorage.persist.rehydrate();
    expect(useStorage.getState().theme).toBeNull();
    expect(useStorage.getState().user).toBeNull();
  });
});
