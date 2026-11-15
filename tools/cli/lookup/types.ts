export type CatalogAudience = "UI" | "SERVER" | "SHARED";

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
  versions?: Record<string, string>;
}

export class LookupError extends Error {
  readonly code: "invalid_schema" | "missing_artifact" | "unsafe_path";

  constructor(code: LookupError["code"], message: string) {
    super(message);
    this.code = code;
    this.name = "LookupError";
  }
}
