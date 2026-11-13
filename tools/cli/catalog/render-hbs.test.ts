import { describe, expect, it } from "vitest";

import { packageGuidance, renderHbs } from "./render-hbs.ts";

describe("catalog handlebars template", () => {
  it("renders the shared lookup guide and keeps package guidance", () => {
    const rendered = renderHbs(
      "# {{title}}\n\nQuery `{{query}}` for {{name}}.{{#if guidance}}\n\n{{{guidance}}}{{/if}}\n",
      {
        guidance: "Use the logger export.",
        name: "@shared/utils",
        query: "logger",
        title: "Utils catalog",
      },
    );
    expect(rendered).toContain("Query `logger` for @shared/utils.");
    expect(rendered).toContain("Use the logger export.");
  });

  it("drops the shared lookup block when recovering package guidance", () => {
    const guidance = packageGuidance(
      '<!-- Generated from catalog.template.md -->\n\n# Utils catalog\n\n> **AI lookup guide:** run lookup catalog "logger".\n\nLogging helpers.\n\n## Generated package reference\n\n| Import |\n',
    );
    expect(guidance).toBe("Logging helpers.");
  });
});
