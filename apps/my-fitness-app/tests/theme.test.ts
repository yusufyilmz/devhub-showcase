import { runInNewContext } from "node:vm";

import { describe, expect, it } from "vitest";

import { USER_CONFIG_STORAGE_KEY } from "@shared/runtime/user";

import { FITNESS_LEGACY_THEME_KEY, themeBootstrap } from "../features/theme/theme-script";

function paint(records: Record<string, string>, prefersDark = true) {
  const document = { documentElement: { dataset: {} as { theme?: string } } };
  const localStorage = { getItem: (key: string) => records[key] ?? null };
  runInNewContext(themeBootstrap, {
    document,
    localStorage,
    matchMedia: () => ({ matches: prefersDark }),
  });
  return document.documentElement.dataset.theme;
}

describe("Fitness theme", () => {
  it("uses the shared user-config record before paint", () => {
    expect(
      paint({
        [USER_CONFIG_STORAGE_KEY]: JSON.stringify({
          state: { activeMode: "light", user: null },
          version: 2,
        }),
        [FITNESS_LEGACY_THEME_KEY]: "dark",
      }),
    ).toBe("light");
  });

  it("reads the older fitness key only when the shared record has no mode", () => {
    expect(paint({ [FITNESS_LEGACY_THEME_KEY]: "light" })).toBe("light");
  });

  it("follows the device when the shared mode is system", () => {
    const record = JSON.stringify({ state: { activeMode: "system", user: null }, version: 2 });
    expect(paint({ [USER_CONFIG_STORAGE_KEY]: record }, true)).toBe("dark");
    expect(paint({ [USER_CONFIG_STORAGE_KEY]: record }, false)).toBe("light");
  });
});
