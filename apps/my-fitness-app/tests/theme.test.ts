import { runInNewContext } from "node:vm";

import { describe, expect, it } from "vitest";

import { USER_CONFIG_STORAGE_KEY, userConfigThemeScript } from "@shared/runtime/user";

const platformThemeBootstrap = userConfigThemeScript("mydevstudio-theme", "light");

function paint(records: Record<string, string>, prefersDark = true) {
  const document = { documentElement: { dataset: {} as { theme?: string } } };
  const localStorage = { getItem: (key: string) => records[key] ?? null };
  runInNewContext(platformThemeBootstrap, {
    document,
    localStorage,
    matchMedia: () => ({ matches: prefersDark }),
  });
  return document.documentElement.dataset.theme;
}

describe("platform theme bootstrap", () => {
  it("uses the shared user-config record before paint", () => {
    expect(
      paint({
        [USER_CONFIG_STORAGE_KEY]: JSON.stringify({
          state: { activeMode: "light", user: null },
          version: 2,
        }),
        "mydevstudio-theme": "dark",
      }),
    ).toBe("light");
  });

  it("reads the platform theme key when the shared record has no mode", () => {
    expect(paint({ "mydevstudio-theme": "dark" })).toBe("dark");
  });

  it("follows the device when the shared mode is system", () => {
    const record = JSON.stringify({ state: { activeMode: "system", user: null }, version: 2 });
    expect(paint({ [USER_CONFIG_STORAGE_KEY]: record }, true)).toBe("dark");
    expect(paint({ [USER_CONFIG_STORAGE_KEY]: record }, false)).toBe("light");
  });
});
