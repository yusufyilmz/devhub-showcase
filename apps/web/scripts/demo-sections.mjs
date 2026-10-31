import {
  authorableSections,
  authorableSectionTypes,
  getSectionRenderers,
  MAX_CUSTOM_SECTIONS,
} from "../../../packages/content/src/authorable-sections.ts";

const baseUrl = "https://mydevstudio.vercel.app";
const image = `${baseUrl}/examples/orbit-brand.svg`;
const uuid = (n) => `d3d3d3d3-d3d3-43d3-83d3-${String(n).padStart(12, "0")}`;
const social = {
  instagram: "https://www.instagram.com/p/DEMO/",
  pinterest: "https://www.pinterest.com/pin/123/",
  youtube: "https://youtu.be/M7lc1UVf-VE",
};
function sampleItems(type, index) {
  const link = social[type] || (type === "video" ? social.youtube : "https://example.com");
  return [0, 1].map((n) => ({
    body: ["legal-text"].includes(type)
      ? "Sample wording for layout testing only. Replace this with your own reviewed policy before using it for a real business."
      : "Fictional sample content for testing this section. Edit the content and switch its compatible layout in the studio.",
    details: ["Sample detail one", "Sample detail two"],
    id: uuid(index * 10 + n + 1000),
    imageUrl: n ? `${baseUrl}/examples/atlas-interface.svg` : image,
    period: n ? "2022–2023" : "2024–Present",
    title: n ? "Second fictional example" : `${authorableSections[type].name} example`,
    url: link,
    value: type === "stats" ? `${n + 3}` : "Demo only",
  }));
}
function sampleSection(type, index) {
  const description = ["instagram", "pinterest"].includes(type)
    ? "Sample social URL and local thumbnail. Replace the placeholder URL with your own public post or pin before testing the external link."
    : type === "newsletter"
      ? "Demonstration subscription link only; no mailing list is connected."
      : `Explore the ${authorableSections[type].name} section with fictional content.`;
  const section = {
    id: `custom-${uuid(index)}`,
    items: sampleItems(type, index),
    options: {
      actionUrl: "https://example.com",
      alignment: "left",
      columns: 2,
      description,
      email: "demo@example.com",
      latitude: 41.38,
      longitude: 2.17,
    },
    renderer: getSectionRenderers(type)[0],
    sectionType: type,
    title: `Demo · ${authorableSections[type].name}`,
    visible: true,
  };
  const field = authorableSections[type].sources[0];
  if (field) section.source = { field, type: "profile" };
  return section;
}
/** Add missing registered types/views while preserving existing authored sections. */
export function expandDemoSections(profile) {
  const sections = structuredClone(profile.customSections || []);
  for (const [index, type] of authorableSectionTypes.entries())
    if (!sections.some((section) => section.sectionType === type))
      sections.push(sampleSection(type, index + 1));
  for (const renderer of getSectionRenderers("custom"))
    if (
      !sections.some((section) => section.sectionType === "custom" && section.renderer === renderer)
    ) {
      const index = sections.length + 100;
      sections.push({
        ...sampleSection("custom", index),
        renderer,
        source: { field: "projects", type: "profile" },
        title: `Demo layout · ${renderer}`,
      });
    }
  const guideId = `custom-${uuid(900)}`;
  if (!sections.some((section) => section.id === guideId))
    sections.unshift({
      id: guideId,
      items: [
        {
          body: "Use the editor to switch layouts, themes and portfolio/CV languages. Try section ordering, compatible renderers, custom sections, templates, import/export and PDF settings. The sections below demonstrate the complete registered library. Some links are labeled placeholders; contact forms open an email draft and newsletter links need your own provider.",
          id: uuid(901),
          title: "Try the complete studio",
          url: "",
        },
        {
          body: "The private AI assistant proposes edits for review and draft apply. Saving remains explicit. Public AI chat requires an owner opt-in and a published portfolio. Use test cards in the Stripe sandbox. Demo allowances are limited and real AI requests consume the configured provider budget.",
          id: uuid(902),
          title: "AI and billing",
          url: `${baseUrl}/admin/billing`,
        },
      ],
      renderer: "text",
      sectionType: "text",
      title: "Demo feature checklist",
      visible: true,
    });
  if (sections.length > MAX_CUSTOM_SECTIONS)
    throw new Error(
      "Not enough room to add the full demo library without deleting existing sections.",
    );
  const next = {
    ...profile,
    customSections: sections,
    hero: profile.hero || { kind: "image", overlay: "strong", position: "center", url: image },
  };
  if (profile.sectionSequence) {
    const ids = new Set(profile.sectionSequence);
    next.sectionSequence = [
      ...profile.sectionSequence,
      ...sections.filter((section) => !ids.has(section.id)).map((section) => section.id),
    ];
  }
  return next;
}
