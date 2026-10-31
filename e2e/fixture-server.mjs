import { createServer } from "node:http";

import {
  authorableSectionTypes,
  getSectionRenderers,
} from "../packages/content/src/authorable-sections.ts";
import { profile } from "../packages/content/src/profile.ts";

// Test-only transport fixture, never imported by application code. Public
// records are read only. Two isolated fake accounts can save their own starter.
const row = {
  document: profile,
  id: "main",
  is_public: true,
  owner_id: null,
  revision: 1,
  updated_at: "2026-01-01T00:00:00Z",
  username: "yusufyilmz",
};
const examples = ["designer", "consultant", "minimal"].map((type, index) => ({
  ...row,
  document: {
    ...profile,
    name: `${type[0].toUpperCase()}${type.slice(1)} Example`,
    portfolioType: type,
  },
  id: `11111111-1111-4111-8111-11111111110${index}`,
  username: `${type}-example`,
}));
const localized = ["en", "es", "tr"].flatMap((language, languageIndex) =>
  ["engineer", "designer", "consultant", "minimal"].map((type, typeIndex) => ({
    ...row,
    document: {
      ...profile,
      cvLanguage: language === "es" ? "tr" : language,
      portfolioLanguage: language,
      portfolioType: type,
    },
    id: `44444444-4444-4444-8444-${String(languageIndex * 4 + typeIndex).padStart(12, "0")}`,
    username: `${type}-${language}`,
  })),
);
const starters = ["desktop", "mobile"].map((device, index) => ({
  ...row,
  document: {
    ...profile,
    about: [],
    appearance: { accent: "cyan", defaultTheme: "system", theme: "studio" },
    education: [],
    email: "owner@example.test",
    experiences: [],
    github: "",
    languages: [],
    linkedin: "",
    name: "New Portfolio Owner",
    phone: "",
    projects: [],
    skills: {},
    summary: "Add a short professional summary.",
    templateChosen: false,
    title: "Add your professional title",
    website: "",
  },
  id: `22222222-2222-4222-8222-22222222222${index}`,
  is_public: false,
  owner_id: `33333333-3333-4333-8333-33333333333${index}`,
  username: `${device}-starter`,
}));
const aiOwners = ["desktop", "mobile"].map((device, index) => ({
  ...row,
  document: {
    ...profile,
    email: "ai-owner@example.test",
    name: "Alex Private",
    projects: [
      { ...profile.projects[0], id: "private-work", name: "Confidential project", public: false },
    ],
    sectionSettings: { experience: { visible: false } },
    templateChosen: true,
  },
  id: `82828282-8282-4282-8282-82828282828${index}`,
  is_public: false,
  owner_id: `83838383-8383-4383-8383-83838383838${index}`,
  username: `${device}-ai-owner`,
}));
const billingOwners = [
  "94949494-9494-4494-8494-949494949490",
  "94949494-9494-4494-8494-949494949491",
  "95959595-9595-4595-8595-959595959590",
  "95959595-9595-4595-8595-959595959591",
].map((id, index) => ({
  ...row,
  document: { ...profile, email: "billing-owner@example.test", name: "Billing Test Owner" },
  id,
  is_public: false,
  owner_id: id,
  username: `billing-test-${index}`,
}));
const cvImportOwners = ["desktop", "mobile"].map((device, index) => ({
  ...row,
  document: { ...starters[index].document, name: "CV Import Owner", templateChosen: false },
  id: `68686868-6868-4868-8868-68686868686${index}`,
  is_public: false,
  owner_id: `69696969-6969-4969-8969-69696969696${index}`,
  username: `${device}-cv-importer`,
}));
const customOwners = ["desktop", "mobile"].map((device, index) => ({
  ...row,
  document: {
    ...profile,
    email: "custom-owner@example.test",
    name: "Custom Section Owner",
    templateChosen: true,
  },
  id: `abababab-abab-4bab-8bab-abababababa${index}`,
  is_public: false,
  owner_id: `cdcdcdcd-cdcd-4dcd-8dcd-cdcdcdcdcdc${index}`,
  username: `${device}-custom-owner`,
}));
const mediaOwners = ["desktop", "mobile"].map((device, index) => ({
  ...row,
  document: {
    ...profile,
    email: "media-owner@example.test",
    name: "Media Portfolio Owner",
    templateChosen: true,
  },
  id: `dddddddd-dddd-4ddd-8ddd-ddddddddddd${index}`,
  is_public: false,
  owner_id: `eeeeeeee-eeee-4eee-8eee-eeeeeeeeeee${index}`,
  username: `${device}-media-owner`,
}));
const mediaExamples = ["engineer", "designer", "consultant", "minimal"].map((type, index) => ({
  ...row,
  document: {
    ...profile,
    customSections: [
      ["services", "Services", "cards", "Design systems", "Brand and interface design", ""],
      [
        "testimonials",
        "Testimonials",
        "cards",
        "A happy collaborator",
        "Thoughtful, clear work.",
        "",
      ],
      [
        "faq",
        "Questions",
        "accordion",
        "How do we start?",
        "Send a message to discuss your project.",
        "",
      ],
      ["statistics", "Numbers", "cards", "12+", "Projects delivered", ""],
      [
        "cta",
        "Start a project",
        "cards",
        "Work together",
        "Tell me about your idea.",
        "https://example.com/contact",
      ],
      [
        "youtube",
        "Films",
        "cards",
        "Studio film",
        "A selected film.",
        "https://youtu.be/M7lc1UVf-VE",
      ],
      [
        "instagram",
        "Instagram projects",
        "cards",
        "Poster study",
        "A selected poster.",
        "https://www.instagram.com/p/ABC_123/",
      ],
      [
        "pinterest",
        "Pinterest work",
        "cards",
        "Visual collection",
        "A selected pin.",
        "https://www.pinterest.com/pin/123456/",
      ],
    ].map(([composition, title, renderer, itemTitle, body, url], n) => ({
      composition,
      id: `custom-12345678-1234-4234-8234-${String(n).padStart(12, "0")}`,
      items: [
        {
          body,
          id: `87654321-4321-4321-8321-${String(n).padStart(12, "0")}`,
          imageUrl:
            composition === "instagram" || composition === "pinterest"
              ? "http://localhost:3100/examples/orbit-brand.svg"
              : "",
          title: itemTitle,
          url,
        },
      ],
      renderer,
      title,
      visible: true,
    })),
    hero: {
      kind: "image",
      overlay: "strong",
      position: "center",
      url: "http://localhost:3100/examples/orbit-brand.svg",
    },
    portfolioType: type,
  },
  id: `ffffffff-ffff-4fff-8fff-fffffffffff${index}`,
  username: `media-${type}`,
}));
const libraryOwners = ["desktop", "mobile"].map((device, index) => ({
  ...row,
  document: {
    ...profile,
    email: "library-owner@example.test",
    name: "Library Portfolio Owner",
    templateChosen: true,
  },
  id: `10101010-1010-4010-8010-10101010101${index}`,
  is_public: false,
  owner_id: `20202020-2020-4020-8020-20202020202${index}`,
  username: `${device}-library-owner`,
}));
const libraryExamples = ["engineer", "designer"].map((type, index) => ({
  ...row,
  document: {
    ...profile,
    customSections: authorableSectionTypes.map((sectionType, n) => ({
      id: `custom-40404040-4040-4040-8040-${String(n).padStart(12, "0")}`,
      items: [
        {
          body: "A sample section item.",
          details: ["First detail", "Second detail"],
          id: `50505050-5050-4050-8050-${String(n).padStart(12, "0")}`,
          imageUrl: "http://localhost:3100/examples/orbit-brand.svg",
          period: "2026",
          title: "Example work",
          url:
            sectionType === "instagram"
              ? "https://www.instagram.com/p/ABC/"
              : sectionType === "pinterest"
                ? "https://www.pinterest.com/pin/123/"
                : "https://youtu.be/M7lc1UVf-VE",
          value: "12+",
        },
      ],
      options: {
        actionUrl: "https://example.test/subscribe",
        description: `An example ${sectionType} section.`,
        email: "contact@example.test",
        latitude: 41.38,
        longitude: 2.17,
      },
      renderer: getSectionRenderers(sectionType)[0],
      sectionType,
      title: `Library ${sectionType}`,
      visible: true,
    })),
    portfolioType: type,
  },
  id: `30303030-3030-4030-8030-30303030303${index}`,
  username: `library-${type}`,
}));
const themed = ["studio", "paper", "graphite", "bloom"].flatMap((theme, themeIndex) =>
  ["engineer", "designer", "consultant", "minimal"].map((type, typeIndex) => ({
    ...row,
    document: {
      ...profile,
      appearance: { accent: "violet", defaultTheme: "dark", theme },
      portfolioType: type,
    },
    id: `55555555-5555-4555-8555-${String(themeIndex * 4 + typeIndex).padStart(12, "0")}`,
    username: `${theme}-${type}`,
  })),
);
const systemTheme = {
  ...row,
  document: {
    ...profile,
    appearance: { accent: "cyan", defaultTheme: "system", theme: "paper" },
    portfolioType: "designer",
  },
  id: "66666666-6666-4666-8666-666666666666",
  username: "paper-system",
};
const reordered = ["engineer", "designer", "consultant", "minimal"].map((type, index) => ({
  ...row,
  document: {
    ...profile,
    portfolioType: type,
    sectionOrder: ["languages", "education", "skills", "projects", "experience", "about"],
  },
  id: `77777777-7777-4777-8777-77777777777${index}`,
  username: `reordered-${type}`,
}));
const configured = ["engineer", "designer", "consultant", "minimal"].map((type, index) => ({
  ...row,
  document: {
    ...profile,
    portfolioType: type,
    sectionSettings: {
      about: { visible: false },
      education: { renderer: "education-accordion" },
      experience: { renderer: "experience-tabs" },
      languages: { renderer: "language-cards" },
      projects: {
        itemIds: [profile.projects.find((item) => item.public).id],
        renderer: "project-carousel",
      },
      skills: { renderer: "skill-cards" },
    },
  },
  id: `aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa${index}`,
  username: `configured-${type}`,
}));
const managers = [0, 1].map((n) => ({
  document: { email: `manager${n}@example.test` },
  manager: true,
  owner_id: `99999999-9999-4999-8999-99999999999${n}`,
}));
const recipients = [0, 1].map((n) => ({
  document: { email: `recipient${n}@example.test` },
  owner_id: `88888888-8888-4888-8888-88888888888${n}`,
}));
const initialStarters = structuredClone(starters);
const rows = [
  row,
  {
    ...row,
    id: "90909090-9090-4090-8090-909090909090",
    is_public: false,
    username: "private-seo-portfolio",
  },
  ...examples,
  ...localized,
  ...reordered,
  ...configured,
  ...themed,
  systemTheme,
  ...starters,
  ...customOwners,
  ...cvImportOwners,
  ...aiOwners,
  ...billingOwners,
  ...mediaOwners,
  ...mediaExamples,
  ...libraryOwners,
  ...libraryExamples,
];
const templateLibraries = new Map();
createServer(async (request, response) => {
  const url = new URL(request.url, "http://127.0.0.1:3101");
  response.setHeader("Content-Type", "application/json");
  const resetIndex = ["desktop", "mobile"].indexOf(url.pathname.replace("/__test/reset/", ""));
  if (request.method === "POST" && resetIndex >= 0) {
    Object.assign(starters[resetIndex], structuredClone(initialStarters[resetIndex]));
    response.end("{}");
    return;
  }
  const owner = fixtureOwner(request);
  if (request.method === "GET" && url.pathname === "/health") {
    response.end("{}");
    return;
  }
  if (request.method === "GET" && url.pathname === "/auth/v1/user" && owner) {
    response.end(
      JSON.stringify({
        app_metadata: {},
        aud: "authenticated",
        email: owner.document.email,
        email_confirmed_at: "2026-01-01T00:00:00Z",
        id: owner.owner_id,
        role: "authenticated",
        user_metadata: {},
      }),
    );
    return;
  }
  if (url.pathname === "/rest/v1/rpc/is_portfolio_admin") {
    response.end(JSON.stringify(Boolean(owner?.manager)));
    return;
  }
  if (url.pathname === "/rest/v1/rpc/transfer_managed_portfolio")
    return transferRequest(request, response, owner);
  if (url.pathname === "/rest/v1/portfolio_section_templates")
    return templateLibraryRequest(request, response, url, owner);
  if (url.pathname === "/rest/v1/portfolio_profiles")
    return profileRequest(request, response, url, owner);
  if (request.method === "GET" && url.pathname === "/rest/v1/referrals") {
    response.end("[]");
    return;
  }
  response.writeHead(405).end(JSON.stringify({ message: "Unsupported fixture request" }));
}).listen(3101, "127.0.0.1");

