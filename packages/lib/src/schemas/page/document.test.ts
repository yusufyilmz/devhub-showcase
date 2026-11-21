import { describe, expect, it } from "vitest";

import {
  createSiteFromLegacy,
  type PortfolioProfile,
  profile,
  projectPublicProfile,
} from "@shared/config";

import { buildPublicPortfolioKnowledge } from "../profile/portfolio-knowledge";
import { validateProfile } from "../profile/profile";
import { validateSite, validateSitePublication } from "./document";

const ids = [
  "00000000-0000-4000-8000-000000000001",
  "00000000-0000-4000-8000-000000000002",
  "00000000-0000-4000-8000-000000000003",
  "00000000-0000-4000-8000-000000000004",
  "00000000-0000-4000-8000-000000000005",
  "00000000-0000-4000-8000-000000000006",
  "00000000-0000-4000-8000-000000000007",
  "00000000-0000-4000-8000-000000000008",
  "00000000-0000-4000-8000-000000000009",
  "00000000-0000-4000-8000-000000000010",
  "00000000-0000-4000-8000-000000000011",
  "00000000-0000-4000-8000-000000000012",
  "00000000-0000-4000-8000-000000000013",
  "00000000-0000-4000-8000-000000000014",
  "00000000-0000-4000-8000-000000000015",
  "00000000-0000-4000-8000-000000000016",
  "00000000-0000-4000-8000-000000000017",
  "00000000-0000-4000-8000-000000000018",
  "00000000-0000-4000-8000-000000000019",
  "00000000-0000-4000-8000-000000000020",
];

function nextIds() {
  let index = 0;
  return () => {
    const id = ids[index];
    index += 1;
    if (!id) throw new Error("test ran out of ids");
    return id;
  };
}

function draft(patch: Partial<PortfolioProfile> = {}): PortfolioProfile {
  return { ...structuredClone(profile), ...patch };
}

