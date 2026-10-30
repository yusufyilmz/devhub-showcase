import {
  type CustomSection,
  getSectionRenderers,
  MAX_CUSTOM_SECTIONS,
  type SectionOptions,
  type SectionTemplateFile,
} from "@shared/content";

import { customSectionSchema } from "./section";
import {
  emptySection,
  sectionTemplateFileSchema,
  sectionTypeFromPageForge,
} from "./section-templates";

type RecordValue = Record<string, unknown>;
const object = (value: unknown): RecordValue =>
  value && typeof value === "object" && !Array.isArray(value) ? (value as RecordValue) : {};
const text = (value: unknown) =>
  typeof value === "string" ? value : typeof value === "number" ? String(value) : "";
const first = (...values: unknown[]) => values.map(text).find(Boolean) ?? "";
const url = (value: unknown, base?: string) => {
  const raw =
    typeof value === "string"
      ? value
      : first(object(value).href, object(value).url, object(value).src);
  if (!raw) return "";
  const resolved = raw.startsWith("/") && base ? new URL(raw, base).href : raw;
  if (!/^https?:\/\//i.test(resolved))
    throw new Error(`Use an absolute HTTP or HTTPS URL: ${raw.slice(0, 100)}`);
  return resolved;
};
function plain(value: unknown): string {
  if (Array.isArray(value)) return value.map(plain).filter(Boolean).join("\n");
  if (value && typeof value === "object")
    return Object.entries(object(value))
      .filter(([key]) => !["icon", "className"].includes(key))
      .map(([key, item]) => `${key}: ${plain(item)}`)
      .join("\n");
  return text(value);
}
export function parseSectionFile(raw: string): unknown {
  if (new TextEncoder().encode(raw).length > 500_000)
    throw new Error("Import files must be smaller than 500 KB");
  return JSON.parse(raw, (key, value) => {
    if (["__proto__", "prototype", "constructor"].includes(key))
      throw new Error("Unsupported JSON property");
    return value;
  });
}
function extractBlocks(input: unknown): RecordValue[] {
  if (Array.isArray(input)) return input.flatMap(extractBlocks);
  const record = object(input);
  if (typeof record.type === "string" && record.content) return [record];
  if (Array.isArray(record.blocks))
    return record.blocks.flatMap(extractBlocks).map((block) => ({
      ...block,
      display: record.display === false ? false : block.display,
    }));
  if (record.content && typeof record.content === "object") return extractBlocks(record.content);
  const keys = ["header", "hero", "main", "sections", "sidebar", "footer"];
  return keys.flatMap((key) => (record[key] ? extractBlocks(record[key]) : []));
}
const listKeys: Record<string, string[]> = {
  accordion: ["items"],
  awards: ["awards"],
  "blog-page": ["posts"],
  careers: ["jobs"],
  clients: ["clients"],
  "contact-info": ["contacts"],
  cta: ["buttons"],
  features: ["features"],
  "gallery-grid": ["images"],
  hero: ["buttons"],
  "how-to": ["steps"],
  "legal-text": ["sections"],
  plans: ["plans"],
  "posts-grid": ["featuredPosts", "recentPosts", "posts"],
  pricing: ["plans"],
  projects: ["projects"],
  property: ["properties"],
  quickstart: ["steps"],
  "shop-items": ["items"],
  showcase: ["items"],
  "social-links": ["links"],
  stats: ["stats"],
  studies: ["institutions"],
  tabs: ["tabs", "items"],
  team: ["members"],
  "technical-skills": ["skills"],
  testimonials: ["testimonials"],
  timeline: ["items"],
  "work-experience": ["experiences"],
};
function sourceItems(content: RecordValue, type: string): unknown[] {
  if (type === "faq") {
    if (Array.isArray(content.questions)) return content.questions;
    return Array.isArray(content.categories)
      ? content.categories.flatMap((category) => {
          const group = object(category);
          return Array.isArray(group.questions)
            ? group.questions.map((question) => ({
                ...object(question),
                category: group.name,
              }))
            : [];
        })
      : [];
  }
  if (type === "menu")
    return Array.isArray(content.categories)
      ? content.categories.flatMap((category) => {
          const group = object(category);
          return Array.isArray(group.items)
            ? group.items.map((item) => ({
                ...object(item),
                category: group.name,
              }))
            : [];
        })
      : [];
  if (type === "contact-info" && content.contacts && !Array.isArray(content.contacts))
    return Object.entries(object(content.contacts)).map(([title, value]) => ({
      description: plain(value),
      title,
    }));
  return (listKeys[type] ?? ["items"]).flatMap((key) =>
    Array.isArray(content[key]) ? (content[key] as unknown[]) : [],
  );
}
function itemFromPageForge(
  value: unknown,
  index: number,
  newId: () => string,
  base?: string,
): CustomSection["items"][number] {
  const item = object(value);
  const metadata = object(item.metadata);
  const author = object(item.author);
  const image = first(
    item.image,
    item.src,
    item.avatar,
    item.logo,
    object(item.image).src,
    author.avatar,
    metadata.image,
  );
  const body = first(
    item.body,
    item.description,
    item.answer,
    item.content,
    item.summary,
    item.bio,
    metadata.summary,
  );
  const details = [
    item.achievements,
    item.features,
    item.technologies,
    item.skills,
    item.bullets,
    [author.role, author.company].map(text).filter(Boolean),
  ].flatMap((value) => (Array.isArray(value) ? value.map(plain) : []));
  const extra = Object.entries(item)
    .filter(
      ([key]) =>
        ![
          "id",
          "title",
          "name",
          "label",
          "question",
          "text",
          "body",
          "description",
          "answer",
          "content",
          "summary",
          "bio",
          "image",
          "src",
          "avatar",
          "logo",
          "author",
          "metadata",
          "url",
          "href",
          "link",
          "cta",
          "achievements",
          "features",
          "technologies",
          "skills",
          "bullets",
          "price",
          "value",
          "number",
          "date",
          "timeframe",
          "period",
          "code",
          "snippet",
          "icon",
        ].includes(key),
    )
    .map(([key, value]) => `${key}: ${plain(value)}`);
  return {
    body: [body, ...extra].filter(Boolean).join("\n\n"),
    code: first(item.code, item.snippet),
    details,
    id: newId(),
    imageUrl: image ? url(image, base) : "",
    period: first(item.period, item.date, item.timeframe, metadata.publishedAt),
    title: first(
      item.title,
      item.name,
      item.question,
      item.label,
      item.text,
      item.alt,
      item.role,
      item.degree,
      author.name,
      metadata.title,
      typeof value === "string" ? value : "",
      `Item ${index + 1}`,
    ),
    url: url(item.url || item.href || item.link || object(item.cta).href || metadata.link, base),
    value: first(
      item.value,
      item.number,
      typeof item.price === "object" ? plain(item.price) : item.price,
    ),
  };
}
function optionsFromPageForge(content: RecordValue, base?: string): SectionOptions {
  const alignment = ["left", "center", "right"].includes(text(content.alignment ?? content.align))
    ? (text(content.alignment ?? content.align) as SectionOptions["alignment"])
    : undefined;
  const columns = [1, 2, 3, 4].includes(Number(content.columns))
    ? (Number(content.columns) as 1 | 2 | 3 | 4)
    : undefined;
  const coordinates = object(content.coordinates);
  return {
    actionUrl: url(content.subscriptionUrl || content.actionUrl || content.link, base),
    alignment,
    columns,
    description: first(content.description, content.subtitle, content.text),
    email: text(content.email),
    latitude: typeof coordinates.lat === "number" ? coordinates.lat : undefined,
    longitude: typeof coordinates.lng === "number" ? coordinates.lng : undefined,
    mediaUrl: url(content.backgroundImage, base),
    posterUrl: url(content.poster, base),
  };
}
function convertBlock(
  block: RecordValue,
  newId: () => string,
  warnings: string[],
  base?: string,
): CustomSection {
  const type = sectionTypeFromPageForge(text(block.type));
  if (!type) throw new Error(`Unsupported PageForge section type: ${text(block.type)}`);
  const content = object(block.content);
  const section = emptySection(type, newId);
  const items = sourceItems(content, type).map((item, index) =>
    itemFromPageForge(item, index, newId, base),
  );
  if (["text", "about", "about-hero", "profile"].includes(type) && !items.length) {
    const intro = object(content.intro);
    items.push(
      itemFromPageForge(
        {
          body: first(
            content.bio,
            content.content,
            intro.description,
            content.description,
            content.text,
          ),
          image: content.avatar ?? content.image,
          title: first(content.name, intro.title, content.title, section.title),
          url: object(content.calendar).link,
        },
        0,
        newId,
        base,
      ),
    );
  }
  if (type === "video")
    items.push(
      itemFromPageForge(
        {
          body: content.description,
          image: content.poster,
          title: first(content.title, "Video"),
          url: first(content.embedUrl, content.videoUrl, content.src),
        },
        0,
        newId,
        base,
      ),
    );
  if (type === "calendar-link")
    items.push(
      itemFromPageForge(
        {
          body: content.description,
          title: first(content.text, content.title, "Book a time"),
          url: content.link,
        },
        0,
        newId,
        base,
      ),
    );
  const layout = first(content.layout, block.variant);
  const layouts: Record<string, string> = {
    accordion: "accordion",
    carousel: "carousel",
    grid: "cards",
    list: "list",
    masonry: "masonry",
    steps: "steps",
    tabs: "tabs",
  };
  const renderer = layouts[layout];
  if (items.length > 30)
    throw new Error(`${section.title} has more than 30 items; split it before importing`);
  const options = optionsFromPageForge(content, base);
  const mapped = new Set([
    "title",
    "subtitle",
    "description",
    "text",
    "alignment",
    "align",
    "columns",
    "layout",
    "backgroundImage",
    "poster",
    "coordinates",
    "email",
    "actionUrl",
    "subscriptionUrl",
    "link",
    "intro",
    "avatar",
    "image",
    "name",
    "bio",
    "content",
    "videoUrl",
    "embedUrl",
    "src",
    "categories",
    "questions",
    ...(listKeys[type] ?? ["items"]),
  ]);
  const extra = Object.entries(content)
    .filter(
      ([key]) =>
        !mapped.has(key) &&
        ![
          "fields",
          "endpoint",
          "className",
          "script",
          "html",
          "successMessage",
          "errorMessage",
        ].includes(key),
    )
    .map(([key, value]) => `${key}: ${plain(value)}`)
    .filter(Boolean);
  options.description = [first(content.subtitle), options.description, ...extra]
    .filter((value, index, all) => value && all.indexOf(value) === index)
    .join("\n\n");
  if (type === "newsletter" && !options.actionUrl)
    warnings.push("Newsletter: configure a subscription page URL in its editor.");
  if (type === "contact-form")
    warnings.push(
      "Contact form: configure the recipient email. External endpoints and custom form fields are not imported; the form opens an email app.",
    );
  warnings.push(
    `${text(block.type)}: presentation options are adapted; scripts, CSS, routing, backend endpoints and executable content are not imported.`,
  );
  return customSectionSchema.parse({
    ...section,
    items,
    options,
    renderer:
      renderer && (getSectionRenderers(type) as readonly string[]).includes(renderer)
        ? renderer
        : section.renderer,
    title: first(content.title, content.name, section.title),
    visible: block.display !== false,
  });
}
export function importPageForge(
  input: unknown,
  newId: () => string,
  base?: string,
): { document: SectionTemplateFile; warnings: string[] } {
  if (base && !/^https?:\/\//i.test(base))
    throw new Error("Use an HTTP or HTTPS source asset base URL");
  const blocks = extractBlocks(input);
  if (!blocks.length) throw new Error("No compatible PageForge content blocks found");
  if (blocks.length > MAX_CUSTOM_SECTIONS)
    throw new Error(`Import at most ${MAX_CUSTOM_SECTIONS} sections at a time`);
  const warnings: string[] = [];
  const sections = blocks.map((block) => convertBlock(block, newId, warnings, base));
  const document = sectionTemplateFileSchema.parse({
    format: "mydevstudio.sections",
    includesContent: true,
    name: "PageForge import",
    sections,
    version: 1,
  });
  return { document, warnings };
}
