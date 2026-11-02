import { describe, expect, it } from "vitest";

import { getThemePalette, portfolioAccents, portfolioThemes } from "@shared/config";

function luminance(rgb: string) {
  return rgb.split(" ").reduce((sum, channel, index) => {
    const value = Number(channel) / 255;
    const linear = value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
    return sum + linear * ([0.2126, 0.7152, 0.0722][index] ?? 0);
  }, 0);
}
function contrast(a: string, b: string) {
  const values = [luminance(a), luminance(b)];
  return (Math.max(...values) + 0.05) / (Math.min(...values) + 0.05);
}
describe("Portfolio text and filled-control contrast", () => {
  for (const theme of portfolioThemes)
    for (const mode of ["light", "dark"] as const) {
      it(`${theme.id} ${mode} keeps text readable on canvas, cards and accent controls`, () => {
        const palette = getThemePalette(theme.id, mode);
        expect(contrast(palette.text, palette.bg)).toBeGreaterThanOrEqual(4.5);
        expect(contrast(palette.text, palette.surface)).toBeGreaterThanOrEqual(4.5);
        for (const accent of Object.values(portfolioAccents)) {
          expect(contrast(palette.bg, accent[mode])).toBeGreaterThanOrEqual(4.5);
        }
      });
    }
});
