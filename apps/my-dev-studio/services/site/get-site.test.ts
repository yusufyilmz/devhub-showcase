import { describe, expect, it } from "vitest";

import { isPlatformPath, isStudioPath } from "./get-site";

describe("platform route classification", () => {
  it("skips personal profile loads on platform and Studio shell routes", () => {
    for (const path of [
      "/",
      "/login",
      "/studio",
      "/studio/jobs",
      "/studio/billing",
      "/studio/trello",
      "/studio/calendar",
      "/studio/chat",
      "/studio/portfolios",
      "/reviews",
      "/p/examples/maya-chen",
    ]) {
      expect(isPlatformPath(path), path).toBe(true);
    }
  });

  it("preserves public portfolio and editor routing", () => {
    for (const path of ["/ada", "/ada/edit", "/studio-engineer", "/studio-engineer/edit"]) {
      expect(isPlatformPath(path), path).toBe(false);
    }
    // Public access/chat are already platform routes; do not rewrite their lookup path here.
    expect(isPlatformPath("/ada/chat")).toBe(true);
    expect(isPlatformPath("/ada/access")).toBe(true);
    expect(isStudioPath("/studio-engineer")).toBe(false);
  });
});
