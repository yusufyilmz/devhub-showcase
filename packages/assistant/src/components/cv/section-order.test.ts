import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { profile } from "@shared/config";

import { createCvData } from "./data";
import { createCvDefinition } from "./definition";
import { orderCvContent } from "./section-order";

const template = readFileSync(new URL("../../../templates/cv.json.hbs", import.meta.url), "utf8");
describe("CV version order", () => {
  it.each(["ats", "classic", "editorial", "compact", "ats-compact"] as const)(
    "retains header and every selected section in %s",
    (cvLayout) => {
      const source = { ...profile, cvLayout };
      const data = createCvData(source);
      const definition = createCvDefinition(source, template);
      orderCvContent(definition, data, [
        "languages",
        "education",
        "skills",
        "projects",
        "experience",
      ]);
      const json = JSON.stringify(definition.content);
      expect(json.indexOf(data.labels.cvLanguages)).toBeLessThan(
        json.indexOf(data.labels.cvEducation),
      );
      expect(json.indexOf(data.labels.cvEducation)).toBeLessThan(
        json.indexOf(data.labels.cvExperience),
      );
      expect(json).toContain(source.name);
      expect(json).toContain(source.experiences[0]!.company);
    },
  );
});
