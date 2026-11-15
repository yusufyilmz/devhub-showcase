/** Renders the `{{name}}`, `{{{name}}}`, and `{{#if name}}` forms used by catalog templates. */
export function renderHbs(template: string, data: Record<string, string>): string {
  const blocks = template.replace(
    /\{\{#if ([A-Za-z0-9_]+)\}\}([\s\S]*?)\{\{\/if\}\}/g,
    (_match, key: string, body: string) => (data[key] ? body : ""),
  );
  return blocks
    .replace(/\{\{\{([A-Za-z0-9_]+)\}\}\}/g, (_match, key: string) => data[key] ?? "")
    .replace(/\{\{([A-Za-z0-9_]+)\}\}/g, (_match, key: string) => data[key] ?? "");
}

/** Package-specific catalog prose, without the shared lookup guide or generated tables. */
export function packageGuidance(existing: string | undefined): string {
  if (!existing) return "";
  let body = existing.replace(/^<!-- Generated[\s\S]*?-->\n+/, "");
  const generated = body.indexOf("## Generated package reference");
  if (generated >= 0) body = body.slice(0, generated);
  body = body.replace(/^# .+\n+/, "");
  body = body.replace(/^> \*\*AI lookup guide:\*\*[^\n]*\n+/, "");
  body = body.replace(/^Workspace package `[^`]+`\.\n+/, "");
  return body.trim();
}

export function catalogTitle(name: string, existing: string | undefined): string {
  const heading = existing?.match(/^# (.+)$/m)?.[1];
  return heading && heading !== "Generated package reference" ? heading : `${name} catalog`;
}

export function catalogQuery(name: string, existing: string | undefined): string {
  return existing?.match(/lookup catalog "([^"]+)"/)?.[1] ?? name.split("/").at(-1) ?? name;
}
