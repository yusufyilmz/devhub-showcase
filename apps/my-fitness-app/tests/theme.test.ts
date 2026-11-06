import { runInNewContext } from "node:vm";

import { describe, expect, it } from "vitest";

import { storage, themeBootstrapScript, themeStorage } from "@shared/runtime/storage";

const platformThemeBootstrap = themeBootstrapScript("light");

function paint(records: Record<string, string>, prefersDark = true) {
  const document = {
    documentElement: { classList: { toggle: () => false }, dataset: {} as { theme?: string } },
  };
  const localStorage = { getItem: (key: string) => records[key] ?? null };
  runInNewContext(platformThemeBootstrap, {
    document,
    localStorage,
    matchMedia: () => ({ matches: prefersDark }),
  });
  return document.documentElement.dataset.theme;
}

describe("platform theme bootstrap", () => {
  it("uses the shared theme record before paint", () => {
    expect(
      paint({
        [themeStorage.name]: JSON.stringify({
          state: { activeMode: "light" },
          version: storage.version,
        }),
        "mydevstudio-theme": "dark",
      }),
    ).toBe("light");
  });

  it("ignores the old platform theme key", () => {
    expect(paint({ "mydevstudio-theme": "dark" })).toBe("light");
  });

  it("follows the device when the shared mode is system", () => {
    const record = JSON.stringify({ state: { activeMode: "system" }, version: storage.version });
    expect(paint({ [themeStorage.name]: record }, true)).toBe("dark");
    expect(paint({ [themeStorage.name]: record }, false)).toBe("light");
  });
});
