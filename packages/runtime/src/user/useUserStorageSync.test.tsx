// @vitest-environment jsdom

import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useUserConfigStore } from "./userConfigStore";
import { useUserStorageSync } from "./useUserStorageSync";

const confirmed = { email: "ada@example.test", id: "owner", name: "Ada" };

describe("useUserStorageSync", () => {
  beforeEach(() => {
    useUserConfigStore.getState().clearUser();
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("writes the server-confirmed display user after rehydration", async () => {
    useUserConfigStore.getState().setUser({ id: "stale", name: "Stale" });

    renderHook(() => useUserStorageSync(confirmed));
    await act(async () => {
      await Promise.resolve();
    });

    expect(useUserConfigStore.getState().user).toEqual(confirmed);
  });

  it("leaves the cache untouched when the caller has no confirmed user", async () => {
    useUserConfigStore.getState().setUser({ id: "owner", name: "Ada" });

    renderHook(() => useUserStorageSync(undefined));
    await act(async () => {
      await Promise.resolve();
    });

    expect(useUserConfigStore.getState().user).toEqual({ id: "owner", name: "Ada" });
  });

  it("drops a resolved rehydrate that belongs to an unmounted caller", async () => {
    let finish = () => {};
    vi.spyOn(useUserConfigStore.persist, "rehydrate").mockImplementation(
      () =>
        new Promise((resolve) => {
          finish = () => resolve();
        }),
    );

    const { unmount } = renderHook(() => useUserStorageSync(confirmed));
    unmount();
    finish();
    await act(async () => {
      await Promise.resolve();
    });

    expect(useUserConfigStore.getState().user).toBeNull();
  });
});