function fixtureOwner(request) {
  let owner;
  try {
    const token = request.headers.authorization?.split(" ")[1];
    const userId = JSON.parse(Buffer.from(token.split(".")[1], "base64url")).sub;
    owner = [
      ...starters,
      ...customOwners,
      ...cvImportOwners,
      ...aiOwners,
      ...billingOwners,
      ...libraryOwners,
      ...mediaOwners,
      ...managers,
      ...recipients,
    ].find((entry) => entry.owner_id === userId);
  } catch {
    /* Public fixture requests have no fake session. */
  }
  return owner;
}

function visibleRow(entry, owner) {
  return (
    entry.is_public ||
    (owner &&
      (entry.owner_id === owner.owner_id || (owner.manager && entry.managed_by === owner.owner_id)))
  );
}
function matchesRow(entry, url) {
  return ["id", "username", "owner_id", "managed_by", "revision", "is_public"].every(
    (key) =>
      !url.searchParams.has(key) ||
      url.searchParams.get(key) === `eq.${entry[key]}` ||
      (url.searchParams.get(key) === "is.null" && entry[key] === null),
  );
}
function fixtureRow(url, owner) {
  return rows.find((entry) => visibleRow(entry, owner) && matchesRow(entry, url));
}

function discoveryRows(url, owner) {
  const offset = Number(url.searchParams.get("offset") ?? 0);
  const limit = Number(url.searchParams.get("limit") ?? 1000);
  return rows
    .filter((entry) => visibleRow(entry, owner) && matchesRow(entry, url))
    .sort((a, b) => a.username.localeCompare(b.username))
    .slice(offset, offset + limit)
    .map(({ username, updated_at }) => ({ updated_at, username }));
}

