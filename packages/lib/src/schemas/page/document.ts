import { z } from "zod";

import {
  getSectionRenderers,
  layoutSupportsRegion,
  type PortfolioProfile,
  type PortfolioSiteDocument,
  pageKinds,
  pageLayoutIds,
  pageLimits,
  pageRegionIds,
  placementSurfaces,
  placementWidths,
  portfolioSectionIds,
  sectionRegistry,
} from "@shared/config";

const uuid = z.uuid();
const slug = z
  .string()
  .trim()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use a lowercase slug");
const rendererForIntro = new Set(["intro", "hero-cover", "hero-centered"]);

const referenceSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("profile-intro") }).strict(),
  z.object({ type: z.literal("profile-contact") }).strict(),
  z
    .object({
      kind: z.enum(portfolioSectionIds),
      type: z.literal("profile-section"),
    })
    .strict(),
  z
    .object({
      id: z.string().regex(/^custom-[A-Za-z0-9_-]+$/, "Use an existing custom section ID"),
      type: z.literal("custom-section"),
    })
    .strict(),
]);

const placementSchema = z
  .object({
    id: uuid,
    presentation: z
      .object({
        renderer: z.string().trim().min(1).max(80),
        surface: z.enum(placementSurfaces),
        width: z.enum(placementWidths),
      })
      .strict(),
    reference: referenceSchema,
    region: z.enum(pageRegionIds),
    visible: z.boolean(),
  })
  .strict();

const pageSchema = z
  .object({
    description: z.string().trim().max(300).optional(),
    id: uuid,
    kind: z.enum(pageKinds),
    layout: z.enum(pageLayoutIds),
    placements: z.array(placementSchema).max(pageLimits.placementsPerPage),
    published: z.boolean(),
    slug,
    socialImage: z.string().trim().max(2000).optional(),
    title: z.string().trim().min(1).max(120),
  })
  .strict();

export const siteDocumentSchema = z
  .object({
    homePageId: uuid,
    navigation: z.array(z.object({ pageId: uuid }).strict()).max(pageLimits.pages),
    pages: z.array(pageSchema).min(1).max(pageLimits.pages),
    schemaVersion: z.literal(1),
  })
  .strict();

function rendererAllowed(profile: PortfolioProfile, placement: z.infer<typeof placementSchema>) {
  const reference = placement.reference;
  const renderer = placement.presentation.renderer;
  if (reference.type === "profile-intro") return rendererForIntro.has(renderer);
  if (reference.type === "profile-contact") return renderer === "contact";
  if (reference.type === "profile-section") {
    return (sectionRegistry[reference.kind].renderers as readonly string[]).includes(renderer);
  }
  const section = profile.customSections?.find((item) => item.id === reference.id);
  if (!section) return false;
  const allowed = section.sectionType ? getSectionRenderers(section.sectionType) : section.renderer;
  return (allowed as readonly string[]).includes(renderer) || renderer === section.renderer;
}

function issue(ctx: z.RefinementCtx, message: string, path: (string | number)[]) {
  ctx.addIssue({ code: "custom", message, path });
}

export function refineSite(profile: PortfolioProfile, ctx: z.RefinementCtx) {
  if (!profile.site) return;
  const parsed = siteDocumentSchema.safeParse(profile.site);
  if (!parsed.success) {
    for (const item of parsed.error.issues)
      issue(ctx, item.message, [
        "site",
        ...item.path.flatMap((part) => (typeof part === "symbol" ? [] : [part])),
      ]);
    return;
  }
  const site = parsed.data;
  const pageIds = site.pages.map((page) => page.id);
  if (new Set(pageIds).size !== pageIds.length)
    issue(ctx, "Each page needs a unique ID", ["site", "pages"]);
  if (!pageIds.includes(site.homePageId))
    issue(ctx, "Choose an existing homepage", ["site", "homePageId"]);
  const slugs = site.pages.map((page) => page.slug);
  if (new Set(slugs).size !== slugs.length)
    issue(ctx, "Each page needs a unique slug", ["site", "pages"]);
  const placementIds = site.pages.flatMap((page) => page.placements.map((item) => item.id));
  if (placementIds.length > pageLimits.placementsPerSite)
    issue(ctx, "Use at most 200 placements", ["site", "pages"]);
  if (new Set(placementIds).size !== placementIds.length)
    issue(ctx, "Each placement needs a unique ID", ["site", "pages"]);
  site.navigation.forEach((item, index) => {
    if (!pageIds.includes(item.pageId))
      issue(ctx, "Navigation must point at a page", ["site", "navigation", index, "pageId"]);
  });
  site.pages.forEach((page, pageIndex) => {
    page.placements.forEach((placement, placementIndex) => {
      const path = ["site", "pages", pageIndex, "placements", placementIndex];
      if (!layoutSupportsRegion(page.layout, placement.region))
        issue(ctx, "That region is not available in this layout", [...path, "region"]);
      const reference = placement.reference;
      if (reference.type === "custom-section") {
        const section = profile.customSections?.find((item) => item.id === reference.id);
        if (!section) issue(ctx, "Choose an existing custom section", [...path, "reference", "id"]);
      }
      if (!rendererAllowed(profile, placement))
        issue(ctx, "That variant does not fit this section", [...path, "presentation", "renderer"]);
    });
  });
  const bytes = new TextEncoder().encode(JSON.stringify(profile)).length;
  if (bytes > pageLimits.bytes) issue(ctx, "Profile exceeds the 250000 byte limit", ["site"]);
}

export function validateSite(profile: PortfolioProfile): PortfolioSiteDocument | undefined {
  if (!profile.site) return undefined;
  const issues: z.core.$ZodIssue[] = [];
  refineSite(profile, {
    addIssue: (item: { message?: string; path?: PropertyKey[] }) =>
      issues.push({
        code: "custom",
        message: item.message ?? "Invalid page document",
        path: (item.path ?? []).filter((part) => typeof part !== "symbol"),
      } as z.core.$ZodIssue),
  } as unknown as z.RefinementCtx);
  if (issues.length > 0) throw new z.ZodError(issues);
  return siteDocumentSchema.parse(profile.site) as PortfolioSiteDocument;
}

export function validateSitePublication(profile: PortfolioProfile) {
  const site = validateSite(profile);
  if (!site) return;
  const home = site.pages.find((page) => page.id === site.homePageId);
  const visible = home?.published && home.placements.some((placement) => placement.visible);
  if (!visible) {
    throw new z.ZodError([
      {
        code: "custom",
        message: "Publish a homepage with visible content first",
        path: ["site", "homePageId"],
      },
    ]);
  }
}
