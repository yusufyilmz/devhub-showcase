import { describe, expect, it } from "vitest";

import { profile } from "../profile/profile";
import { createSiteFromLegacy } from "./legacy";
import { builderSnapshotIsPublic } from "./public-projection";

describe("published builder snapshots", () => {
  it("keeps a legacy profile public and rejects a builder snapshot without a published homepage", () => {
    expect(builderSnapshotIsPublic(profile)).toBe(true);
    const site = createSiteFromLegacy(profile, () => "00000000-0000-4000-8000-000000000001");
    expect(builderSnapshotIsPublic({ ...profile, site })).toBe(false);
    const home = site.pages[0];
    if (!home) throw new Error("missing homepage");
    home.published = true;
    expect(builderSnapshotIsPublic({ ...profile, site })).toBe(true);
    home.placements = home.placements.map((placement) => ({ ...placement, visible: false }));
    expect(builderSnapshotIsPublic({ ...profile, site })).toBe(false);
  });
});