describe("page documents", () => {
  it("legacy_profile_without_site_is_unchanged", () => {
    const source = draft();
    expect(validateSite(source)).toBeUndefined();
    const projected = projectPublicProfile(source, "website");
    expect(projected.site).toBeUndefined();
    expect(projected.experiences.map((item) => item.id)).toEqual(
      projectPublicProfile(draft(), "website").experiences.map((item) => item.id),
    );
    expect(validateProfile(source).site).toBeUndefined();
  });

  it("conversion_preserves_hidden_order_and_renderers", () => {
    const source = draft({
      customSections: [
        {
          id: "custom-awards",
          items: [],
          renderer: "cards",
          sectionType: "awards",
          title: "Awards",
          visible: false,
        },
      ],
      hero: {
        kind: "image",
        overlay: "soft",
        position: "center",
        url: "https://example.com/hero.jpg",
      },
      sectionSequence: [
        "projects",
        "custom-awards",
        "about",
        "experience",
        "skills",
        "education",
        "languages",
      ],
      sectionSettings: { experience: { renderer: "experience-tabs", visible: false } },
    });
    const site = createSiteFromLegacy(source, nextIds());
    const home = site.pages[0];
    expect(home?.published).toBe(false);
    expect(home?.placements.map((item) => item.reference)).toEqual([
      { type: "profile-intro" },
      { kind: "projects", type: "profile-section" },
      { id: "custom-awards", type: "custom-section" },
      { kind: "about", type: "profile-section" },
      { kind: "experience", type: "profile-section" },
      { kind: "skills", type: "profile-section" },
      { kind: "education", type: "profile-section" },
      { kind: "languages", type: "profile-section" },
    ]);
    const experience = home?.placements.find(
      (item) => item.reference.type === "profile-section" && item.reference.kind === "experience",
    );
    const awards = home?.placements.find((item) => item.reference.type === "custom-section");
    expect(experience).toMatchObject({
      presentation: { renderer: "experience-tabs" },
      visible: false,
    });
    expect(awards).toMatchObject({ presentation: { renderer: "cards" }, visible: false });
    expect(validateSite({ ...source, site })).toMatchObject({ homePageId: home?.id });
  });

  it("rejects_duplicate_or_dangling_ids", () => {
    const source = draft();
    const site = createSiteFromLegacy(source, nextIds());
    const home = site.pages[0];
    if (!home) throw new Error("missing homepage");
    home.id = site.homePageId;
    site.pages.push({ ...home, slug: "copy" });
    expect(() => validateSite({ ...source, site })).toThrow(/unique ID/);
    const dangling = createSiteFromLegacy(source, nextIds());
    dangling.homePageId = "00000000-0000-4000-8000-000000000099";
    expect(() => validateSite({ ...source, site: dangling })).toThrow(/homepage/);
  });

  it("rejects_incompatible_variants_and_regions", () => {
    const source = draft({
      customSections: [
        {
          id: "custom-faq",
          items: [],
          renderer: "accordion",
          sectionType: "faq",
          title: "FAQ",
          visible: true,
        },
      ],
    });
    const site = createSiteFromLegacy(source, nextIds());
    const placement = site.pages[0]?.placements.find(
      (item) => item.reference.type === "custom-section",
    );
    if (!placement) throw new Error("missing custom placement");
    placement.presentation.renderer = "gallery";
    expect(() => validateSite({ ...source, site })).toThrow(/variant/);
    placement.presentation.renderer = "accordion";
    placement.region = "aside";
    expect(() => validateSite({ ...source, site })).toThrow(/region/);
  });

  it("rejects_page_and_byte_limits", () => {
    const source = draft();
    const site = createSiteFromLegacy(source, nextIds());
    const home = site.pages[0];
    if (!home) throw new Error("missing homepage");
    site.pages = Array.from({ length: 13 }, (_, index) => ({
      ...structuredClone(home),
      id: `00000000-0000-4000-8000-${String(index + 1).padStart(12, "0")}`,
      slug: `page-${index + 1}`,
    }));
    site.homePageId = site.pages[0]?.id ?? site.homePageId;
    expect(() => validateSite({ ...source, site })).toThrow(/at most 12|Too big|too big/i);

    const sample = profile.projects[0];
    if (!sample) throw new Error("missing project fixture");
    const large = draft({
      projects: Array.from({ length: 60 }, (_, index) => ({
        ...sample,
        description: "x".repeat(5000),
        experienceId: null,
        id: `project-${index}`,
        public: true,
      })),
    });
    expect(validateProfile(large).projects).toHaveLength(60);
    expect(() =>
      validateProfile({ ...large, site: createSiteFromLegacy(large, nextIds()) }),
    ).toThrow(/250000/);
  });

  it("public_projection_prunes_private_sources_and_unpublished_pages", () => {
    const secret = "unpublished-article-secret-token";
    const hiddenSecret = "hidden-only-source-secret";
    const source = draft({
      customSections: [
        {
          id: "custom-notes",
          items: [
            {
              body: secret,
              id: "00000000-0000-4000-8000-0000000000aa",
              title: "Private note",
              url: "",
            },
          ],
          renderer: "text",
          sectionType: "legal-text",
          title: "Notes",
          visible: true,
        },
        {
          id: "custom-hidden",
          items: [
            {
              body: hiddenSecret,
              id: "00000000-0000-4000-8000-0000000000ab",
              title: "Hidden note",
              url: "",
            },
          ],
          renderer: "text",
          sectionType: "legal-text",
          title: "Hidden",
          visible: true,
        },
        {
          id: "custom-shared",
          items: [
            {
              body: "shared-visible-copy",
              id: "00000000-0000-4000-8000-0000000000ac",
              title: "Shared",
              url: "",
            },
          ],
          renderer: "text",
          sectionType: "legal-text",
          title: "Shared",
          visible: true,
        },
      ],
    });
    const site = createSiteFromLegacy(source, nextIds());
    const home = site.pages[0];
    if (!home) throw new Error("missing homepage");
    home.published = true;
    home.placements = home.placements.filter((item) => item.reference.type === "profile-section");
    home.placements.push(
      {
        id: "00000000-0000-4000-8000-000000000021",
        presentation: { renderer: "text", surface: "plain", width: "contained" },
        reference: { id: "custom-hidden", type: "custom-section" },
        region: "main",
        visible: false,
      },
      {
        id: "00000000-0000-4000-8000-000000000022",
        presentation: { renderer: "text", surface: "plain", width: "contained" },
        reference: { id: "custom-shared", type: "custom-section" },
        region: "main",
        visible: true,
      },
      {
        id: "00000000-0000-4000-8000-000000000023",
        presentation: { renderer: "text", surface: "plain", width: "reading" },
        reference: { id: "custom-shared", type: "custom-section" },
        region: "main",
        visible: true,
      },
    );
    site.pages.push({
      ...structuredClone(home),
      id: "00000000-0000-4000-8000-000000000024",
      kind: "article",
      placements: [
        {
          id: "00000000-0000-4000-8000-000000000025",
          presentation: { renderer: "text", surface: "plain", width: "reading" },
          reference: { id: "custom-notes", type: "custom-section" },
          region: "main",
          visible: true,
        },
      ],
      published: false,
      slug: "private-note",
      title: "Private note",
    });
    site.navigation.push({ pageId: "00000000-0000-4000-8000-000000000024" });
    const owned = { ...source, site };
    expect(validateSitePublication(owned)).toBeUndefined();
    const projected = projectPublicProfile(owned, "website");
    const json = JSON.stringify(projected);
    expect(json).not.toContain(secret);
    expect(json).not.toContain(hiddenSecret);
    const knowledge = JSON.stringify(
      buildPublicPortfolioKnowledge({
        id: "page-owner",
        isPublic: true,
        profile: owned,
        revision: 1,
        updatedAt: "",
        username: "page-owner",
      }),
    );
    expect(knowledge).not.toContain(secret);
    expect(knowledge).not.toContain(hiddenSecret);
    expect(json).toContain("shared-visible-copy");
    expect(projected.customSections?.map((section) => section.id)).toEqual(["custom-shared"]);
    expect(projected.site?.pages.map((page) => page.slug)).toEqual(["home"]);
    expect(projected.site?.navigation).toEqual([{ pageId: site.homePageId }]);
    expect(
      validateSite(projected)?.pages[0]?.placements.filter(
        (item) => item.reference.type === "custom-section",
      ),
    ).toHaveLength(2);
  });

  it("cv_projection_omits_site", () => {
    const source = draft({ site: createSiteFromLegacy(draft(), nextIds()) });
    const projected = projectPublicProfile(source, "cv");
    expect(projected.site).toBeUndefined();
    expect(JSON.stringify(projected)).not.toContain("schemaVersion");
  });

  it("blocks publication of an unpublished homepage without rejecting the draft", () => {
    const source = draft({ site: createSiteFromLegacy(draft(), nextIds()) });
    expect(validateSite(source)?.pages[0]?.published).toBe(false);
    expect(() => validateSitePublication(source)).toThrow(/homepage/);
  });
});
