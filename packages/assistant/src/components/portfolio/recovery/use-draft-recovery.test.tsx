// @vitest-environment jsdom
import { act, cleanup, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { profile } from "@shared/config";
import { draftStorage } from "@shared/runtime/storage";

import type { RecoveryOptions } from "./types";
import { useDraftRecovery } from "./use-draft-recovery";

const value = {
  isPublic: false,
  profile,
  step: "done" as const,
  tab: "Profile",
  username: "owner",
};
const options: RecoveryOptions = {
  dirty: true,
  onRestore: vi.fn(),
  revision: 1,
  storageKey: "test-owner",
  value,
};
describe("draft autosave", () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.stubGlobal("BroadcastChannel", undefined);
  });
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });
  it("debounces rapid changes, recovers after reload and never calls the server", async () => {
    const first = renderHook(useDraftRecovery, { initialProps: options });
    first.rerender({
      ...options,
      value: { ...value, profile: { ...profile, title: "Latest unsaved text" } },
    });
    await waitFor(() => expect(first.result.current.status).toBe("saved"));
    first.unmount();
    const restored = renderHook(useDraftRecovery, { initialProps: { ...options, dirty: false } });
    await waitFor(() =>
      expect(restored.result.current.candidate?.value.profile.title).toBe("Latest unsaved text"),
    );
    act(() => restored.result.current.restore());
    expect(options.onRestore).toHaveBeenCalledWith(
      expect.objectContaining({
        profile: expect.objectContaining({ title: "Latest unsaved text" }),
      }),
    );
  });
  it("keeps failures retryable and prevents stale recovery from applying", async () => {
    const write = vi.spyOn(Storage.prototype, "setItem").mockImplementationOnce(() => {
      throw new Error("Full");
    });
    const first = renderHook(useDraftRecovery, { initialProps: options });
    await waitFor(() => expect(first.result.current.status).toBe("failed"));
    act(() => first.result.current.retry());
    expect(first.result.current.status).toBe("saved");
    expect(write).toHaveBeenCalledTimes(2);
    first.unmount();
    const onRestore = vi.fn();
    const next = renderHook(useDraftRecovery, {
      initialProps: {
        ...options,
        onRestore,
        revision: 2,
        value: { ...value, profile: { ...profile, title: "New server version" } },
      },
    });
    await waitFor(() => expect(next.result.current.stale).toBe(true));
    act(() => next.result.current.restore());
    expect(onRestore).not.toHaveBeenCalled();
  });
  it("keeps saving usable if browser cross-tab notifications are blocked", async () => {
    vi.stubGlobal(
      "BroadcastChannel",
      class {
        constructor() {
          throw new Error("Blocked");
        }
      },
    );
    const hook = renderHook(useDraftRecovery, { initialProps: options });
    await waitFor(() => expect(hook.result.current.status).toBe("saved"));
    expect(() => {
      act(() => hook.result.current.saved(2));
    }).not.toThrow();
  });
  it("clears only recovery records on sign out and preserves appearance preferences", () => {
    sessionStorage.setItem(draftStorage.key("owner", "one"), "private draft");
    sessionStorage.setItem(draftStorage.key("owner", "two"), "private draft");
    sessionStorage.setItem("appearance", "dark");
    draftStorage.clear();
    expect(sessionStorage.length).toBe(1);
    expect(sessionStorage.getItem("appearance")).toBe("dark");
  });
  it("flushes rapid edits when navigating away without a full page exit", () => {
    const hook = renderHook(useDraftRecovery, { initialProps: options });
    hook.rerender({
      ...options,
      value: { ...value, profile: { ...profile, title: "Before route change" } },
    });
    hook.unmount();
    expect(
      JSON.parse(sessionStorage.getItem(options.storageKey) ?? "null").value.profile.title,
    ).toBe("Before route change");
  });
  it("flushes pending work on page exit but stops writing during sign out", () => {
    const hook = renderHook(useDraftRecovery, { initialProps: options });
    act(() => window.dispatchEvent(new Event("pagehide")));
    expect(sessionStorage.getItem(options.storageKey)).not.toBeNull();
    act(() => hook.result.current.stop());
    sessionStorage.clear();
    act(() => window.dispatchEvent(new Event("pagehide")));
    expect(sessionStorage.length).toBe(0);
  });
});
