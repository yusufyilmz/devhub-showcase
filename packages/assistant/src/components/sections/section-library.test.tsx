// @vitest-environment jsdom

import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { renderToStaticMarkup } from "react-dom/server";

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import {
  authorableSections,
  authorableSectionTypes,
  type CustomSection,
  profile,
  resolveSectionSource,
} from "@shared/config";
import { importPageForge, parseSectionFile } from "@shared/lib/pageforge-import";
import { profileSchema } from "@shared/lib/profiles";
import { customSectionSchema } from "@shared/lib/section";
import {
  applySectionTemplate,
  createSectionTemplate,
  emptySection,
  sectionTemplateFileSchema,
} from "@shared/lib/section-templates";
import { LocationMap } from "@shared/ui/map";

import { sectionEditors } from "./editors";
import { sectionRenderers } from "./renderers";
import { CustomPortfolioSection } from "./studio/custom-portfolio-section";

const sectionsRoot = dirname(fileURLToPath(import.meta.url));
const pageforgeFixture = resolve(
  sectionsRoot,
  "../../../../../tools/test/fixtures/pageforge-sections.json",
);

let sequence = 0;
const newId = () => `12345678-1234-4234-8234-${String(++sequence).padStart(12, "0")}`;

describe("SectionLibrary", () => {
  afterEach(cleanup);
  it("provides working public renderer and editor entry points for all 42 source section families and native additions", () => {
    const fixture = JSON.parse(readFileSync(pageforgeFixture, "utf8"));
    expect(fixture.content.main[0].blocks).toHaveLength(42);
    for (const type of authorableSectionTypes) {
      const component = authorableSections[type].name.replaceAll(" ", "");
      const sectionDir = resolve(sectionsRoot, `${type}-section`);
      expect(existsSync(sectionDir), `${component} folder`).toBe(true);
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
    const raw = readFileSync(pageforgeFixture, "utf8");
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
      importPageForge(blocks, newId, "https://example.test").document.sections[0]?.items[0]
        ?.imageUrl,
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
      resolveSectionSource(
        { ...section, source: { ...section.source, itemIds: ["private"] } },
        owner,
      ).items,
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

  it("keeps image items in the selected masonry layout", () => {
    const section = emptySection("gallery-grid", newId);
    const items = [
      {
        body: "A sample print",
        id: "print",
        imageUrl: "https://example.com/print.png",
        title: "Print study",
        url: "",
      },
    ];
    const Gallery = sectionRenderers["gallery-grid"];
    expect(
      renderToStaticMarkup(<Gallery section={{ ...section, items, renderer: "gallery" }} />),
    ).toContain('aria-label="View Print study"');
    const masonry = { ...section, items, options: { columns: 2 }, renderer: "masonry" } as const;
    const markup = renderToStaticMarkup(<Gallery section={masonry} />);
    expect(markup).toContain('data-slot="masonry-grid"');
    expect(markup).toContain("--masonry-columns:2");

    const defaultMarkup = renderToStaticMarkup(
      <CustomPortfolioSection section={{ ...masonry, sectionType: undefined }} />,
    );
    expect(defaultMarkup).toContain('data-slot="masonry-grid"');
    expect(defaultMarkup).toContain("Print study");
  });

  it("renders shared hero actions from safe saved URLs and keeps hidden sections out", () => {
    const Hero = sectionRenderers.hero;
    const section = {
      ...emptySection("hero", newId),
      options: { actionUrl: "https://example.test/work" },
    };
    expect(renderToStaticMarkup(<Hero section={section} />)).toContain(
      'href="https://example.test/work"',
    );
    expect(renderToStaticMarkup(<Hero section={{ ...section, visible: false }} />)).toBe("");
    const unsafe = { ...section, options: { actionUrl: "javascript:alert(1)" } };
    expect(renderToStaticMarkup(<Hero section={unsafe} />)).not.toContain("<a ");
  });

  it("keeps saved alternate CTA layouts and shows each action once in the shared card layout", () => {
    const CTA = sectionRenderers.cta;
    const section = {
      ...emptySection("cta", newId),
      items: [
        {
          body: "Send your brief and dates",
          id: newId(),
          title: "Contact us",
          url: "https://example.test/contact",
        },
      ],
    };
    const cards = renderToStaticMarkup(<CTA section={section} />);
    expect(cards.match(/href="https:\/\/example.test\/contact"/g)).toHaveLength(1);
    expect(cards).toContain("Send your brief and dates");
    const list = renderToStaticMarkup(<CTA section={{ ...section, renderer: "list" }} />);
    expect(list).toContain(
      "section-prose [display:grid] [gap:var(--spacing-s)] [&amp;_article[data-slot=card]]:[padding:var(--spacing-sm)]",
    );
  });

  it("renders authored dashboard values and hides an empty dashboard", () => {
    const Dashboard = sectionRenderers.dashboard;
    const section = emptySection("dashboard", newId);
    expect(renderToStaticMarkup(<Dashboard section={section} />)).toBe("");
    const saved = customSectionSchema.parse({
      ...section,
      items: [{ body: "Indexed in June", id: newId(), title: "Reports", url: "", value: "240" }],
    });
    const markup = renderToStaticMarkup(<Dashboard section={saved} />);
    expect(markup).toContain("240");
    expect(markup).toContain("Indexed in June");
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
});
