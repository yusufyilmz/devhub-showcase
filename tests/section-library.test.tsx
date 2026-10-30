// @vitest-environment jsdom

import { renderToStaticMarkup } from "react-dom/server";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";

import {
  authorableSections,
  authorableSectionTypes,
  type CustomSection,
  resolveSectionSource,
} from "../packages/content/src";
import { profile } from "../packages/content/src/profile";
import { importPageForge, parseSectionFile } from "../packages/lib/src/domain/pageforge-import";
import { profileSchema } from "../packages/lib/src/domain/profile";
import { customSectionSchema } from "../packages/lib/src/domain/section";
import {
  applySectionTemplate,
  createSectionTemplate,
  emptySection,
  sectionTemplateFileSchema,
} from "../packages/lib/src/domain/section-templates";
import { sectionEditors } from "../packages/sections/src/editors";
import { sectionRenderers } from "../packages/sections/src/renderers";
import { LocationMap } from "../packages/sections/src/shared/interactive";

let sequence = 0;
const newId = () => `12345678-1234-4234-8234-${String(++sequence).padStart(12, "0")}`;
afterEach(cleanup);
it("provides working public renderer and editor entry points for all 42 source section families and native additions", () => {
  const fixture = JSON.parse(
    readFileSync(resolve("tests/fixtures/pageforge-sections.json"), "utf8"),
  );
  expect(fixture.content.main[0].blocks).toHaveLength(42);
  for (const type of authorableSectionTypes) {
    const component = authorableSections[type].name.replaceAll(" ", "");
    const path = resolve(`packages/sections/src/${type}-section/index.tsx`);
    expect(existsSync(path), `${component} folder`).toBe(true);
    const section = customSectionSchema.parse({
      ...emptySection(type, newId),
      items: [
        {
          body: "Escaped <script> text",
          code: "const value = 1",
          details: ["One feature"],
          id: newId(),
          period: "2026",
          title: "Sample item",
          url:
            type === "instagram"
              ? "https://www.instagram.com/p/ABC/"
              : type === "pinterest"
                ? "https://www.pinterest.com/pin/123/"
                : "https://youtu.be/M7lc1UVf-VE",
          value: "12",
        },
      ],
      options: {
        actionUrl: "https://example.test/subscribe",
        description: "A section introduction",
        email: "contact@example.test",
        latitude: 41,
        longitude: 2,
      },
    });
    // Provider-specific URLs are validated separately below.
    const View = sectionRenderers[type];
    expect(renderToStaticMarkup(<View section={section} />)).toContain(section.title);
    const Editor = sectionEditors[type];
    expect(renderToStaticMarkup(<Editor onChange={() => {}} section={section} />)).toContain(
      "Section description",
    );
  }
});
it("converts every source family from PageForge main blocks and reports integration adaptations", () => {
  const raw = readFileSync(resolve("tests/fixtures/pageforge-sections.json"), "utf8");
  const result = importPageForge(parseSectionFile(raw), newId);
  expect(result.document.sections).toHaveLength(42);
  expect(new Set(result.document.sections.map(({ sectionType }) => sectionType)).size).toBe(42);
  expect(
    result.document.sections.find(({ sectionType }) => sectionType === "testimonials")?.items[0]
      ?.title,
  ).toBe("Example Author");
  expect(
    result.document.sections.find(({ sectionType }) => sectionType === "faq")?.items[0]?.body,
  ).toContain("With clear sections.");
  expect(
    result.document.sections.find(({ sectionType }) => sectionType === "map")?.options?.latitude,
  ).toBe(41.38);
  expect(result.warnings.some((warning) => warning.includes("External endpoints"))).toBe(true);
  expect(
    profileSchema.parse({
      ...profile,
      customSections: result.document.sections,
    }).customSections,
  ).toHaveLength(42);
});
it("rejects unsafe imports, schema mismatches and unsupported formats without partially applying them", () => {
  expect(() => parseSectionFile('{"__proto__":{"polluted":true}}')).toThrow();
  expect(() => parseSectionFile("x".repeat(500_001))).toThrow("500 KB");
  expect(() =>
    importPageForge([{ content: { title: "Unknown" }, type: "unknown" }], newId),
  ).toThrow("Unsupported");
  expect(() =>
    importPageForge(
      [
        {
          content: { backgroundImage: "javascript:alert(1)", title: "Bad" },
          type: "hero",
        },
      ],
      newId,
    ),
  ).toThrow();
  expect(() =>
    sectionTemplateFileSchema.parse({
      format: "mydevstudio.sections",
      includesContent: false,
      name: "Future",
      sections: [],
      version: 2,
    }),
  ).toThrow();
  expect(
    customSectionSchema.safeParse({
      ...emptySection("map", newId),
      options: { latitude: 91, longitude: 0 },
    }).success,
  ).toBe(false);
  expect(
    customSectionSchema.safeParse({
      ...emptySection("hero", newId),
      renderer: "tabs",
    }).success,
  ).toBe(false);
});
it("resolves relative assets only against an explicitly supplied source origin", () => {
  const blocks = [
    {
      content: {
        images: [{ alt: "Work", src: "/images/work.jpg" }],
        title: "Gallery",
      },
      type: "gallery",
    },
  ];
  expect(() => importPageForge(blocks, newId)).toThrow("absolute");
  expect(
    importPageForge(blocks, newId, "https://example.test").document.sections[0]?.items[0]?.imageUrl,
  ).toBe("https://example.test/images/work.jpg");
});
it("exports safe configuration by default, supports content round trips and applies fresh IDs without changing identity or publication", () => {
  const section: CustomSection = {
    ...emptySection("projects", newId),
    items: [
      {
        body: "Private authored body",
        id: newId(),
        title: "Private authored title",
        url: "",
      },
    ],
    options: {
      description: "Private authored story",
      mediaUrl: "https://example.test/private-image.jpg",
    },
  };
  const saved = { ...profile, customSections: [section] };
  const configuration = createSectionTemplate(saved, "Layout");
  expect(JSON.stringify(configuration)).not.toContain("Private authored");
  expect(configuration.sections[0]?.items).toEqual([]);
  const content = createSectionTemplate(saved, "Full section", true);
  expect(sectionTemplateFileSchema.parse(JSON.parse(JSON.stringify(content)))).toEqual(content);
  const appended = applySectionTemplate(saved, content, "append", newId);
  expect(appended.customSections).toHaveLength(2);
  expect(appended.customSections?.[1]?.id).not.toBe(section.id);
  expect(appended.customSections?.[1]?.items[0]?.id).not.toBe(section.items[0]?.id);
  expect(appended.name).toBe(saved.name);
  expect(saved.customSections).toHaveLength(1);
  const replaced = applySectionTemplate(saved, configuration, "replace", newId);
  expect(replaced.customSections).toHaveLength(1);
  expect(replaced.customSections?.[0]?.items).toEqual([]);
});
it("binds only compatible current-profile data and excludes private projects independently of the built-in project selection", () => {
  const sample = profile.projects[0];
  if (!sample) throw new Error("Expected sample project");
  const section = {
    ...emptySection("projects", newId),
    source: { field: "projects" as const, type: "profile" as const },
  };
  const owner = {
    ...profile,
    projects: [
      { ...sample, id: "public", public: true },
      { ...sample, id: "private", public: false },
    ],
    sectionSettings: { projects: { itemIds: [] } },
  };
  expect(resolveSectionSource(section, owner).items.map(({ id }) => id)).toEqual(["public"]);
  expect(
    resolveSectionSource({ ...section, source: { ...section.source, itemIds: ["private"] } }, owner)
      .items,
  ).toEqual([]);
  expect(customSectionSchema.safeParse({ ...section, sectionType: "map" }).success).toBe(false);
});
it("creates a map iframe only after visitor interaction and preserves the source attribution", () => {
  const view = render(<LocationMap latitude={41.38} longitude={2.17} title="Studio" />);
  expect(view.container.querySelector("iframe")).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: "Load location map" }));
  expect(view.container.querySelector("iframe")?.src).toContain(
    "https://www.openstreetmap.org/export/embed.html?bbox=",
  );
  expect(screen.getByRole("link", { name: /OpenStreetMap/ }).getAttribute("href")).toContain(
    "mlat=41.38",
  );
});

it("does not nest a real contact form inside an editor preview", () => {
  const section = {
    ...emptySection("contact-form", newId),
    options: { email: "contact@example.test" },
  };
  const Contact = sectionRenderers["contact-form"];
  expect(renderToStaticMarkup(<Contact section={section} />)).toContain("<form");
  expect(renderToStaticMarkup(<Contact preview section={section} />)).not.toContain("<form");
});
