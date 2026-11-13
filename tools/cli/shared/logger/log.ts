import { createHash } from "node:crypto";
import process from "node:process";
import { format } from "node:util";

const RESET = "\x1b[0m";
const colors = {
  added: "\x1b[32m",
  category: "\x1b[1;32m",
  cmd: "\x1b[36m",
  debug: "\x1b[2;37m",
  desc: "\x1b[2m",
  error: "\x1b[1;31m",
  info: "\x1b[36m",
  legacyLabel: "\x1b[1m",
  muted: "\x1b[2m",
  note: "\x1b[2m",
  removed: "\x1b[31m",
  section: "\x1b[1;33m",
  success: "\x1b[1;32m",
  title: "\x1b[1;36m",
  warning: "\x1b[1;33m",
} as const;
export type CliColorKey = keyof typeof colors;
export type CliColor = CliColorKey | (string & {});
export type CliStream = { isTTY?: boolean; write: (text: string) => unknown };
export type CliLogLevel = "log" | "info" | "debug" | "warn" | "error";
export type CliLoggerOptions = {
  message?: string;
  category?: string;
  color?: CliColor;
  stream?: CliStream;
  once?: boolean;
  pretty?: boolean;
  colorEnabled?: boolean;
  [key: string]: unknown;
};
export type CliLoggerConfig = Pick<
  CliLoggerOptions,
  "category" | "color" | "stream" | "once" | "pretty" | "colorEnabled"
>;
export type CliLogMethod = {
  (options: CliLoggerOptions): void;
  (message?: unknown, ...optionalParams: unknown[]): void;
};

