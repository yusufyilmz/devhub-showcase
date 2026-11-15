import { createHash } from "node:crypto";

import { type JobFilters, type JobListing, listingSchema } from "./schema";

const adzunaCurrencies: Record<string, string> = {
  at: "EUR",
  au: "AUD",
  be: "EUR",
  br: "BRL",
  ca: "CAD",
  ch: "CHF",
  de: "EUR",
  es: "EUR",
  fr: "EUR",
  gb: "GBP",
  in: "INR",
  it: "EUR",
  mx: "MXN",
  nl: "EUR",
  nz: "NZD",
  pl: "PLN",
  sg: "SGD",
  us: "USD",
  za: "ZAR",
};
const joobleDomains: Record<string, string> = {
  au: "au.jooble.org",
  ca: "ca.jooble.org",
  de: "de.jooble.org",
  es: "es.jooble.org",
  fr: "fr.jooble.org",
  gb: "uk.jooble.org",
  in: "in.jooble.org",
  it: "it.jooble.org",
  nl: "nl.jooble.org",
  pl: "pl.jooble.org",
  us: "jooble.org",
};

const record = (value: unknown): Record<string, unknown> =>
  typeof value === "object" && value !== null ? (value as Record<string, unknown>) : {};
const plain = (value: unknown, limit = 200) =>
  typeof value === "string"
    ? value
        .replace(/<[^>]*>/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, limit)
    : "";
const number = (value: unknown) =>
  typeof value === "number" && Number.isFinite(value) && value >= 0 ? value : null;
const date = (value: unknown) => {
  const time = Date.parse(plain(value));
  return Number.isFinite(time) ? new Date(time).toISOString() : null;
};
const sourceId = (value: unknown) => (typeof value === "number" ? String(value) : plain(value));

function joobleSalary(value: unknown) {
  const salary = /^([\d,]+)(?:\s*[-–]\s*([\d,]+))?\s+([A-Z]{3})$/.exec(plain(value));
  const [, lower, upper, currency] = salary ?? [];
  return {
    currency: currency ?? "",
    maximum: lower ? Number((upper ?? lower).replaceAll(",", "")) : null,
    minimum: lower ? Number(lower.replaceAll(",", "")) : null,
  };
}

function normalize(
  source: Exclude<JobListing["source"], "linkedin">,
  row: Record<string, unknown>,
  country: string,
) {
  const adzuna = source === "adzuna";
  const salary = adzuna
    ? {
        currency: adzunaCurrencies[country],
        maximum: number(row.salary_max),
        minimum: number(row.salary_min),
      }
    : joobleSalary(row.salary);
  const result = listingSchema.safeParse({
    company: plain(adzuna ? record(row.company).display_name : row.company),
    ...salary,
    date: date(adzuna ? row.created : row.updated),
    dateKind: adzuna ? "posted" : "updated",
    description: plain(adzuna ? row.description : row.snippet, 4000),
    employment: plain(
      adzuna ? `${plain(row.contract_time)} ${plain(row.contract_type)}` : row.type,
    ),
    location: plain(adzuna ? record(row.location).display_name : row.location),

    source,
    sourceId: sourceId(row.id),
    title: plain(row.title),
    url: adzuna ? row.redirect_url : row.link,
  });
  return result.success ? [result.data] : [];
}

export type JobProviders = {
  adzuna?: { appId: string; key: string };
  joobleKeys: Readonly<Record<string, string>>;
};

export function isProviderConfigured(
  source: Exclude<JobListing["source"], "linkedin">,
  country: string,
  providers: JobProviders,
) {
  return source === "adzuna"
    ? Boolean(providers.adzuna && Object.hasOwn(adzunaCurrencies, country))
    : Boolean(joobleDomains[country] && providers.joobleKeys[country]);
}

function providerSearch(filters: JobFilters) {
  return [filters.title, filters.keywords, filters.workplace].filter(Boolean).join(" ");
}

function adzunaQuery(filters: JobFilters) {
  return {
    "content-type": "application/json",
    results_per_page: "20",
    what: providerSearch(filters),
    where: filters.location,
  };
}

export function adzunaSearchKey(filters: JobFilters, appId: string) {
  return createHash("sha256")
    .update(JSON.stringify([appId, filters.country, 1, adzunaQuery(filters)]))
    .digest("hex");
}

