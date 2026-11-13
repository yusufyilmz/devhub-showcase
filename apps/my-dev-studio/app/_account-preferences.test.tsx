// @vitest-environment jsdom

import { cleanup, render, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { companionStorage } from "@shared/runtime/storage";
import { useThemeStore } from "@shared/runtime/user";

import { AccountPreferences } from "./_account-preferences";

describe("Studio account preference sync", () => {
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    useThemeStore.setState({ activeMode: null, themePreferences: {} });
    localStorage.clear();
  });

  it("loads account values and saves only the fields changed by the user", async () => {
    const accountId = "11111111-1111-4111-8111-111111111111";
    const patch = vi.fn();
    vi.stubGlobal("fetch", async (_url: string, options: RequestInit) => {
      if (options.method === "PATCH") {
        patch(JSON.parse(String(options.body)));
        return Response.json({ saved: true });
      }
      return Response.json({
        accountId,
        preferences: { "layout:studio": { x: 1, y: 0 }, mode: "dark", "theme:font": "serif" },
      });
    });
    render(<AccountPreferences />);
    await waitFor(() => expect(useThemeStore.getState().activeMode).toBe("dark"));
    expect(useThemeStore.getState().themePreferences).toEqual({ font: "serif" });
    expect(companionStorage.readLayout("studio")).toMatchObject({ x: 1, y: 0 });
    useThemeStore.getState().setActiveMode("light");
    companionStorage.writeLayout("studio", { size: 100, x: 0.5, y: 0 });
    await waitFor(() => expect(patch).toHaveBeenCalledTimes(2));
    expect(patch).toHaveBeenNthCalledWith(1, { accountId, preferences: { mode: "light" } });
    expect(patch).toHaveBeenNthCalledWith(2, {
      accountId,
      preferences: { "layout:studio": { size: 100, x: 0.5, y: 0 } },
    });
  });
});
