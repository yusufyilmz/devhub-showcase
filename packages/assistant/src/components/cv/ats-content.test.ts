import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { profile } from "@shared/config";

import { createCvDefinition } from "./definition";
import { renderCv } from "./render";

const template = readFileSync(new URL("../../../templates/cv.json.hbs", import.meta.url), "utf8");
describe("ATS-friendly CV", () => {
  it.each(["ats", "ats-compact"] as const)(
    "uses a linear text flow and preserves exclusions in %s",
    async (cvLayout) => {
      const source = {
        ...profile,
        cvLayout,
        cvSettings: {
          fontSize: 10 as const,
          includeLanguages: false,
          includeProjects: true,
          pageSize: "A4" as const,
          showEmail: false,
          showPhone: false,
        },
        name: "Ada Şahin García",
        projects: profile.projects.map((item) => ({ ...item, public: false })),
        website: "https://example.com/ada",
      };
      const definition = createCvDefinition(source, template);
      const json = JSON.stringify(definition.content);
      expect(json).toContain(source.name);
      expect(json).toContain(source.website);
      expect(json).not.toContain('"columns"');
      expect(json).not.toContain('"table"');
      expect(json).not.toContain(source.email);
      expect(json).not.toContain(source.projects[0]!.name);
      expect(json.indexOf(source.experiences[0]!.company)).toBeLessThan(
        json.indexOf(source.education[0]!.institution),
      );
      const bytes = await renderCv(source, template);
      expect(bytes.subarray(0, 5).toString()).toBe("%PDF-");
    },
  );
});
