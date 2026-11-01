import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { formatPortfolioPeriod, getPortfolioCopy, languages, profile } from "@shared/config";

import { createCvDefinition, renderCv } from "./cv";

const template = readFileSync(new URL("../templates/cv.json.hbs", import.meta.url), "utf8");

describe("Languages", () => {
  it.each(languages)("keeps the $id dictionary complete and formats current roles", ({ id }) => {
    expect(Object.keys(getPortfolioCopy(id)).sort()).toEqual(
      Object.keys(getPortfolioCopy()).sort(),
    );
    expect(Object.values(getPortfolioCopy(id)).every((value) => value.trim())).toBe(true);
    expect(formatPortfolioPeriod("2024-12-01", null, id)).toContain(getPortfolioCopy(id).present);
    expect(formatPortfolioPeriod("2024-12-01", "2025-01-01", id)).not.toContain(
      getPortfolioCopy(id).present,
    );
  });
  for (const { id } of languages) {
    it.each(["classic", "compact", "editorial"] as const)(
      `renders a %s PDF in ${id} without translating saved content`,
      async (cvLayout) => {
        const result = createCvDefinition(
          { ...profile, cvLanguage: id, cvLayout, portfolioLanguage: "tr" },
          template,
        );
        const json = JSON.stringify(result.content);
        expect(json).toContain(getPortfolioCopy(id).cvExperience);
        expect(json).toContain(getPortfolioCopy(id).cvEducation);
        expect(json).toContain(getPortfolioCopy(id).present);
        expect(json).toContain(profile.summary);
        const pdf = await renderCv({ ...profile, cvLanguage: id, cvLayout }, template);
        expect(pdf.subarray(0, 5).toString()).toBe("%PDF-");
      },
    );
  }
});
