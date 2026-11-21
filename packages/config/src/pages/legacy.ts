import { getPortfolioSections } from "../portfolio/portfolio-sections";
import type { PortfolioProfile } from "../profile/profile";
import { getPortfolioEntries } from "../sections/custom-sections";
import type { PageDocument, PortfolioSiteDocument, SectionPlacement } from "./types";

function placement(
  id: string,
  region: SectionPlacement["region"],
  visible: boolean,
  reference: SectionPlacement["reference"],
  renderer: string,
): SectionPlacement {
  return {
    id,
    presentation: { renderer, surface: "plain", width: region === "hero" ? "bleed" : "contained" },
    reference,
    region,
    visible,
  };
}

/** Draft homepage from the current order. Does not publish or copy canonical facts. */
export function createSiteFromLegacy(
  profile: PortfolioProfile,
  newId: () => string,
): PortfolioSiteDocument {
  const placements: SectionPlacement[] = [];
  if (profile.hero) {
    placements.push(placement(newId(), "hero", true, { type: "profile-intro" }, "hero-cover"));
  }
  for (const entry of getPortfolioEntries(profile)) {
    if ("kind" in entry && entry.kind !== "custom") {
      const section = getPortfolioSections(profile).find((item) => item.kind === entry.kind);
      placements.push(
        placement(
          newId(),
          "main",
          section?.settings.visible ?? true,
          { kind: entry.kind, type: "profile-section" },
          section?.renderer ?? "list",
        ),
      );
      continue;
    }
    if (entry.id.startsWith("custom-")) {
      placements.push(
        placement(
          newId(),
          "main",
          entry.visible,
          { id: entry.id, type: "custom-section" },
          entry.renderer,
        ),
      );
    }
  }
  const homePageId = newId();
  const home: PageDocument = {
    id: homePageId,
    kind: "portfolio",
    layout: "flow",
    placements,
    published: false,
    slug: "home",
    title: profile.title || "Home",
  };
  return {
    homePageId,
    navigation: [{ pageId: homePageId }],
    pages: [home],
    schemaVersion: 1,
  };
}
