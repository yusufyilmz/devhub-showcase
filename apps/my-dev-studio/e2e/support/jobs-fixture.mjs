import { randomUUID } from "node:crypto";

const tables = new Set([
  "job_searches",
  "job_matches",
  "job_listings",
  "job_scan_runs",
  "job_applications",
]);
const listingId = "a".repeat(64);
const timestamp = "2026-11-11T12:00:00.000Z";
const listing = {
  id: listingId,
  listing: {
    company: "Example Systems",
    currency: "GBP",
    date: timestamp,
    dateKind: "posted",
    description: "Build TypeScript tools.",
    employment: "full-time",
    location: "London",
    maximum: 90000,
    minimum: 70000,
    source: "adzuna",
    sourceId: "123",
    title: "Fixture Software Engineer",
    url: "https://jobs.example.test/vacancy",
  },
};
const match = {
  created_at: timestamp,
  explanation: {
    matchedSkills: ["TypeScript"],
    missingRequirements: [],
    reason: "Relevant TypeScript experience.",
  },
  listing_id: listingId,
  notified_at: timestamp,
  score: 93,
  state: "new",
};

const accounts = new Map();

function readRows(response, url, stored) {
  const idFilter = url.searchParams.get("id");
  const exactId = idFilter?.startsWith("eq.") ? idFilter.slice(3) : null;
  const ids = idFilter?.startsWith("in.(") ? idFilter.slice(4, -1).split(",") : null;
  const state = url.searchParams.get("state")?.replace(/^eq\./, "");
  const rows = state
    ? [...stored.values()].filter((row) => row.state === state)
    : [...stored.values()];
  const filtered = rows.filter(
    (row) => (!exactId || row.id === exactId) && (!ids || ids.includes(row.id)),
  );
  response.end(JSON.stringify(filtered));
}

async function writeRow(request, response, url, name, stored) {
  const id = (url.searchParams.get("id") ?? url.searchParams.get("listing_id"))?.replace(
    /^eq\./,
    "",
  );
  const previous = stored.get(id);
  if (request.method === "DELETE") {
    stored.delete(id);
    response.end(JSON.stringify(previous ?? null));
    return;
  }
  const body = [];
  for await (const chunk of request) body.push(chunk);
  const data = JSON.parse(Buffer.concat(body).toString());
  const key = id ?? data.listing_id ?? randomUUID();
  const updated =
    name === "job_searches"
      ? { ...previous, ...data, due_at: new Date().toISOString(), id: key }
      : { draft: null, updated_at: timestamp, ...stored.get(key), ...data };
  const status = url.searchParams.get("status")?.replace(/^eq\./, "");
  const ignoreDuplicate =
    stored.has(key) && request.headers.prefer?.includes("resolution=ignore-duplicates");
  if (!ignoreDuplicate && (!status || previous?.status === status)) stored.set(key, updated);
  if (url.searchParams.has("select")) response.end(JSON.stringify(updated));
  else response.writeHead(204).end();
}

export async function jobsFixture(request, response, url, owner) {
  const name = url.pathname.replace("/rest/v1/", "");
  if (!tables.has(name)) return false;
  if (!owner) {
    response.writeHead(401).end("{}");
    return true;
  }
  if (!accounts.has(owner.owner_id)) {
    accounts.set(owner.owner_id, {
      job_applications: new Map(),
      job_listings: new Map([[listingId, listing]]),
      job_matches: new Map([[listingId, match]]),
      job_scan_runs: new Map(),
      job_searches: new Map(),
    });
  }
  const stored = accounts.get(owner.owner_id)[name];
  if (request.method === "GET") readRows(response, url, stored);
  else await writeRow(request, response, url, name, stored);
  return true;
}
