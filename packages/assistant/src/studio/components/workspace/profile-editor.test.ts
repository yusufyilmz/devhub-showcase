import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

const source = readFileSync(new URL("./profile-editor.tsx", import.meta.url), "utf8");

describe("ProfileEditor module graph", () => {
  it("keeps the initial editor clear of the full section and portfolio barrels", () => {
    expect(source).not.toContain('from "@shared/ui/sections"');
    expect(source).not.toContain("ui/src/sections");
    expect(source).not.toContain('from "../../../portfolio/components/index"');
    expect(source).toContain('from "../../../portfolio/components/profile-fields"');
  });

  it("dynamically imports the inactive studio editor tabs", () => {
    for (const component of [
      "AiAssistantEditor",
      "AiProfileEditor",
      "AppearanceEditor",
      "CvImportEditor",
      "CvSettingsEditor",
      "CustomSectionsEditor",
      "GoogleImportEditor",
      "LayoutEditor",
      "LanguageSettingsEditor",
      "PortfolioSetup",
      "PrivateCvVersions",
      "OwnerRevisionHistory",
      "FieldVisibilityEditor",
      "SectionSettingsEditor",
      "SectionsSettings",
    ]) {
      expect(source).toContain(`const ${component} = dynamic(`);
    }
    expect(source).toContain('import("@shared/ui/section-editors")');
    expect(source).toContain("{ loading: () => null }");
  });
});