async function profileRequest(request, response, url, owner) {
  const found = fixtureRow(url, owner);
  if (request.method === "GET") {
    if (url.searchParams.get("select") === "username,updated_at") {
      response.end(JSON.stringify(discoveryRows(url, owner)));
      return;
    }
    const result =
      url.searchParams.has("managed_by") && !url.searchParams.has("id")
        ? rows.filter((entry) => visibleRow(entry, owner) && matchesRow(entry, url))
        : (found ?? null);
    response.end(JSON.stringify(result));
    return;
  }
  if (request.method === "POST" && owner?.manager)
    return createManagedRequest(request, response, owner);

  if (
    request.method === "PATCH" &&
    owner &&
    found &&
    (found.owner_id === owner.owner_id || (owner.manager && found.managed_by === owner.owner_id))
  ) {
    const chunks = [];
    for await (const chunk of request) chunks.push(chunk);
    const update = JSON.parse(Buffer.concat(chunks).toString());
    Object.assign(found, update);
    response.end(JSON.stringify(found));
    return;
  }

  response.writeHead(405).end(JSON.stringify({ message: "Unsupported fixture request" }));
}

async function transferRequest(request, response, owner) {
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  const input = JSON.parse(Buffer.concat(chunks).toString());
  const found = rows.find(
    (item) => item.id === input.profile_id && item.managed_by === owner?.owner_id,
  );
  const target = recipients.find((item) => item.document.email === input.target_email);
  if (!owner?.manager || !found || !target || found.revision !== input.expected_revision) {
    response.writeHead(400).end(
      JSON.stringify({
        code: "22023",
        message: "Ask the recipient to sign in with Google first",
      }),
    );
    return;
  }
  found.owner_id = target.owner_id;
  found.managed_by = null;
  found.revision++;
  response.end(JSON.stringify({ id: found.id, username: found.username }));
  return;
}

