import { describe, expect, it, vi } from "vitest";

import { profile } from "@shared/config";

vi.mock("@shared/templates", () => ({ renderCv: async () => new Uint8Array([37, 80, 68, 70]) }));
vi.mock("@shared/templates/cv.hbs", () => ({ default: "fixture-template" }));

import { cvResponse } from "./cv-response";

describe("unlisted CV indexing", () => {
  it("keeps downloads accessible by link while requesting no indexing or caching", async () => {
    const response = await cvResponse({
      profile: { ...profile, publicationVisibility: "unlisted" },
      revision: 3,
      updatedAt: "",
    });
    expect(response.status).toBe(200);
    expect(response.headers.get("x-robots-tag")).toBe("noindex, nofollow");
    expect(response.headers.get("cache-control")).toBe("private, no-store");
  });
});
