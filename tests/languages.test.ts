import { readFileSync } from "node:fs";

import { createCvDefinition, renderCv } from "@shared/cv";
import { expect, it } from "vitest";

import {
  formatPortfolioPeriod,
  getPortfolioCopy,
  languages,
} from "../packages/content/src/languages";
import { profile } from "../packages/content/src/profile";
import { profileSchema } from "../packages/lib/src/domain/profile";

const template = readFileSync(
  new URL("../packages/cv/templates/cv.json.hbs", import.meta.url),
  "utf8",
);
it("defaults legacy profiles to English and rejects unsupported languages", () => {
  const result = profileSchema.parse(profile);
  expect(result.portfolioLanguage).toBe("en");
  expect(result.cvLanguage).toBe("en");
  expect(profileSchema.safeParse({ ...profile, portfolioLanguage: "unknown" }).success).toBe(false);
  expect(profileSchema.safeParse({ ...profile, cvLanguage: "<script>" }).success).toBe(false);
});
it.each(languages)("keeps the $id dictionary complete and formats current roles", ({ id }) => {
  expect(Object.keys(getPortfolioCopy(id)).sort()).toEqual(Object.keys(getPortfolioCopy()).sort());
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