/** NO_COLOR wins; FORCE_COLOR=0 disables colors. Explicit settings win over TTY detection. */
export function supportsColor(stream: CliStream = process.stdout, override?: boolean): boolean {
  if (process.env.NO_COLOR !== undefined) return false;
  if (override !== undefined) return override;
  if (process.env.FORCE_COLOR !== undefined) return process.env.FORCE_COLOR !== "0";
  return process.env.TERM !== "dumb" && Boolean(stream.isTTY);
}
export function logLine(text: string, color: CliColor, enabled = supportsColor()): string {
  if (!enabled) return text;
  const code = Object.hasOwn(colors, color) ? colors[color as CliColorKey] : color;
  // Restrict custom colors to SGR sequences rather than arbitrary terminal controls.
  // biome-ignore lint/suspicious/noControlCharactersInRegex: we want to match the exact sequence
  if (!/^(?:\x1b\[[0-9;]*m)+$/.test(code)) return text;
  return `${code}${text}${RESET}`;
}

/** Logging serializer: preserves repeated references; replaces only ancestor cycles. */
export function safeStringify(value: unknown, indent = 2): string {
  const ancestors: object[] = [];
  const errors = new WeakMap<Error, object>();
  return (
    JSON.stringify(
      value,
      function (this: unknown, _key, val: unknown) {
        if (typeof val === "bigint") return `${val}n`;
        if (val === null || typeof val !== "object") return val;
        while (ancestors.length && ancestors.at(-1) !== this) ancestors.pop();
        let converted: object = val;
        if (val instanceof Error) {
          const existing = errors.get(val);
          converted = existing ?? {
            ...val,
            message: val.message,
            name: val.name,
            stack: val.stack,
          };
          if (!existing) errors.set(val, converted);
        }
        if (ancestors.includes(converted)) return "[Circular]";
        ancestors.push(converted);
        return converted;
      },
      indent,
    ) ?? "undefined"
  );
}
function formatValue(value: unknown, pretty: boolean): string {
  if (typeof value === "string") return value;
  if (value instanceof Error) return value.stack ?? `${value.name}: ${value.message}`;
  if (typeof value === "object" && value !== null) {
    try {
      return safeStringify(value, pretty ? 2 : 0);
    } catch {
      return format(value);
    }
  }
  return String(value);
}
function formatArgs(first: unknown, rest: unknown[], pretty: boolean): string {
  if (rest.length && typeof first === "string" && /%[sdjifoOc%]/.test(first)) {
    return format(first, ...rest);
  }
  return [first, ...rest].map((value) => formatValue(value, pretty)).join(" ");
}
const optionKeys = new Set([
  "message",
  "category",
  "color",
  "stream",
  "once",
  "pretty",
  "colorEnabled",
]);
function isOptions(value: unknown): value is CliLoggerOptions {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    !(value instanceof Error) &&
    Object.keys(value).some((key) => optionKeys.has(key))
  );
}
function normalize(input: unknown, args: unknown[], base: CliLoggerConfig): CliLoggerOptions {
  if (isOptions(input) && !args.length) return { ...base, ...input };
  const tail = args.at(-1);
  const opts = args.length && isOptions(tail) ? { ...base, ...tail } : { ...base };
  const values = args.length && isOptions(tail) ? args.slice(0, -1) : args;
  return {
    ...opts,
    message:
      input === undefined && !values.length ? "" : formatArgs(input, values, opts.pretty !== false),
  };
}
const levelColors: Record<CliLogLevel, CliColor> = {
  debug: "debug",
  error: "error",
  info: "info",
  log: "note",
  warn: "warning",
};
const logged = new Set<string>();
const MAX_ONCE_ENTRIES = 1000;
export function resetCliLogOnce(): void {
  logged.clear();
}
function writeLog(level: CliLogLevel, options: CliLoggerOptions): void {
  const {
    message = "",
    category,
    color,
    stream: configuredStream,
    once,
    pretty = true,
    colorEnabled,
    ...metadata
  } = options;
  // Preserve existing default routing. For progress, configure stream: process.stderr.
  const stream = configuredStream ?? (level === "error" ? process.stderr : process.stdout);
  const enabled = supportsColor(stream, colorEnabled);
  const metadataText = Object.keys(metadata).length ? safeStringify(metadata, pretty ? 2 : 0) : "";
  if (once) {
    const key = createHash("sha256")
      .update(safeStringify({ category, level, message, metadata }, 0))
      .digest("hex");
    if (logged.has(key)) return;
    if (logged.size >= MAX_ONCE_ENTRIES) logged.delete(logged.values().next().value!);
    logged.add(key);
  }
  const prefix = [
    category ? logLine(`[${category}]`, color ?? "category", enabled) : "",
    level !== "log" ? logLine(level.toUpperCase(), color ?? levelColors[level], enabled) : "",
  ];
  const messageColor =
    color ?? (level === "warn" ? "warning" : level === "error" ? "error" : undefined);
  const body = messageColor ? logLine(message, messageColor, enabled) : message;
  stream.write(`${[...prefix, body, metadataText].filter(Boolean).join(" ")}\n`);
}
function makeMethod(level: CliLogLevel, base: CliLoggerConfig = {}): CliLogMethod {
  return ((input?: unknown, ...args: unknown[]) =>
    writeLog(level, normalize(input, args, base))) as CliLogMethod;
}
export const cliLog = makeMethod("log");
export const logInfo = makeMethod("info");
export const logDebug = makeMethod("debug");
export const logWarn = makeMethod("warn");
export const logError = makeMethod("error");
export function createCliLogger(options: CliLoggerConfig = {}) {
  return {
    debug: makeMethod("debug", options),
    error: makeMethod("error", options),
    info: makeMethod("info", options),
    log: makeMethod("log", options),
    warn: makeMethod("warn", options),
  };
}
export function logSuccess(message: string, options: CliLoggerConfig = {}): void {
  const stream = options.stream ?? process.stdout;
  writeLog("info", {
    ...options,
    message: `${logLine("✔", "success", supportsColor(stream, options.colorEnabled))} ${message}`,
  });
}
export function logStep(
  stepNum: number,
  total: number,
  name: string,
  options: CliLoggerConfig = {},
): void {
  const stream = options.stream ?? process.stdout;
  const badge = logLine(
    `[${stepNum}/${total}]`,
    "title",
    supportsColor(stream, options.colorEnabled),
  );
  stream.write(` ${badge} ${name}... `);
}
/** Machine-readable output: no prefixes/ANSI; rejects unsupported JSON instead of silently changing it. */
export function writeJson(
  value: unknown,
  options: { pretty?: boolean; stream?: CliStream } = {},
): void {
  const json = JSON.stringify(value, undefined, options.pretty === false ? 0 : 2);
  if (json === undefined) throw new TypeError("Value cannot be represented as a JSON document");
  (options.stream ?? process.stdout).write(`${json}\n`);
}
