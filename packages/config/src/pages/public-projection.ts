import type { PortfolioSectionId } from "../portfolio/portfolio-sections";
import { portfolioSectionIds } from "../portfolio/portfolio-sections";
import type { PortfolioProfile } from "../profile/profile";
import type { CustomSectionId } from "../sections/custom-sections";
import type { PortfolioSiteDocument, SectionPlacement } from "./types";

const contactKeys = ["email", "phone", "location", "website", "github", "linkedin"] as const;

type Reach = {
  contact: boolean;
  custom: Set<string>;
  intro: boolean;
  kinds: Set<string>;
};

function remember(placement: SectionPlacement, reach: Reach) {
  const reference = placement.reference;
  if (reference.type === "custom-section") reach.custom.add(reference.id);
  if (reference.type === "profile-section") reach.kinds.add(reference.kind);
  if (reference.type === "profile-intro") reach.intro = true;
  if (reference.type === "profile-contact") reach.contact = true;
}

function clearPrivateCanvas(profile: PortfolioProfile, site: PortfolioSiteDocument) {
  profile.about = [];
  profile.customSections = [];
  profile.education = [];
  profile.experiences = [];
  profile.languages = [];
  profile.projects = [];
  profile.sectionSequence = undefined;
  profile.site = { ...site, navigation: [], pages: [] };
  profile.skills = {};
  profile.summary = "";
  for (const key of contactKeys) profile[key] = "";
}

function hideUnreached(profile: PortfolioProfile, reach: Reach) {
  if (portfolioSectionIds.every((kind) => reach.kinds.has(kind))) return;
  const settings = { ...profile.sectionSettings };
  for (const kind of portfolioSectionIds) {
    if (reach.kinds.has(kind)) continue;
    const hidden = { ...settings[kind], visible: false as const };
    (settings as Record<PortfolioSectionId, typeof hidden>)[kind] = hidden;
    clearKind(profile, kind, reach.intro);
  }
  profile.sectionSettings = settings;
}

function clearKind(profile: PortfolioProfile, kind: PortfolioSectionId, intro: boolean) {
  if (kind === "about" && !intro) profile.about = [];
  if (kind === "education") profile.education = [];
  if (kind === "experience") profile.experiences = [];
  if (kind === "languages") profile.languages = [];
  if (kind === "projects") profile.projects = [];
  if (kind === "skills") profile.skills = {};
}

function publishedSite(site: PortfolioSiteDocument, pages: PortfolioSiteDocument["pages"]) {
  const pageIds = new Set(pages.map((page) => page.id));
  const customIds = new Set(
    pages.flatMap((page) =>
      page.placements.flatMap((placement) =>
        placement.visible && placement.reference.type === "custom-section"
          ? [placement.reference.id]
          : [],
      ),
    ),
  );
  return {
    customIds,
    site: {
      ...site,
      navigation: site.navigation.filter((item) => pageIds.has(item.pageId)),
      pages: pages.map((page) => ({
        ...page,
        placements: page.placements.filter(
          (placement) =>
            placement.visible &&
            (placement.reference.type !== "custom-section" ||
              customIds.has(placement.reference.id)),
        ),
      })),
    },
  };
}

/** A profile with no site still uses the legacy page. A builder snapshot needs a published homepage. */
export function builderSnapshotIsPublic(profile: PortfolioProfile) {
  const site = profile.site;
  if (!site) return true;
  const home = site.pages.find((page) => page.id === site.homePageId);
  return Boolean(home?.published && home.placements.some((placement) => placement.visible));
}

/** Drop builder-only data from a public or CV projection. No-site profiles stay untouched. */
export function projectBuilderProfile(profile: PortfolioProfile): PortfolioProfile {
  const site = profile.site;
  if (!site) return profile;
  const pages = site.pages.filter((page) => page.published);
  const home = pages.find((page) => page.id === site.homePageId);
  if (!home?.placements.some((placement) => placement.visible)) {
    clearPrivateCanvas(profile, site);
    return profile;
  }
  const reach: Reach = { contact: false, custom: new Set(), intro: false, kinds: new Set() };
  for (const page of pages)
    for (const placement of page.placements) if (placement.visible) remember(placement, reach);
  profile.customSections = (profile.customSections ?? []).filter((section) =>
    reach.custom.has(section.id),
  );
  if (!reach.intro && !reach.kinds.has("about")) {
    profile.about = [];
    profile.summary = "";
  }
  if (!reach.contact) for (const key of contactKeys) profile[key] = "";
  hideUnreached(profile, reach);
  const published = publishedSite(site, pages);
  profile.site = published.site;
  profile.sectionSequence = profile.sectionSequence?.filter(
    (id) => !id.startsWith("custom-") || published.customIds.has(id as CustomSectionId),
  );
  return profile;
}
