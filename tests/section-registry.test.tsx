import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import { RegisteredSections } from "../apps/web/features/portfolio/registered-sections";
import {
  getPortfolioSectionOrder,
  getPortfolioSections,
  portfolioSectionIds,
  portfolioSectionLabels,
} from "../packages/content/src/portfolio-sections";
import { portfolioTypes } from "../packages/content/src/portfolio-types";
import { profile } from "../packages/content/src/profile";
import { sectionRegistry } from "../packages/content/src/section-registry";
import { profileSchema } from "../packages/lib/src/domain/profile";
import { portfolioSectionSchema } from "../packages/lib/src/domain/section";

it("defines a valid existing renderer and real content binding for every section in every layout", () => {
  for (const { id: portfolioType } of portfolioTypes) {
    const saved = profileSchema.parse({ ...profile, portfolioType });
    const sections = getPortfolioSections(saved);
    expect(sections.map(({ id }) => id)).toEqual(
      getPortfolioSectionOrder(saved),
    );
    expect(sections).toHaveLength(6);
    for (const section of sections) {
      expect(portfolioSectionSchema.parse(section)).toEqual(section);
      expect(section.source.field in profile).toBe(true);
      expect(sectionRegistry[section.kind].name).toBe(
        portfolioSectionLabels[section.kind],
      );
    }
  }
});
it("preserves defaults for legacy documents, including designer work first and engineer timelines", () => {
  const legacy = getPortfolioSections({});
  expect(legacy.map(({ renderer }) => renderer)).toEqual([
    "about-card",
    "timeline",
    "project-cards",
    "skill-groups",
    "education-timeline",
    "language-list",
  ]);
  const designer = getPortfolioSections({ portfolioType: "designer" });
  expect(designer[0]?.renderer).toBe("project-gallery");
  expect(designer.find(({ kind }) => kind === "experience")?.source.field).toBe(
    "experiences",
  );
  for (const portfolioType of ["consultant", "minimal"] as const)
    expect(
      getPortfolioSections({ portfolioType }).find(
        ({ kind }) => kind === "projects",
      )?.renderer,
    ).toBe("project-list");
});
it("normalizes saved order without mutating or adding fields to a profile, with independent instance settings", () => {
  const saved = profileSchema.parse({
    ...profile,
    sectionOrder: [...portfolioSectionIds].reverse(),
  });
  const before = JSON.stringify(saved);
  const sections = getPortfolioSections(saved);
  expect(sections.map(({ id }) => id)).toEqual(saved.sectionOrder);
  if (sections[0]) sections[0].settings.visible = false;
  expect(getPortfolioSections(saved)[0]?.settings.visible).toBe(true);
  expect(JSON.stringify(saved)).toBe(before);
  expect("sections" in saved).toBe(false);
});
it("rejects unknown renderers, mismatched sources and extra executable settings", () => {
  const about = getPortfolioSections({})[0];
  for (const patch of [
    { renderer: "carousel" },
    { renderer: "timeline" },
    { source: { type: "profile", field: "projects" } },
    { source: { type: "url", field: "https://example.com" } },
    { kind: "custom" },
    { id: "another-section" },
    { settings: { visible: true, html: "<script>bad()</script>" } },
  ])
    expect(
      portfolioSectionSchema.safeParse({ ...about, ...patch }).success,
    ).toBe(false);
});
it("dispatches by renderer in saved order without introducing DOM wrappers", () => {
  const saved = {
    ...profile,
    sectionOrder: [...portfolioSectionIds].reverse(),
  };
  const markup = renderToStaticMarkup(
    <RegisteredSections
      profile={saved}
      renderers={{
        "about-card": <section>A</section>,
        timeline: <section>B</section>,
        "project-cards": <section>C</section>,
        "skill-groups": <section>D</section>,
        "education-timeline": <section>E</section>,
        "language-list": <section>F</section>,
      }}
    />,
  );
  expect(markup).toBe(
    "<section>F</section><section>E</section><section>D</section><section>C</section><section>B</section><section>A</section>",
  );
  expect(() =>
    renderToStaticMarkup(
      <RegisteredSections profile={profile} renderers={{}} />,
    ),
  ).toThrow(/Missing portfolio renderer/);
});