async function createManagedRequest(request, response, owner) {
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  const input = JSON.parse(Buffer.concat(chunks).toString());
  if (input.managed_by !== owner.owner_id || input.owner_id !== null) {
    response.writeHead(403).end("{}");
    return;
  }
  if (rows.some((entry) => entry.username === input.username)) {
    response.writeHead(409).end(JSON.stringify({ code: "23505" }));
    return;
  }
  const created = {
    ...input,
    id: crypto.randomUUID(),
    is_public: false,
    revision: 1,
    updated_at: new Date().toISOString(),
  };
  rows.push(created);
  response.writeHead(201).end(JSON.stringify(created));
  return;
}

async function templateLibraryRequest(request, response, url, owner) {
  if (!owner) {
    response.writeHead(403).end("{}");
    return;
  }
  const id = owner.owner_id;
  const existing = templateLibraries.get(id);
  if (request.method === "GET") {
    response.end(
      JSON.stringify(url.searchParams.get("owner_id") === `eq.${id}` ? (existing ?? null) : null),
    );
    return;
  }
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  const input = JSON.parse(Buffer.concat(chunks).toString());
  if (request.method === "POST") {
    if (input.owner_id !== id) {
      response.writeHead(403).end("{}");
      return;
    }
    if (existing) {
      response.writeHead(409).end(JSON.stringify({ code: "23505" }));
      return;
    }
    templateLibraries.set(id, input);
    response.end(JSON.stringify(input));
    return;
  }
  if (
    request.method === "PATCH" &&
    existing &&
    url.searchParams.get("owner_id") === `eq.${id}` &&
    url.searchParams.get("revision") === `eq.${existing.revision}`
  ) {
    Object.assign(existing, input);
    response.end(JSON.stringify(existing));
    return;
  }
  response.end("null");
}
