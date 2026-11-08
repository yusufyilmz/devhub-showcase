export type LookupKind =
  | "symbol"
  | "capability"
  | "design"
  | "docs"
  | "skills"
  | "catalog"
  | "section";
export interface LookupOptions {
  audience?: CatalogAudience;
  cursor?: string;
  format?: "json" | "text";
  limit?: number;
  maxTokens?: number;
  package?: string;
  root?: string;
}
export interface LookupRecord {
  anchor?: string;
  artifact: string;
  audience?: CatalogAudience;
  constraints?: string[];
  content?: string;
  export?: string;
  heading?: string;
  id: string;
  import?: string;
  kind?: "type" | "value";
  name?: string;
  package?: string;
  purpose?: string;
  subpath?: string;
  versions: Record<string, string>;
}
export type LookupStatus = "ok" | "ambiguous" | "no_match" | "budget_too_small" | "error";
export interface LookupResponse {
  accounting: {
    package: "js-tiktoken";
    version: "1.0.21";
    encoding: "cl100k_base";
    estimate: "encoding-specific; not conversation billing";
    maxTokens: number;
    tokens: number;
  };
  cursor?: string;
  error?: { code: string; message: string };
  hasMore: boolean;
  locator?: Pick<LookupRecord, "id" | "artifact" | "heading" | "anchor">;
  results: LookupRecord[];
  selected: number;
  status: LookupStatus;
  suggestions?: string[];
  total: number;
  unresolved?: number;
}
export interface LookupOutput {
  diagnostic?: string;
  exitCode: 0 | 2 | 3 | 4;
  response: LookupResponse;
  stdout: string;
}
export class LookupError extends Error {
  readonly code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}

export type CatalogAudience = "UI" | "SERVER" | "SHARED";
