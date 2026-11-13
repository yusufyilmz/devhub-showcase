import type { Command } from "commander";

export interface PresentationOptions {
  pretty?: boolean;
}

export function addPresentationOptions(command: Command): Command {
  command.enablePositionalOptions();

  if (!command.options.some((option) => option.attributeName() === "pretty")) {
    command
      .option("--pretty", "Readable presentation (enabled by default)", true)
      .option("--no-pretty", "Compact JSON and plain console presentation");
  }

  for (const child of command.commands) {
    addPresentationOptions(child);
  }

  return command;
}

export function stringifyOutput(value: unknown, pretty = true): string {
  return JSON.stringify(value, null, pretty ? 2 : undefined);
}

const categories = [
  "dependencies",
  "devDependencies",
  "optionalPeerDependencies",
  "unlisted",
  "unresolved",
  "exports",
  "types",
  "files",
] as const;

/** One normalized finding per issue; owners and engine metadata are not findings. */
export function normalizeFindings(native: unknown): Record<string, unknown>[] {
  if (!native || typeof native !== "object") return [];
  const report = native as Record<string, unknown>;
  const findings: Record<string, unknown>[] = [];
  const seen = new Set<string>();
  const add = (finding: Record<string, unknown>) => {
    const key = JSON.stringify(finding);
    if (!seen.has(key)) {
      seen.add(key);
      findings.push(finding);
    }
  };
  if (Array.isArray(report.files)) {
    for (const file of report.files) {
      if (typeof file === "string") add({ category: "files", file });
    }
  }
  if (Array.isArray(report.issues)) {
    for (const row of report.issues) {
      if (!row || typeof row !== "object") continue;
      const issue = row as Record<string, unknown>;
      for (const category of categories) {
        const entries = issue[category];
        if (!Array.isArray(entries)) continue;
        for (const entry of entries) {
          const detail =
            typeof entry === "string"
              ? { name: entry }
              : entry && typeof entry === "object"
                ? (entry as Record<string, unknown>)
                : {};
          add({ category, file: issue.file, ...detail });
        }
      }
    }
  }
  return findings;
}

/** Project internal engine results into a stable, non-duplicated CLI payload. */
export function publicCheckReport(report: unknown): unknown {
  if (!report || typeof report !== "object") return report;
  const { native, diagnostics, summary, ...rest } = report as Record<string, unknown>;
  const diagnosticPath =
    diagnostics && typeof diagnostics === "object"
      ? (diagnostics as Record<string, unknown>).engineReport
      : undefined;
  const payload: Record<string, unknown> = {
    ...rest,
    summary: typeof summary === "string" ? summary.split("\n")[0] : summary,
  };
  if (rest.engine === "knip") {
    const findings = normalizeFindings(native);
    payload.findings = findings;
    payload.findingCount = findings.length;
  } else if (native !== undefined) {
    if (
      native &&
      typeof native === "object" &&
      Array.isArray((native as Record<string, unknown>).issues)
    ) {
      payload.findings = (native as Record<string, unknown>).issues;
      payload.findingCount = (payload.findings as unknown[]).length;
      payload.totalFiles = (native as Record<string, unknown>).totalFiles;
      if (rest.engine === "links") payload.checks = (native as Record<string, unknown>).checks;
      if (rest.engine === "docs-reachability") {
        const details = native as Record<string, unknown>;
        for (const key of ["scope", "entries", "warnings", "limitations"])
          payload[key] = details[key];
      }
    } else payload.findings = native;
  }
  if (typeof diagnosticPath === "string") payload.diagnosticsFile = diagnosticPath;
  return payload;
}

function formatBaseConsole(report: unknown, pretty = true): string {
  const payload = publicCheckReport(report) as Record<string, unknown>;
  const lines = [String(payload.summary ?? "")];
  if (payload.engine !== "knip" || !Array.isArray(payload.findings)) {
    if (
      Array.isArray(payload.findings) &&
      ["links", "actionlint", "ai-quality", "docs-reachability"].includes(String(payload.engine))
    ) {
      if (payload.engine === "links" && payload.checks && typeof payload.checks === "object") {
        const checks = payload.checks as Record<string, unknown>;
        lines.push(
          `Local validation: ${payload.totalFiles ?? 0} file(s), ${checks.localFindings ?? 0} finding(s)`,
        );
        lines.push(
          checks.networkEnabled
            ? `Network: ${checks.external ?? 0} external URL(s), ${checks.githubVerified ?? 0}/${checks.github ?? 0} GitHub paths verified`
            : "Network: disabled (--no-external)",
        );
        if (payload.totalFiles === 0) lines.push("No documents selected; checks skipped.");
      }
      let previousFile: unknown;
      const findings = [...payload.findings] as Record<string, unknown>[];
      findings.sort(
        (a, b) =>
          String(a.file).localeCompare(String(b.file)) || Number(a.line ?? 0) - Number(b.line ?? 0),
      );
      for (const finding of findings) {
        if (pretty && finding.file !== previousFile) {
          lines.push(`\n${finding.file ?? "(unknown file)"}`);
          previousFile = finding.file;
        }
        const location = finding.line ? `:${finding.line}` : "";
        lines.push(
          pretty
            ? `  ${finding.severity} ${finding.rule}${location}: ${finding.message}`
            : `${finding.file}${location}: ${finding.severity} ${finding.rule}: ${finding.message}`,
        );
      }
      return lines.join("\n");
    }
    // Preserve existing duplicate-code details; only Knip's JSON blobs are replaced.
    const original = report as Record<string, unknown>;
    return String(original.summary ?? "");
  }
  let previousFile: unknown;
  for (const entry of payload.findings) {
    const finding = entry as Record<string, unknown>;
    if (pretty && finding.file !== previousFile) {
      lines.push(`\n${finding.file ?? "(unknown file)"}`);
      previousFile = finding.file;
    }
    const location = finding.line ? `:${finding.line}${finding.col ? `:${finding.col}` : ""}` : "";
    lines.push(
      pretty
        ? `  ${finding.category}: ${finding.name ?? "unused file"}${location}`
        : `${finding.file}${location} ${finding.category}: ${finding.name ?? "unused file"}`,
    );
  }
  return lines.join("\n");
}

/** Always expose fix previews/status without leaking engine diagnostics. */
export function formatCheckConsole(report: unknown, pretty = true): string {
  const base = formatBaseConsole(report, pretty);
  const fix = (
    report as {
      fix?: {
        status: string;
        changes: Array<{ file: string; action: string; reasons: string[] }>;
        skipped: string[];
        backup?: string;
        lockfile: string;
      };
    }
  ).fix;
  if (!fix) return base;
  return [
    base,
    `Fix status: ${fix.status} — ${fix.changes.length} file(s) proposed, ${fix.skipped.length} unresolved/skipped`,
    ...fix.changes.map(
      (change) => `${change.action}: ${change.file} — ${change.reasons.join(", ")}`,
    ),
    ...fix.skipped.map((message) => `Skipped: ${message}`),
    ...(fix.backup ? [`Backup: ${fix.backup}`] : []),
    fix.lockfile,
  ].join("\n");
}
