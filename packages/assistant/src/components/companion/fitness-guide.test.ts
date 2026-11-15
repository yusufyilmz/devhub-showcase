import { describe, expect, it, vi } from "vitest";

import { starterWorkspace } from "@shared/lib/workspace-defaults";

import { fitnessGuide } from "./fitness-guide";

describe("shared Fitness companion guide", () => {
  it("retains authenticated progress transport and derives progress from the supplied workspace", () => {
    const workspace = starterWorkspace();
    const request = vi.fn<typeof fetch>();
    const guide = fitnessGuide(workspace, "Today", true, request);
    expect(guide.progressRequest).toBe(request);
    expect(guide.progressHref).toBe("/api/companion-progress");
    expect(guide.paused).toBe(true);
    expect(guide.observed).toContain("private");
    expect(guide.observed).not.toContain("hydration");
    expect(request).not.toHaveBeenCalled();
  });
});
