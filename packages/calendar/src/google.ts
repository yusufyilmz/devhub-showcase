import { shiftDate } from "@shared/utils/date";

import type { CalendarItem } from "./model";

export interface GoogleConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

export class GoogleAuthorizationError extends Error {
  constructor(message = "Google authorization is required. Reconnect your Google account.") {
    super(message);
    this.name = "GoogleAuthorizationError";
  }
}

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const CALENDAR_API = "https://www.googleapis.com/calendar/v3";
const TASKS_API = "https://tasks.googleapis.com/tasks/v1";
const SCOPES = [
  "https://www.googleapis.com/auth/calendar.readonly",
  "https://www.googleapis.com/auth/tasks.readonly",
];

const REQUEST_TIMEOUT_MS = 10_000;
const DAY_MS = 86_400_000;
const MAX_COLLECTIONS = 20;
const MAX_PAGES = 5;
const PAGE_SIZE = 100;
const MAX_ITEMS_PER_SOURCE = 5_000;
const COLLECTION_BATCH_SIZE = 4;
const CALENDAR_EVENT_PATH = /^\/calendar\/(?:u\/\d+\/)?(?:r\/)?event(?:edit)?(?:\/|$)/;
const CALENDAR_TASK_PATH = /^\/calendar\/(?:u\/\d+\/)?(?:r\/)?tasks?(?:\/|$)/;

type GoogleRecord = Record<string, unknown>;
type DateRange = { from: string; to: string; timeZone: string };
type GoogleSource = {
  name: string;
  collectionName: string;
  itemName: string;
  listUrl: URL;
  itemsUrl: (id: string) => URL;
  mapItems: (entry: GoogleRecord, id: string, collection: GoogleRecord) => Iterable<CalendarItem>;
};
type PageIssue = "failed" | "limit" | "scope";
type PageResponse = { rows: unknown[]; next?: string } | { issue: "failed" | "scope" };

function record(value: unknown): GoogleRecord | undefined {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as GoogleRecord;
  }
}

function string(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value : undefined;
}

function googleUrl(endpoint: string, params: Record<string, string>) {
  const url = new URL(endpoint);
  url.search = new URLSearchParams(params).toString();
  return url;
}

export function googleAuthorizationUrl(
  config: GoogleConfig,
  state: string,
  codeChallenge: string,
): URL {
  return googleUrl("https://accounts.google.com/o/oauth2/v2/auth", {
    access_type: "offline",
    client_id: config.clientId,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
    prompt: "consent",
    redirect_uri: config.redirectUri,
    response_type: "code",
    scope: SCOPES.join(" "),
    state,
  });
}

async function googleFetch(url: URL | string, init: RequestInit): Promise<Response> {
  try {
    return await fetch(url, { ...init, cache: "no-store", redirect: "error" });
  } catch {
    throw new Error("Could not reach Google.");
  }
}

async function readResponse(response: Response): Promise<GoogleRecord | undefined> {
  try {
    return record(await response.json());
  } catch {
    return undefined;
  }
}

