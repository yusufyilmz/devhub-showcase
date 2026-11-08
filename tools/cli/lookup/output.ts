import { Tiktoken } from "js-tiktoken/lite";
import cl100k from "js-tiktoken/ranks/cl100k_base";

import { digest } from "./markdown.ts";
import {
  LookupError,
  type LookupOptions,
  type LookupOutput,
  type LookupRecord,
  type LookupResponse,
} from "./types.ts";

let encoder: Tiktoken | undefined;
export function countLookupTokens(value: string): number {
  encoder ??= new Tiktoken(cl100k);
  return encoder.encode(value, [], []).length;
}
export function continuation(identity: string, offset: number): string {
  return Buffer.from(JSON.stringify([1, identity, offset])).toString("base64url");
}
export function cursorOffset(cursor: string | undefined, identity: string, total: number): number {
  if (!cursor) return 0;
  try {
    if (cursor.length > 256 || !/^[\w-]+$/.test(cursor))
      throw new Error("Invalid continuation payload");
    const decoded: unknown = JSON.parse(Buffer.from(cursor, "base64url").toString());
    if (
      !Array.isArray(decoded) ||
      decoded.length !== 3 ||
      decoded[0] !== 1 ||
      decoded[1] !== identity ||
      !Number.isSafeInteger(decoded[2]) ||
      decoded[2] <= 0 ||
      decoded[2] >= total
    )
      throw new Error("Invalid continuation payload");
    return decoded[2] as number;
  } catch {
    throw new LookupError(
      "invalid_cursor",
      "Cursor does not match the query, filters or artifact snapshot; restart/refine the lookup",
    );
  }
}
function render(response: LookupResponse, format: LookupOptions["format"]): string {
  if (format !== "text") return `${JSON.stringify(response)}\n`;
  const { results, ...metadata } = response;
  return `${JSON.stringify(metadata)}\n${results
    .map((record) => {
      const { content, constraints, ...facts } = record;
      return [JSON.stringify(facts), content, ...(constraints ?? [])].filter(Boolean).join("\n\n");
    })
    .join("\n\n")}\n`;
}
function measured(response: LookupResponse, format: LookupOptions["format"]): string {
  // The count is itself part of stdout. Reach a fixed point after final pagination.
  for (let iteration = 0; iteration < 16; iteration++) {
    const stdout = render(response, format);
    const tokens = countLookupTokens(stdout);
    if (tokens === response.accounting.tokens) return stdout;
    response.accounting.tokens = tokens;
  }
  throw new LookupError("token_accounting", "Final stdout token count did not stabilize");
}
interface OutputContext {
  error?: LookupResponse["error"];
  identity: string;
  status?: LookupResponse["status"];
  suggestions?: string[];
  unresolved?: number;
}
function envelope(total: number, maxTokens: number, context: OutputContext): LookupResponse {
  return {
    hasMore: false,
    results: [],
    selected: 0,
    status: context.status ?? (total ? "ok" : "no_match"),
    total,
    ...(context.suggestions?.length ? { suggestions: context.suggestions } : {}),
    ...(context.unresolved ? { unresolved: context.unresolved } : {}),
    ...(context.error ? { error: context.error } : {}),
    accounting: {
      encoding: "cl100k_base",
      estimate: "encoding-specific; not conversation billing",
      maxTokens,
      package: "js-tiktoken",
      tokens: 0,
      version: "1.0.21",
    },
  };
}
function paginate(response: LookupResponse, offset: number, identity: string) {
  response.selected = response.results.length;
  response.hasMore = offset + response.selected < response.total;
  response.cursor = response.hasMore
    ? continuation(identity, offset + response.selected)
    : undefined;
}
function oversized(response: LookupResponse, record: LookupRecord, offset: number) {
  response.status = "budget_too_small";
  response.error = {
    code: "budget_too_small",
    message:
      "Complete record cannot fit; use section with this id and a larger --max-tokens, or refine the query",
  };
  response.locator = {
    artifact: record.artifact,
    id: record.id,
    ...(record.heading ? { heading: record.heading } : {}),
    ...(record.anchor ? { anchor: record.anchor } : {}),
  };
  if (!offset) response.cursor = undefined;
}
function bounded(response: LookupResponse, format: LookupOptions["format"]): string {
  const stdout = measured(response, format);
  if (countLookupTokens(stdout) <= response.accounting.maxTokens) return stdout;
  response.status = "budget_too_small";
  response.results = [];
  response.selected = 0;
  response.error = {
    code: "budget_too_small",
    message: "Budget cannot fit the response envelope; increase --max-tokens",
  };
  response.locator = undefined;
  response.cursor = undefined;
  response.suggestions = undefined;
  const smaller = measured(response, format);
  if (countLookupTokens(smaller) <= response.accounting.maxTokens) return smaller;
  response.accounting.tokens = 0;
  return "";
}
function diagnostic(response: LookupResponse): string | undefined {
  if (response.error) return response.error.message;
  if (response.status === "no_match")
    return "No match; refine the query or inspect unresolved wildcard inventory";
  if (response.hasMore)
    return "Results incomplete; continue with --cursor or refine the query. Verify contracts in matching package exports/declarations.";
}
const exitCodes = { ambiguous: 0, budget_too_small: 4, error: 2, no_match: 3, ok: 0 } as const;
export function serializeLookup(
  records: LookupRecord[],
  options: LookupOptions,
  context: OutputContext,
): LookupOutput {
  const maxTokens = options.maxTokens ?? 1500;
  const identity = digest(context.identity).slice(0, 32);
  const offset = context.error ? 0 : cursorOffset(options.cursor, identity, records.length);
  const response = envelope(records.length, maxTokens, context);
  for (const record of records.slice(offset, offset + (options.limit ?? 5))) {
    response.results.push(record);
    paginate(response, offset, identity);
    if (countLookupTokens(measured(response, options.format)) > maxTokens) {
      response.results.pop();
      break;
    }
  }
  paginate(response, offset, identity);
  const first = records[offset];
  if (first && !response.selected) oversized(response, first, offset);
  const stdout = bounded(response, options.format);
  const message = diagnostic(response);
  return {
    exitCode: exitCodes[response.status],
    response,
    stdout,
    ...(message ? { diagnostic: message } : {}),
  };
}
