import { stripVTControlCharacters } from "node:util";

import { createCliLogger, logLine } from "./log.ts";

function streamFor(stream: NodeJS.WriteStream) {
  return {
    isTTY: stream.isTTY,
    write(text: string) {
      const color =
        Boolean(stream.isTTY) &&
        process.env.NO_COLOR === undefined &&
        process.env.FORCE_COLOR !== "0";
      return stream.write(color ? text : stripVTControlCharacters(text));
    },
  };
}
const BOLD = "\x1b[1m";
const RULE = "\x1b[35m";
const TEXT = "\x1b[39m";
const severityColors: Record<string, string> = {
  error: "error",
  info: "info",
  warn: "warning",
  warning: "warning",
};
// Colors are always emitted here; streamFor strips them for non-TTY or NO_COLOR.
const paint = (text: string, color: string): string => logLine(text, color, true);

const FINDING = /^(\s+)(error|warn|warning|info) (\S+?)((?::\d+)*): (.*)$/;
const CATEGORY = /^(\s+)([\w-]+): (.*)$/;
const LABEL = /^([A-Z][A-Za-z ]*): (.*)$/;

function paintFile(file: string): string {
  const slash = file.lastIndexOf("/");
  return slash < 0
    ? paint(file, BOLD)
    : paint(file.slice(0, slash + 1), "muted") + paint(file.slice(slash + 1), BOLD);
}

/** Styles one unified-diff line; stripping colors restores `line` exactly. */
export function colorizeDiffLine(line: string): string {
  if (line.startsWith("+++ ") || line.startsWith("--- ")) return paint(line, BOLD);
  if (line.startsWith("@@")) return paint(line, "info");
  if (line.startsWith("+")) return paint(line, "added");
  if (line.startsWith("-")) return paint(line, "removed");
  return paint(line, "muted");
}

/** Styles one check detail line per segment; stripping colors restores `line` exactly. */
export function colorizeDetail(line: string, header = false): string {
  if (header) return paintFile(line);
  const finding = FINDING.exec(line);
  if (finding) {
    const [, indent, severity, rule, location, message] = finding;
    return `${indent}${paint(severity!, severityColors[severity!]!)} ${paint(rule!, RULE)}${paint(`${location}:`, "muted")} ${paint(message!, TEXT)}`;
  }
  const category = CATEGORY.exec(line);
  if (category) {
    const [, indent, name, rest] = category;
    return `${indent}${paint(name!, "warning")}${paint(":", "muted")} ${paint(rest!, TEXT)}`;
  }
  const label = LABEL.exec(line);
  if (label) return `${paint(`${label[1]}:`, "muted")} ${paint(label[2]!, TEXT)}`;
  return paint(line, "info");
}

export interface UiIssue {
  file: string;
  line?: number;
  message: string;
  rule: string;
  severity?: string;
}

/** Console UI shared by every CLI; `category` is the bracketed log prefix. */
export function createConsoleUI(category: string) {
  const output = createCliLogger({
    category,
    stream: streamFor(process.stdout),
  });
  const errors = createCliLogger({
    category,
    stream: streamFor(process.stderr),
  });
  const detail = (line: string, header = false): void => {
    output.info({ color: "info", message: colorizeDetail(line, header) });
  };

  return {
    detail,
    /** Lines from a pretty report: a non-indented line after a blank one is a file header. */
    details(lines: string[]) {
      let afterBlank = false;
      for (const line of lines) {
        detail(line, afterBlank && /^\S/.test(line));
        afterBlank = line.trim() === "";
      }
    },
    diff(text: string) {
      for (const line of text.split("\n"))
        output.info({ color: "info", message: colorizeDiffLine(line) });
    },
    error(message: string) {
      errors.error({ color: "error", message: `✖ ${message}` });
    },
    info(message: string) {
      output.info({ color: "info", message });
    },
    issue(issue: UiIssue) {
      const marker = paint("⚠", severityColors[issue.severity ?? "warn"] ?? "warning");
      const location = issue.line ? `:${issue.line}` : "";
      output.warn({
        color: "warning",
        message: `${marker} ${paintFile(issue.file)}${paint(`${location}:`, "muted")} ${paint(issue.rule, RULE)}${paint(":", "muted")} ${paint(issue.message, TEXT)}`,
      });
    },
    start(message: string) {
      output.info({ color: "title", message: `▶ ${message}` });
    },
    success(message: string) {
      output.info({ color: "success", message: `✔ ${message}` });
    },
    warning(message: string) {
      output.warn({ color: "warning", message: `⚠ ${message}` });
    },
  };
}
