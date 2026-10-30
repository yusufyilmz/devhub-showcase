import { expect, it } from "vitest";
import { profile } from "../packages/content/src/profile";
import {
  getPortfolioThemeVariables,
  getThemePalette,
  portfolioAccents,
  portfolioThemes,
} from "../packages/content/src/themes";
import { profileSchema } from "../packages/lib/src/domain/profile";

function luminance(rgb: string) {
  const [r = 0, g = 0, b = 0] = rgb
    .split(" ")
    .map(Number)
    .map((value) => {
      const channel = value / 255;
      return channel <= 0.04045
        ? channel / 12.92
        : ((channel + 0.055) / 1.055) ** 2.4;
    });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function contrast(first: string, second: string) {
  const firstLuminance = luminance(first);
  const secondLuminance = luminance(second);
  return (
    (Math.max(firstLuminance, secondLuminance) + 0.05) /
    (Math.min(firstLuminance, secondLuminance) + 0.05)
  );
}
it("keeps the original theme for legacy profiles and rejects unknown names", () => {
  expect(profileSchema.parse(profile).appearance?.theme).toBe("studio");
  expect(
    profileSchema.parse({
      ...profile,
      appearance: { accent: "violet", defaultTheme: "system" },
    }).appearance?.theme,
  ).toBe("studio");
  expect(
    profileSchema.safeParse({
      ...profile,
      appearance: { theme: "unknown", accent: "cyan", defaultTheme: "dark" },
    }).success,
  ).toBe(false);
});
it.each(portfolioThemes)(
  "$name has complete variables and readable light and dark palettes",
  ({ id }) => {
    const variables = getPortfolioThemeVariables(id);
    expect(variables["--portfolio-radius"]).toBeTruthy();
    for (const mode of ["light", "dark"] as const) {
      const palette = getThemePalette(id, mode);
      expect(variables[`--portfolio-bg-${mode}`]).toBe(palette.bg);
      expect(contrast(palette.text, palette.bg)).toBeGreaterThanOrEqual(4.5);
      expect(contrast(palette.muted, palette.surface)).toBeGreaterThanOrEqual(
        4.5,
      );
      for (const accent of Object.values(portfolioAccents))
        expect(contrast(accent[mode], palette.bg)).toBeGreaterThanOrEqual(4.5);
    }
  },
);