function postForm(url: string, params: Record<string, string>): Promise<Response> {
  return googleFetch(url, {
    body: new URLSearchParams(params),
    method: "POST",
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
}

async function requestToken(config: GoogleConfig, params: Record<string, string>) {
  const response = await postForm(TOKEN_URL, {
    ...params,
    client_id: config.clientId,
    client_secret: config.clientSecret,
  });
  const payload = await readResponse(response);
  if (!response.ok || !payload) {
    const clientError = response.status >= 400 && response.status < 500;
    if (clientError && (payload?.error === "invalid_grant" || payload?.error === "access_denied")) {
      throw new GoogleAuthorizationError();
    }
    throw new Error("Google's token request failed.");
  }
  validateScopes(payload.scope);
  return payload;
}

function validateScopes(scope: unknown) {
  if (scope === undefined) return;
  if (typeof scope !== "string") throw new Error("Google returned an invalid token scope.");
  const granted = new Set(scope.trim().split(/\s+/));
  if (!SCOPES.some((requested) => granted.has(requested))) {
    throw new GoogleAuthorizationError("Google did not grant access to Calendar or Tasks.");
  }
}

export async function exchangeGoogleCode(
  config: GoogleConfig,
  code: string,
  verifier: string,
): Promise<string> {
  const payload = await requestToken(config, {
    code,
    code_verifier: verifier,
    grant_type: "authorization_code",
    redirect_uri: config.redirectUri,
  });
  const refreshToken = string(payload.refresh_token);
  if (!refreshToken) throw new GoogleAuthorizationError("Google did not issue a refresh token.");
  return refreshToken;
}

export async function refreshGoogleToken(
  config: GoogleConfig,
  refreshToken: string,
): Promise<string> {
  const payload = await requestToken(config, {
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  });
  const accessToken = string(payload.access_token);
  if (!accessToken) throw new Error("Google's token response did not include an access token.");
  return accessToken;
}

export async function revokeGoogleToken(refreshToken: string): Promise<void> {
  const response = await postForm("https://oauth2.googleapis.com/revoke", { token: refreshToken });
  if (response.ok) return;
  if (response.status === 400 && (await readResponse(response))?.error === "invalid_token") return;
  throw new Error("Google's token revocation failed.");
}

async function readPages(
  url: URL,
  init: RequestInit,
  entryLimit: number,
): Promise<{ entries: GoogleRecord[]; issue?: PageIssue }> {
  const entries: GoogleRecord[] = [];
  const pageTokens = new Set<string>();
  for (let page = 0; page < MAX_PAGES; page += 1) {
    const result = await fetchPage(url, init);
    if ("issue" in result) return { entries, issue: result.issue };
    const { next } = result;
    const rows = result.rows.map(record).filter((row) => row !== undefined);
    const remaining = entryLimit - entries.length;
    entries.push(...rows.slice(0, remaining));
    if (rows.length > remaining) break;
    if (!next) return { entries };
    if (pageTokens.has(next) || entries.length === entryLimit) break;
    pageTokens.add(next);
    url.searchParams.set("pageToken", next);
  }
  return { entries, issue: "limit" };
}

async function lacksScope(response: Response): Promise<boolean> {
  if (response.status !== 403) return false;
  if (
    /\berror\s*=\s*"?insufficient_scope\b/i.test(response.headers.get("WWW-Authenticate") ?? "")
  ) {
    return true;
  }
  const error = record((await readResponse(response))?.error);
  const details: unknown = error?.details;
  return (
    Array.isArray(details) &&
    details.some((detail) => record(detail)?.reason === "ACCESS_TOKEN_SCOPE_INSUFFICIENT")
  );
}

async function fetchPage(url: URL, init: RequestInit): Promise<PageResponse> {
  let response: Response;
  try {
    response = await googleFetch(url, init);
  } catch {
    return { issue: "failed" };
  }
  if (response.status === 401) throw new GoogleAuthorizationError();
  if (!response.ok) return { issue: (await lacksScope(response)) ? "scope" : "failed" };
  const payload = await readResponse(response);
  if (!payload) return { issue: "failed" };
  const { items = [], nextPageToken } = payload;
  if (!Array.isArray(items)) return { issue: "failed" };
  const next = string(nextPageToken);
  return { rows: items, ...(next && { next }) };
}

function safeGoogleHref(value: unknown, kind: CalendarItem["type"]): string | undefined {
  const url = URL.parse(string(value) ?? "");
  if (url?.protocol !== "https:" || url.port || url.username || url.password) {
    return undefined;
  }

  const calendarWeb = url.hostname === "calendar.google.com" || url.hostname === "www.google.com";
  const path = kind === "event" ? CALENDAR_EVENT_PATH : CALENDAR_TASK_PATH;
  if (calendarWeb && path.test(url.pathname)) {
    return url.href;
  }
  if (kind === "task" && url.hostname === "tasks.google.com") return url.href;
}

function dateLabel(value: unknown): string | undefined {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return undefined;
  const instant = new Date(`${value}T00:00:00Z`);
  if (!Number.isNaN(instant.valueOf()) && instant.toISOString().slice(0, 10) === value)
    return value;
}

function dateFormatter(timeZone: string) {
  return new Intl.DateTimeFormat("en-GB", {
    calendar: "iso8601",
    day: "2-digit",
    hour: "2-digit",
    hourCycle: "h23",
    minute: "2-digit",
    month: "2-digit",
    numberingSystem: "latn",
    second: "2-digit",
    timeZone,
    year: "numeric",
  });
}

function localDateTime(instant: number, formatter: Intl.DateTimeFormat) {
  const parts = Object.fromEntries(
    formatter.formatToParts(instant).map(({ type, value }) => [type, value]),
  );
  return {
    date: `${parts.year?.padStart(4, "0")}-${parts.month}-${parts.day}`,
    time: `${parts.hour}:${parts.minute}:${parts.second}`,
  };
}

function localOffset(instant: number, formatter: Intl.DateTimeFormat): number {
  const { date, time } = localDateTime(instant, formatter);
  // The formatter operates at second precision.
  return Date.parse(`${date}T${time}Z`) - Math.floor(instant / 1000) * 1000;
}

function eventInstant(value: GoogleRecord | undefined, defaultZone: string): number {
  const dateTime = string(value?.dateTime);
  if (!dateTime || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(dateTime)) return Number.NaN;
  if (/(?:Z|[+-]\d{2}:?\d{2})$/i.test(dateTime)) return Date.parse(dateTime);
  const local = Date.parse(`${dateTime}Z`);
  if (Number.isNaN(local)) return Number.NaN;
  try {
    const formatter = dateFormatter(string(value?.timeZone) ?? defaultZone);
    const before = local - localOffset(local - DAY_MS, formatter);
    const after = local - localOffset(local + DAY_MS, formatter);
    // Prefer the earlier instant for a repeated wall time and move forward through a DST gap.
    return before + localOffset(before, formatter) === local ||
      after + localOffset(after, formatter) !== local
      ? before
      : after;
  } catch {
    return Number.NaN;
  }
}

function eventSpan(
  event: GoogleRecord,
  formatter: Intl.DateTimeFormat,
  defaultZone: string,
): { first: string; last: string; time?: string } | undefined {
  const start = record(event.start);
  const end = record(event.end);
  const allDay = dateLabel(start?.date);
  if (allDay) {
    const exclusiveEnd = dateLabel(end?.date);
    return {
      first: allDay,
      last: exclusiveEnd && exclusiveEnd > allDay ? shiftDate(exclusiveEnd, -1) : allDay,
    };
  }

  const startMs = eventInstant(start, defaultZone);
  if (!Number.isFinite(startMs)) return undefined;
  const { date, time } = localDateTime(startMs, formatter);
  const endMs = event.endTimeUnspecified === true ? Number.NaN : eventInstant(end, defaultZone);
  const last = endMs > startMs ? localDateTime(endMs - 1, formatter).date : date;
  return { first: date, last, time: time.slice(0, 5) };
}

function* calendarItems(
  event: GoogleRecord,
  calendarId: string,
  calendar: GoogleRecord,
  range: DateRange,
  formatter: Intl.DateTimeFormat,
): Iterable<CalendarItem> {
  const id = string(event.id);
  if (!id || event.status === "cancelled") return;
  const span = eventSpan(event, formatter, range.timeZone);
  if (!span) return;

  const description = string(event.description);
  const href = safeGoogleHref(event.htmlLink, "event");
  const sourceLabel =
    string(calendar.summaryOverride) ?? string(calendar.summary) ?? "Google Calendar";
  const title = string(event.summary) ?? "Untitled event";
  const firstVisibleDate = span.first.localeCompare(range.from) < 0 ? range.from : span.first;
  for (
    let date = firstVisibleDate;
    date <= span.last && date < range.to;
    date = shiftDate(date, 1)
  ) {
    yield {
      date,
      id: `google-calendar:${encodeURIComponent(calendarId)}:${encodeURIComponent(id)}:${date}`,
      title,
      ...(date === span.first && span.time && { time: span.time }),
      ...(description && { description }),
      source: "google-calendar",
      sourceLabel,
      type: "event",
      ...(href && { href }),
    };
  }
}

function* taskItems(
  task: GoogleRecord,
  listId: string,
  list: GoogleRecord,
  range: DateRange,
): Iterable<CalendarItem> {
  const id = string(task.id);
  const date = dateLabel(string(task.due)?.slice(0, 10));
  if (!id || task.deleted === true || !date || date < range.from || date >= range.to) return;

  const description = string(task.notes);
  const href = safeGoogleHref(task.webViewLink, "task");
  yield {
    date,
    id: `google-tasks:${encodeURIComponent(listId)}:${encodeURIComponent(id)}`,
    title: string(task.title) ?? "Untitled task",
    ...(description && { description }),
    completed: task.status === "completed",
    source: "google-tasks",
    sourceLabel: string(list.title) ?? "Google Tasks",
    type: "task",
    ...(href && { href }),
  };
}

function addWarning(
  warnings: Set<string>,
  issue: PageIssue | undefined,
  source: string,
  resource: string,
  partial: boolean,
) {
  const subject = `${source} ${resource}`;
  if (issue === "scope") warnings.add(`Reconnect Google to grant access to ${source}.`);
  if (issue === "failed") warnings.add(`${partial ? "Some " : ""}${subject} could not be loaded.`);
  if (issue === "limit") warnings.add(`Some ${subject} were omitted because of a limit.`);
}

function collectionsById(collections: GoogleRecord[]) {
  const byId = new Map<string, GoogleRecord>();
  for (const collection of collections) {
    const id = string(collection.id);
    if (id && id !== "." && id !== "..") byId.set(id, collection);
  }
  return [...byId];
}

function appendItems(
  items: Map<string, CalendarItem>,
  rows: GoogleRecord[],
  mapItems: (row: GoogleRecord) => Iterable<CalendarItem>,
): boolean {
  for (const row of rows) {
    for (const item of mapItems(row)) {
      if (items.has(item.id)) continue;
      if (items.size === MAX_ITEMS_PER_SOURCE) return false;
      items.set(item.id, item);
    }
  }
  return true;
}

async function readSource(source: GoogleSource, init: RequestInit) {
  const warnings = new Set<string>();
  const items = new Map<string, CalendarItem>();
  const collections = await readPages(source.listUrl, init, MAX_COLLECTIONS);
  const entries = collectionsById(collections.entries);
  const requiresAuthorization = collections.issue === "scope" && entries.length === 0;
  addWarning(warnings, collections.issue, source.name, source.collectionName, entries.length > 0);
  const result = () => ({
    items: [...items.values()],
    requiresAuthorization,
    warnings: [...warnings],
  });
  for (let index = 0; index < entries.length; index += COLLECTION_BATCH_SIZE) {
    const batch = await Promise.all(
      entries.slice(index, index + COLLECTION_BATCH_SIZE).map(async ([id, collection]) => ({
        collection,
        id,
        ...(await readPages(source.itemsUrl(encodeURIComponent(id)), init, MAX_PAGES * PAGE_SIZE)),
      })),
    );
    for (const { id, collection, entries: rows, issue } of batch) {
      addWarning(warnings, issue, source.name, source.itemName, true);
      if (!appendItems(items, rows, (row) => source.mapItems(row, id, collection))) {
        addWarning(warnings, "limit", source.name, source.itemName, true);
        return result();
      }
    }
  }
  return result();
}

export async function fetchGoogleItems(
  accessToken: string,
  range: DateRange,
): Promise<{ items: CalendarItem[]; warnings: string[] }> {
  if (!dateLabel(range.from) || !dateLabel(range.to) || range.from >= range.to) {
    throw new RangeError("Invalid Google calendar date range.");
  }
  const formatter = dateFormatter(range.timeZone);
  const controller = new AbortController();
  const init = {
    headers: { Authorization: `Bearer ${accessToken}` },
    signal: AbortSignal.any([controller.signal, AbortSignal.timeout(REQUEST_TIMEOUT_MS)]),
  };

  try {
    const sources = await Promise.all([
      readSource(
        {
          collectionName: "calendar lists",
          itemName: "events",
          itemsUrl: (id) =>
            googleUrl(`${CALENDAR_API}/calendars/${id}/events`, {
              maxResults: String(PAGE_SIZE),
              singleEvents: "true",
              timeMax: new Date(Date.parse(`${range.to}T00:00:00Z`) + DAY_MS).toISOString(),
              // Google filters all-day events in each calendar's zone. Pad the UTC query
              // to cover all zones, then clip both kinds of event to the requested dates.
              timeMin: new Date(Date.parse(`${range.from}T00:00:00Z`) - DAY_MS).toISOString(),
              timeZone: range.timeZone,
            }),
          listUrl: googleUrl(`${CALENDAR_API}/users/me/calendarList`, {
            maxResults: String(MAX_COLLECTIONS),
            minAccessRole: "reader",
          }),
          mapItems: (event, id, calendar) => calendarItems(event, id, calendar, range, formatter),
          name: "Google Calendar",
        },
        init,
      ),
      readSource(
        {
          collectionName: "lists",
          itemName: "tasks",
          itemsUrl: (id) =>
            googleUrl(`${TASKS_API}/lists/${id}/tasks`, {
              dueMax: `${range.to}T00:00:00Z`,
              dueMin: `${range.from}T00:00:00Z`,
              maxResults: String(PAGE_SIZE),
              showAssigned: "true",
              showCompleted: "true",
              showHidden: "true",
            }),
          listUrl: googleUrl(`${TASKS_API}/users/@me/lists`, {
            maxResults: String(MAX_COLLECTIONS),
          }),
          mapItems: (task, id, list) => taskItems(task, id, list, range),
          name: "Google Tasks",
        },
        init,
      ),
    ]);
    if (sources.every(({ requiresAuthorization }) => requiresAuthorization)) {
      throw new GoogleAuthorizationError();
    }
    return {
      items: sources.flatMap(({ items }) => items),
      warnings: sources.flatMap(({ warnings }) => warnings),
    };
  } finally {
    controller.abort();
  }
}
