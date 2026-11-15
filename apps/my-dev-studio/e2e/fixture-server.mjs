import { randomUUID } from "node:crypto";
import { createServer } from "node:http";

import { projectPublicProfile } from "../../../packages/config/src/portfolio/public-projection.ts";
import { portfolioThemes } from "../../../packages/config/src/portfolio/themes.ts";
import { profile } from "../../../packages/config/src/profile/profile.ts";
import {
  authorableSectionTypes,
  getSectionRenderers,
} from "../../../packages/config/src/sections/authorable-sections.ts";
import { jobsFixture } from "./support/jobs-fixture.mjs";

// Test-only transport fixture, never imported by application code. Public
// records are read only. Two isolated fake accounts can save their own starter.
const row = {
  document: profile,
  id: "main",
  is_public: true,
  owner_id: "11111111-1111-4111-8111-111111111119",
  revision: 1,
  updated_at: "2026-01-01T00:00:00Z",
  username: "yusufyilmz",
};

const testimonialReviews = [
  { feedback: "Alex supplied a fictional testimonial.", name: "Alex Example" },
  { feedback: "Sam supplied a fictional testimonial.", name: "Sam Example" },
].map((referral, index) => ({
  created_at: row.updated_at,
  id: `testimonial-${index}`,
  referral: { ...referral, id: `referral-${index}`, relationship: "Former teammate" },
  state: "PENDING",
  updated_at: row.updated_at,
}));
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
const assistantToolOwners = aiOwners.map((owner, index) => ({
  ...owner,
  document: { ...owner.document, summary: "Builds accessible interfaces." },
  id: `66666666-6666-4666-8666-66666666666${index}`,
  owner_id: `67676767-6767-4767-8767-67676767676${index}`,
  username: `${index ? "mobile" : "desktop"}-assistant-tools`,
}));
const publicationOwners = aiOwners.map((owner, index) => ({
  ...owner,
  document: {
    ...structuredClone(owner.document),
    email: `publication${index}@example.test`,
    name: "Publication Owner",
  },
  id: `51515151-5151-4151-8151-51515151515${index}`,
  owner_id: `52525252-5252-4252-8252-52525252525${index}`,
  username: `${index ? "mobile" : "desktop"}-publication-owner`,
}));
const scheduleOwners = publicationOwners.map((owner, index) => ({
  ...structuredClone(owner),
  id: `84848484-8484-4484-8484-84848484848${index}`,
  owner_id: `85858585-8585-4585-8585-85858585858${index}`,
  username: `${index ? "mobile" : "desktop"}-schedule-owner`,
}));
const passwordOwners = publicationOwners.map((owner, index) => ({
  ...structuredClone(owner),
  document: {
    ...structuredClone(owner.document),
    name: "Protected Fictional Owner",
    publicationVisibility: "password",
  },
  id: `91919191-9191-4191-8191-91919191919${index}`,
  owner_id: `92929292-9292-4292-8292-92929292929${index}`,
  username: `${index ? "mobile" : "desktop"}-protected-owner`,
}));
const workflowOwners = starters.map((owner, index) => ({
  ...owner,
  document: structuredClone(owner.document),
  id: `64646464-6464-4464-8464-64646464646${index}`,
  owner_id: `65656565-6565-4565-8565-65656565656${index}`,
  username: `${index ? "mobile" : "desktop"}-workflow-owner`,
}));
const previewOwners = aiOwners.map((owner, index) => ({
  ...owner,
  document: { ...owner.document, portfolioType: "engineer" },
  id: `63636363-6363-4363-8363-63636363636${index}`,
  owner_id: `62626262-6262-4262-8262-62626262626${index}`,
  username: `${index ? "mobile" : "desktop"}-preview-owner`,
}));
const workspaceOwners = previewOwners.map((owner, index) => ({
  ...structuredClone(owner),
  document: {
    ...structuredClone(owner.document),
    appearance: { accent: "violet", defaultTheme: "dark", theme: "studio" },
  },
  id: `e1e1e1e1-e1e1-41e1-81e1-e1e1e1e1e1e${index}`,
  owner_id: `e2e2e2e2-e2e2-42e2-82e2-e2e2e2e2e2e${index}`,
  username: `${index ? "mobile" : "desktop"}-workspace-owner`,
}));
const guidanceOwners = aiOwners.map((owner, index) => ({
  ...owner,
  id: `60606060-6060-4060-8060-60606060606${index}`,
  owner_id: `61616161-6161-4161-8161-61616161616${index}`,
  username: `${index ? "mobile" : "desktop"}-guidance-owner`,
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
const chatOwners = aiOwners.map((owner, index) => ({
  ...owner,
  id: `86868686-8686-4686-8686-86868686868${index}`,
  owner_id: `87878787-8787-4787-8787-87878787878${index}`,
  username: `${index === 0 ? "desktop" : "mobile"}-chat-owner`,
}));
const googleOwners = ["desktop", "mobile"].map((device, index) => ({
  ...row,
  document: { ...starters[index].document, name: "Google Import Owner", templateChosen: true },
  id: `72727272-7272-4272-8272-72727272727${index}`,
  is_public: false,
  owner_id: `71717171-7171-4171-8171-71717171717${index}`,
  username: `${device}-google-owner`,
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
const themed = portfolioThemes.flatMap((theme, themeIndex) =>
  ["engineer", "designer", "consultant", "minimal"].map((type, typeIndex) => ({
    ...row,
    document: {
      ...profile,
      appearance: { accent: "violet", defaultTheme: "dark", theme: theme.id },
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
  ...guidanceOwners,
  ...previewOwners,
  ...workspaceOwners,
  ...workflowOwners,
  ...publicationOwners,
  ...scheduleOwners,
  ...passwordOwners,
  ...assistantToolOwners,
  ...chatOwners,
  ...billingOwners,
  ...googleOwners,
  ...mediaOwners,
  ...mediaExamples,
  ...libraryOwners,
  ...libraryExamples,
];
const templateLibraries = new Map();
const publications = new Map();
const passwords = new Map();
const passwordAttempts = new Map();
const schedules = new Map();
const usernameAliases = new Map();
const publicCvs = new Map();
function publishSnapshot(entry) {
  const previous = publications.get(entry.id);
  if (previous && previous.username !== entry.username)
    usernameAliases.set(previous.username, entry.id);
  usernameAliases.delete(entry.username);
  const common = {
    id: entry.id,
    revision: entry.revision,
    updated_at: entry.updated_at,
    username: entry.username,
    visibility: entry.document.publicationVisibility ?? "public",
  };
  publications.set(entry.id, {
    ...common,
    document: projectPublicProfile(entry.document, "website"),
  });
  publicCvs.set(entry.id, { ...common, document: projectPublicProfile(entry.document, "cv") });
}
rows.filter((entry) => entry.is_public).forEach(publishSnapshot);
createServer(async (request, response) => {
  const url = new URL(request.url, "http://127.0.0.1:3101");
  response.setHeader("Content-Type", "application/json");
  if (fixtureMaintenance(request, response, url)) return;
  const owner = fixtureOwner(request);
  if (await jobsFixture(request, response, url, owner)) return;
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
  if (url.pathname === "/rest/v1/rpc/resolve_published_username")
    return resolveUsernameRequest(request, response);
  if (
    [
      "portfolio_schedule_status",
      "schedule_portfolio_publication",
      "cancel_portfolio_schedule",
      "execute_portfolio_schedules",
    ].some((name) => url.pathname === `/rest/v1/rpc/${name}`)
  ) {
    await scheduleRequest(request, response, owner, url.pathname.split("/").at(-1));
    return true;
  }
  if (await publicationRpcRequest(request, response, owner, url)) return;
  if (["/rest/v1/portfolio_publications", "/rest/v1/portfolio_public_cvs"].includes(url.pathname))
    return publicSnapshotRequest(response, url, owner);
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
  if (["/rest/v1/reviews", "/rest/v1/referrals"].includes(url.pathname))
    return testimonialRequest(request, response, url, owner);
  response.writeHead(405).end(JSON.stringify({ message: "Unsupported fixture request" }));
}).listen(Number(process.argv[2] ?? 3101), "127.0.0.1");

function fixtureOwner(request) {
  let owner;
  try {
    const token = request.headers.authorization?.split(" ")[1];
    const userId = JSON.parse(Buffer.from(token.split(".")[1], "base64url")).sub;
    owner = [
      row,
      ...starters,
      ...customOwners,
      ...cvImportOwners,
      ...aiOwners,
      ...guidanceOwners,
      ...previewOwners,
      ...workspaceOwners,
      ...workflowOwners,
      ...publicationOwners,
      ...scheduleOwners,
      ...passwordOwners,
      ...assistantToolOwners,
      ...chatOwners,
      ...billingOwners,
      ...googleOwners,
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
    owner &&
    (entry.owner_id === owner.owner_id || (owner.manager && entry.managed_by === owner.owner_id))
  );
}
function matchesRow(entry, url) {
  return ["id", "username", "owner_id", "managed_by", "revision", "is_public", "visibility"].every(
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

async function testimonialRequest(request, response, url, owner) {
  if (url.pathname === "/rest/v1/referrals" && request.method === "GET") {
    const referrals = testimonialReviews.map(({ referral, state }) => ({
      ...referral,
      review: { state },
    }));
    return response.end(JSON.stringify(referrals));
  }
  if (owner?.id !== "main") return response.writeHead(403).end("{}");
  if (request.method === "GET") {
    return response.end(
      JSON.stringify(testimonialReviews.filter(({ state }) => state === "PENDING")),
    );
  }
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  const update = JSON.parse(Buffer.concat(chunks).toString());
  const review = testimonialReviews.find(
    ({ id, state, updated_at }) =>
      url.searchParams.get("id") === `eq.${id}` &&
      url.searchParams.get("state") === `eq.${state}` &&
      url.searchParams.get("updated_at") === `eq.${updated_at}`,
  );
  if (!review) return response.end("[]");
  review.state = update.state;
  review.updated_at = update.updated_at;
  return response.end(JSON.stringify([{ id: review.id }]));
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

  if (request.method === "PATCH" && ownsRow(found, owner))
    return saveProfileRequest(request, response, found);

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

function ownsRow(found, owner) {
  return Boolean(
    found &&
      owner &&
      (found.owner_id === owner.owner_id ||
        (owner.manager && found.owner_id === null && found.managed_by === owner.owner_id)),
  );
}
async function publicationRequest(request, response, owner, withPassword = false) {
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  const input = JSON.parse(Buffer.concat(chunks).toString());
  const found = rows.find((entry) => entry.id === input.profile_id);
  if (!ownsRow(found, owner)) return response.writeHead(403).end(JSON.stringify({ code: "42501" }));
  if (found.revision !== input.expected_revision)
    return response.writeHead(409).end(JSON.stringify({ code: "40001" }));
  if (withPassword) input.publish = true;
  if (!updateFixturePassword(found, input, withPassword))
    return response.writeHead(400).end(JSON.stringify({ code: "22023" }));
  if (input.publish) publishSnapshot(found);
  else {
    const previous = publications.get(found.id);
    if (previous) usernameAliases.set(previous.username, found.id);
    publications.delete(found.id);
    publicCvs.delete(found.id);
  }
  for (const job of schedules.values())
    if (job.snapshot.id === found.id && job.state === "pending") job.state = "cancelled";
  found.is_public = input.publish;
  response.end(JSON.stringify(found.revision));
}
function publicSnapshotRequest(response, url, owner) {
  const entries = [
    ...(url.pathname.endsWith("portfolio_public_cvs") ? publicCvs : publications).values(),
  ].filter(
    (entry) =>
      matchesRow(entry, url) &&
      (entry.visibility !== "password" ||
        ownsRow(
          rows.find((row) => row.id === entry.id),
          owner,
        )),
  );
  if (url.searchParams.get("select") === "username,updated_at")
    response.end(
      JSON.stringify(entries.map(({ username, updated_at }) => ({ updated_at, username }))),
    );
  else response.end(JSON.stringify(entries[0] ?? null));
}

function usernameTaken(username, id) {
  return (
    rows.some((entry) => entry.username === username && entry.id !== id) ||
    [...publications.values()].some((entry) => entry.username === username && entry.id !== id) ||
    (usernameAliases.has(username) && usernameAliases.get(username) !== id)
  );
}
async function resolveUsernameRequest(request, response) {
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  const { requested_username } = JSON.parse(Buffer.concat(chunks).toString());
  const published =
    [...publications.values()].find((entry) => entry.username === requested_username) ??
    publications.get(usernameAliases.get(requested_username));
  response.end(
    JSON.stringify(published ? [{ id: published.id, username: published.username }] : []),
  );
}

async function saveProfileRequest(request, response, found) {
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  const update = JSON.parse(Buffer.concat(chunks).toString());
  if ("is_public" in update)
    return response
      .writeHead(403)
      .end(JSON.stringify({ message: "Publication requires its dedicated action" }));
  if (update.username && usernameTaken(update.username, found.id))
    return response.writeHead(409).end(JSON.stringify({ code: "23505" }));
  Object.assign(found, update);
  response.end(JSON.stringify(found));
  return;
}

async function scheduleRequest(request, response, owner, action) {
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  const input = JSON.parse(Buffer.concat(chunks).toString() || "{}");
  if (action === "execute_portfolio_schedules") {
    if (request.headers.authorization !== "Bearer fixture-scheduler-service")
      return response.writeHead(403).end(JSON.stringify({ code: "42501" }));
    response.end(JSON.stringify(executeFixtureSchedules()));
    return;
  }
  const found = rows.find((entry) => entry.id === input.profile_id);
  if (!ownsRow(found, owner)) return response.writeHead(403).end(JSON.stringify({ code: "42501" }));
  if (action === "portfolio_schedule_status") {
    response.end(
      JSON.stringify(
        [...schedules.values()]
          .filter((job) => job.snapshot.id === found.id)
          .reverse()
          .slice(0, 10)
          .map(({ snapshot, ...job }) => ({
            ...job,
            revision: snapshot.revision,
            username: snapshot.username,
          })),
      ),
    );
    return;
  }
  if (action === "cancel_portfolio_schedule") {
    response.end(JSON.stringify(cancelFixtureSchedule(found.id, input.schedule_id)));
    return;
  }
  if (found.revision !== input.expected_revision)
    return response.writeHead(409).end(JSON.stringify({ code: "40001" }));
  if (Date.parse(input.run_at) < Date.now() + 60000)
    return response.writeHead(400).end(JSON.stringify({ code: "22023" }));
  for (const job of schedules.values())
    if (job.snapshot.id === found.id && job.state === "pending") job.state = "cancelled";
  const id = crypto.randomUUID();
  schedules.set(id, {
    error: null,
    id,
    run_at: input.run_at,
    snapshot: structuredClone(found),
    state: "pending",
    timezone: input.timezone,
  });
  response.end(JSON.stringify(id));
}

function fixtureMaintenance(request, response, url) {
  const resetIndex = ["desktop", "mobile"].indexOf(url.pathname.replace("/__test/reset/", ""));
  if (request.method === "POST" && resetIndex >= 0) {
    Object.assign(starters[resetIndex], structuredClone(initialStarters[resetIndex]));
    publications.delete(starters[resetIndex].id);
    publicCvs.delete(starters[resetIndex].id);
    response.end("{}");
    return true;
  }
  if (request.method === "POST" && url.pathname.startsWith("/__test/schedules/due/")) {
    const username = `${url.pathname.split("/").at(-1)}-schedule-owner`;
    for (const job of schedules.values())
      if (job.snapshot.username === username) job.run_at = new Date(0).toISOString();
    response.end("{}");
    return true;
  }
  return false;
}

function executeFixtureSchedules() {
  let completed = 0;
  for (const job of schedules.values())
    if (job.state === "pending" && Date.parse(job.run_at) <= Date.now()) {
      publishSnapshot(job.snapshot);
      job.state = "completed";
      completed++;
    }
  return completed;
}

function cancelFixtureSchedule(profileId, id) {
  const job = schedules.get(id);
  const pending = job?.snapshot.id === profileId && job.state === "pending";
  if (pending) job.state = "cancelled";
  return pending;
}

async function passwordRequest(request, response, action) {
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  const input = JSON.parse(Buffer.concat(chunks).toString());
  if (action === "portfolio_access_status") {
    const found = [...publications.values()].find(
      (entry) => entry.username === input.requested_username && entry.visibility === "password",
    );
    return response.end(JSON.stringify(found ? { id: found.id, username: found.username } : null));
  }
  if (request.headers.authorization !== "Bearer fixture-scheduler-service")
    return response.writeHead(403).end(JSON.stringify({ code: "42501" }));
  if (action === "reserve_portfolio_access_attempt") {
    const count = (passwordAttempts.get(input.request_bucket) ?? 0) + 1;
    passwordAttempts.set(input.request_bucket, count);
    return response.end(JSON.stringify(count <= 5));
  }
  const credential = passwords.get(input.profile_id);
  if (action === "portfolio_password_record")
    return response.end(JSON.stringify(credential ?? null));
  const snapshot = (input.surface === "cv" ? publicCvs : publications).get(input.profile_id);
  return response.end(
    JSON.stringify(
      credential?.access_version === input.access_version && snapshot?.visibility === "password"
        ? snapshot
        : null,
    ),
  );
}

async function publicationRpcRequest(request, response, owner, url) {
  if (
    [
      "portfolio_access_status",
      "portfolio_password_record",
      "read_protected_publication",
      "reserve_portfolio_access_attempt",
    ].some((name) => url.pathname === `/rest/v1/rpc/${name}`)
  ) {
    await passwordRequest(request, response, url.pathname.split("/").at(-1));
    return true;
  }
  if (
    [
      "/rest/v1/rpc/publish_portfolio_with_password",
      "/rest/v1/rpc/set_portfolio_publication",
    ].includes(url.pathname)
  ) {
    await publicationRequest(
      request,
      response,
      owner,
      url.pathname.endsWith("publish_portfolio_with_password"),
    );
    return true;
  }
  return false;
}

function updateFixturePassword(found, input, withPassword) {
  if (input.publish && found.document.publicationVisibility === "password") {
    const digest = withPassword ? input.password_digest : passwords.get(found.id)?.password_digest;
    if (!digest) return false;
    passwords.set(found.id, { access_version: randomUUID(), password_digest: digest });
  } else passwords.delete(found.id);
  return true;
}
