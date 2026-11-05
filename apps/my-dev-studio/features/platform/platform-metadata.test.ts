import { describe, expect, it } from "vitest";

import {
  isPlatformPath,
  platformMetadata,
  platformStructuredData,
  siteUrl,
} from "@/features/platform/platform";

describe("PlatformMetadata", () => {
  it("brands platform routes separately from personal portfolios and editors", () => {
    for (const path of [
      "/",
      "/login",
      "/alice/chat",
      "/admin/portfolios",
      "/admin/portfolios/record",
      "/p/examples",
      "/p/examples/maya-chen",
    ])
      expect(isPlatformPath(path)).toBe(true);
    for (const path of [
      "/alice",
      "/alice/edit",
      "/admin",
      "/reviews",
      "/p/examplesish",
      "/examples",
    ])
      expect(isPlatformPath(path)).toBe(false);
  });
  it("uses platform metadata and WebSite structured data without personal CV facts", () => {
    expect(platformStructuredData["@type"]).toBe("WebSite");
    expect(platformStructuredData.name).toBe("MyDevStudio");
    expect(platformMetadata.alternates?.canonical).toBe(siteUrl);
    expect(JSON.stringify([platformMetadata, platformStructuredData])).not.toMatch(
      /Yusuf|yilmazyu|jobTitle|alumniOf|worksFor/,
    );
  });
});
