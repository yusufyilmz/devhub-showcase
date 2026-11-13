// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from "vitest";

import { accountPreferenceSession } from "@shared/runtime/storage";
import { useThemeStore } from "@shared/runtime/user";

import { applyAccountPreferenceCommand } from "./account-preference-command";

describe("Studio assistant preference commands", () => {
  afterEach(() => {
    accountPreferenceSession.load(undefined);
    useThemeStore.setState({ activeMode: null, themePreferences: {} });
    localStorage.clear();
  });

  it("changes the same preferences as the Studio controls", () => {
    accountPreferenceSession.load({});
    const changes = vi.fn();
    const stop = accountPreferenceSession.onChange(changes);
    try {
      expect(applyAccountPreferenceCommand("Switch to dark theme")).toBe("Theme set to dark.");
      expect(useThemeStore.getState().activeMode).toBe("dark");
      applyAccountPreferenceCommand("Move companion right");
      applyAccountPreferenceCommand("Resize companion 100");
      expect(changes).toHaveBeenLastCalledWith({ "layout:studio": { size: 100, x: 1, y: 1 } });
      applyAccountPreferenceCommand("Disable companion tips");
      expect(changes).toHaveBeenLastCalledWith({ "tips:studio": false });
      expect(applyAccountPreferenceCommand("Resize companion 400")).toBeUndefined();
    } finally {
      stop();
    }
  });
});