export async function discoverJobs(
  source: Exclude<JobListing["source"], "linkedin">,
  filters: JobFilters,
  providers: JobProviders,
  signal: AbortSignal,
  request = fetch,
) {
  const { country, location } = filters;
  let response: Response;
  if (source === "adzuna") {
    if (!providers.adzuna || !Object.hasOwn(adzunaCurrencies, country))
      throw new Error("unconfigured");
    const url = new URL(`https://api.adzuna.com/v1/api/jobs/${country}/search/1`);
    url.search = new URLSearchParams({
      app_id: providers.adzuna.appId,
      app_key: providers.adzuna.key,
      ...adzunaQuery(filters),
    }).toString();
    response = await request(url, { cache: "no-store", redirect: "error", signal });
  } else {
    const domain = joobleDomains[country];
    const key = providers.joobleKeys[country];
    if (!domain || !key) throw new Error("unconfigured");
    response = await request(`https://${domain}/api/${encodeURIComponent(key)}`, {
      body: JSON.stringify({ keywords: providerSearch(filters), location, ResultOnPage: 20 }),
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
      method: "POST",
      redirect: "error",
      signal,
    });
  }
  if (!response.ok) throw new Error(response.status === 429 ? "rate-limited" : "unavailable");
  const payload = record(await response.json());
  const jobs = source === "adzuna" ? payload.results : payload.jobs;
  if (!Array.isArray(jobs)) throw new Error("invalid response");
  return {
    examined: Math.min(jobs.length, 20),
    jobs: jobs.slice(0, 20).flatMap((job) => normalize(source, record(job), country)),
  };
}

const canonical = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
export function jobIdentity(job: JobListing) {
  const fields = [job.title, job.company, job.location].map(canonical);
  const key = fields.every(Boolean)
    ? fields.join("|")
    : [job.source, job.sourceId || job.url].join("|");
  return createHash("sha256").update(key).digest("hex");
}

const includesAny = (text: string, terms: string) =>
  terms
    .toLowerCase()
    .split(",")
    .some((term) => term.trim() && text.includes(term.trim()));

function passesSalaryFilters(job: JobListing, filters: JobFilters) {
  if (filters.currency && job.currency !== filters.currency) return false;
  if (filters.minimum !== null && (job.maximum === null || job.maximum < filters.minimum))
    return false;
  return filters.maximum === null || (job.minimum !== null && job.minimum <= filters.maximum);
}

function passesPostingFilters(job: JobListing, filters: JobFilters, text: string, now: number) {
  if (
    filters.postedDays &&
    (job.dateKind !== "posted" ||
      !job.date ||
      Date.parse(job.date) < now - filters.postedDays * 86_400_000)
  )
    return false;
  if (!filters.sponsorship) return true;
  const mentions = /\b(?:visa sponsorship|sponsor (?:a |your )?visa)\b/;
  const excludes =
    /\b(?:no|without|unable to offer) (?:visa )?sponsorship\b|sponsorship (?:is )?not|not (?:provide|offer) (?:visa )?sponsorship/;
  return mentions.test(text) && !excludes.test(text);
}

export function passesJobFilters(job: JobListing, filters: JobFilters, now = Date.now()) {
  const text = `${job.title} ${job.description}`.toLowerCase();
  const workplace = {
    hybrid: /\bhybrid\b/,
    onsite: /\bon[ -]?site\b/,
    remote: /\b(remote|work from home)\b/,
  };
  if (filters.workplace && !workplace[filters.workplace].test(text)) return false;
  if (filters.experience && !new RegExp(`\\b${filters.experience}\\b`, "i").test(job.title))
    return false;
  if (
    filters.employment &&
    !job.employment.replaceAll(/[_ ]/g, "-").toLowerCase().includes(filters.employment)
  )
    return false;
  if (!passesPostingFilters(job, filters, text, now)) return false;
  if (!passesSalaryFilters(job, filters)) return false;
  return (
    !includesAny(text, filters.excludedKeywords) &&
    !includesAny(job.company.toLowerCase(), filters.excludedCompanies)
  );
}

export function discoveryCandidates(jobs: JobListing[], filters: JobFilters) {
  const candidates = new Map<string, JobListing>();
  for (const job of jobs) {
    if (!passesJobFilters(job, filters)) continue;
    const id = jobIdentity(job);
    const current = candidates.get(id);
    if (!current || job.description.length > current.description.length) candidates.set(id, job);
  }
  return [...candidates.entries()].sort(
    ([, a], [, b]) =>
      Number(includesAny(b.company.toLowerCase(), filters.preferredCompanies)) -
      Number(includesAny(a.company.toLowerCase(), filters.preferredCompanies)),
  );
}
