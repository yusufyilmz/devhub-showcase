import { env } from "@shared/env";

/**
 * Structured Logging System
 * Only logs in development environment or when explicitly enabled via environment variables
 *
 * Features:
 * - Formatted console output with colors and emojis
 * - Stringified JSON output for easy copying and analysis
 * - Context-aware logging with component, action, and user info
 * - Performance monitoring with timing functions
 * - Configurable log levels and output modes
 *
 * Environment Variables:
 * - NEXT_PUBLIC_ENABLE_LOGGING: Force enable logging in any environment
 * - NEXT_PUBLIC_LOG_LEVEL: Set log level (ERROR, WARN, INFO, DEBUG, TRACE)
 * - NEXT_PUBLIC_LOG_STRING_OUTPUT: Enable/disable JSON string output for copying
 * - NEXT_PUBLIC_LOG_PREFIX: Customize log prefix emoji/text
 *
 * Usage:
 * ```typescript
 * import { logger } from '@shared/utils/logger'

 *
 * // Basic logging
 * logger.info('User action completed', { userId: 123, action: 'login' })
 *
 * // Component logging
 * const componentLogger = createComponentLogger('MyComponent')
 * componentLogger.debug('Render completed', { props })
 *
 * // Enable/disable copyable JSON output
 * logger.enableStringOutput()  // Shows JSON after each log
 * logger.disableStringOutput() // Disables JSON output
 * ```
 */
// Optional external pretty console; fall back to no-op if unavailable
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let BeautifyConsole: any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let ColorType: any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let LogType: any;
try {
  BeautifyConsole = require("beautify-console-log/lib/beautify-console").BeautifyConsole;
  const models: any = require("beautify-console-log/lib/beautify-console/model");
  ColorType = models.ColorType;
  LogType = models.LogType;
} catch {
  class FallbackConsole {
    static getInstance() {
      return new FallbackConsole();
    }
    success() {
      // Fallback implementation - no-op
    }
    info() {
      // Fallback implementation - no-op
    }
    warn() {
      // Fallback implementation - no-op
    }
    error() {
      // Fallback implementation - no-op
    }
    log() {
      // Fallback implementation - no-op
    }
    group() {
      // Fallback implementation - no-op
    }
    groupEnd() {
      // Fallback implementation - no-op
    }
  }
  BeautifyConsole = FallbackConsole;
  ColorType = {};
  LogType = {};
}

const isDev = () => env.NODE_ENV === "development";

const logLevelValues = {
  DEBUG: 3,
  ERROR: 0,
  INFO: 2,
  TRACE: 4,
  WARN: 1,
} as const;

export type LogLevel = (typeof logLevelValues)[keyof typeof logLevelValues];

export const LogLevel = {
  ...logLevelValues,
  [logLevelValues.ERROR]: "ERROR",
  [logLevelValues.WARN]: "WARN",
  [logLevelValues.INFO]: "INFO",
  [logLevelValues.DEBUG]: "DEBUG",
  [logLevelValues.TRACE]: "TRACE",
} as const;

export interface LogContext {
  action?: string;
  component?: string;
  requestId?: string;
  sessionId?: string;
  tenantId?: string;
  userId?: string | number;
  [key: string]: any;
}

export interface LogEntry {
  context: LogContext;
  data?: any;
  error?: Error;
  level: LogLevel;
  message: string;
  timestamp: string;
}

class Logger {
  private isEnabled: boolean;
  private logLevel: LogLevel;
  private prefix: string;
  private logger: any;
  private stringOutputEnabled: boolean;
  private isServer: boolean = typeof window === "undefined";
  private pino: any | null = null;

  constructor() {
    this.logger = BeautifyConsole.getInstance();

    // Only enable logging in development or when explicitly enabled
    this.isEnabled =
      isDev() ||
      env.NEXT_PUBLIC_ENABLE_LOGGING === "true" ||
      env.NEXT_PUBLIC_LOG_LEVEL !== undefined;

    // Set log level from environment or default to INFO in dev, ERROR in prod
    const envLogLevel = env.NEXT_PUBLIC_LOG_LEVEL;
    if (envLogLevel) {
      this.logLevel =
        logLevelValues[envLogLevel.toUpperCase() as keyof typeof logLevelValues] || LogLevel.INFO;
    } else {
      this.logLevel = isDev() ? LogLevel.INFO : LogLevel.ERROR;
    }

    // Enable string output for copying logs (default: enabled in development)
    // Respect explicit 'true'/'false' values; treat any other/undefined as fallback to dev default
    const envStringOutput = env.NEXT_PUBLIC_LOG_STRING_OUTPUT;
    if (envStringOutput === "true") {
      this.stringOutputEnabled = true;
    } else if (envStringOutput === "false") {
      this.stringOutputEnabled = false;
    } else {
      this.stringOutputEnabled = isDev();
    }

    this.prefix = env.NEXT_PUBLIC_LOG_PREFIX ? env.NEXT_PUBLIC_LOG_PREFIX : "🔍";

    // Initialize Pino on server to emit structured logs
    // Disabled to avoid thread-stream compatibility issues with Next.js/Turbopack
    // Use console logging instead
    if (this.isServer) {
      // this.initServerLogger().catch(() => {
      //   // Fallback to console logging if pino initialization fails
      //   this.pino = null
      // })
      this.pino = null; // Force console logging
    }
  }

  // Disabled - pino is no longer used to avoid thread-stream compatibility issues
  // private loadPino(): any {
  //   // Server-only module loading with webpack ignore
  //   if (typeof window === 'undefined') {
  //     try {
  //       // Use eval to prevent webpack from analyzing this import
  //       // eslint-disable-next-line no-eval
  //       // biome-ignore lint/security/noGlobalEval: Required to prevent webpack bundling server-only modules
  //       return eval('require')('pino')
  //     } catch (error) {
  //       throw new Error(
  //         `pino not available: ${error instanceof Error ? error.message : 'unknown error'}`
  //       )
  //     }
  //   }
  //   throw new Error('pino only available on server')
  // }

  // Disabled - pino is no longer used to avoid thread-stream compatibility issues
  // private async initServerLogger(): Promise<void> {
  //   try {
  //     // Load pino without webpack interference
  //     const pino = this.loadPino()
  //     let transport: any

  //     if (isDev()) {
  //       try {
  //         // Load pino-pretty with eval to prevent webpack bundling
  //         // eslint-disable-next-line no-eval
  //         // biome-ignore lint/security/noGlobalEval: Required to prevent webpack bundling server-only modules
  //         eval('require')('pino-pretty')
  //         transport = pino.transport({
  //           options: {
  //             colorize: true,
  //             singleLine: true,
  //             translateTime: 'SYS:yyyy-mm-dd HH:MM:ss.l o',
  //           },
  //           target: 'pino-pretty',
  //         })
  //       } catch {
  //         transport = undefined
  //       }
  //     }

  //     this.pino = pino({
  //       base: {
  //         env: isDev() ? 'development' : 'production',
  //         service: env.NEXT_PUBLIC_APP_NAME || 'mono-krypton',
  //       },
  //       level: env.NEXT_PUBLIC_LOG_LEVEL?.toLowerCase?.() || (isDev() ? 'info' : 'error'),
  //       redact: {
  //         paths: [
  //           'context.authorization',
  //           'context.cookie',
  //           'context.set-cookie',
  //           'context.*token*',
  //           'context.*jwt*',
  //           'context.*password*',
  //           'context.*secret*',
  //           'context.*api_key*',
  //           'context.*apikey*',
  //           'context.*x-api-key*',
  //           'data.*token*',
  //           'data.*password*',
  //           'data.*secret*',
  //         ],
  //         remove: true,
  //       },
  //       transport,
  //     })
  //   } catch {
  //     // Fallback to null if pino initialization fails
  //     this.pino = null
  //   }
  // }

  private shouldLog(level: LogLevel): boolean {
    return this.isEnabled && level <= this.logLevel;
  }

  private getCallerInfo(): { fn?: string; file?: string; line?: number; col?: number } {
    const err = new Error();
    const stack = err.stack?.split("\n") ?? [];
    // Skip the first lines: 'Error' and logger internals
    const frame = stack.find(
      (l) => !l.includes("src/shared/utils/client-logger.ts") && l.includes("at "),
    );
    if (!frame) return {};
    // Support both with/without function name
    const withFn = /at\s+(.*?)\s+\((.*):(\d+):(\d+)\)/;
    const withoutFn = /at\s+(.*):(\d+):(\d+)/;
    const m = frame.match(withFn) || frame.match(withoutFn);
    if (!m) return {};
    if (m.length === 5) {
      const [, fn, file, line, col] = m;
      const result: { fn?: string; file?: string; line?: number; col?: number } = {
        col: Number(col),
        line: Number(line),
      };
      if (fn) result.fn = fn;
      if (file) result.file = file;
      return result;
    }
    const [, file, line, col] = m;
    const result: { fn?: string; file?: string; line?: number; col?: number } = {
      col: Number(col),
      line: Number(line),
    };
    if (file) result.file = file;
    return result;
  }

  private formatMessage(level: LogLevel, message: string, context: LogContext): string {
    const levelEmoji = {
      [LogLevel.ERROR]: "❌",
      [LogLevel.WARN]: "⚠️",
      [LogLevel.INFO]: "ℹ️",
      [LogLevel.DEBUG]: "🔍",
      [LogLevel.TRACE]: "🔬",
    }[level];

    const contextStr = context.component ? `[${context.component}]` : "";
    const actionStr = context.action ? `[${context.action}]` : "";

    return `${this.prefix} ${levelEmoji} ${contextStr}${actionStr} ${message}`;
  }

  private createLogEntry(
    level: LogLevel,
    message: string,
    context: LogContext,
    data?: any,
    error?: Error,
  ): LogEntry {
    return {
      context,
      level,
      message,
      timestamp: new Date().toISOString(),
      ...(data !== undefined ? { data } : {}),
      ...(error ? { error } : {}),
    };
  }

  private buildLogSummary(formattedMessage: string, logEntry: LogEntry, data?: any, error?: Error) {
    const consolePayload = {
      context: logEntry.context,
      message: formattedMessage,
      source: this.getCallerInfo(),
      timestamp: logEntry.timestamp,
      ...(data && { data }),
      ...(error && { error: error.message, stack: error.stack }),
    };
    const sanitized = this.sanitize(consolePayload);
    return {
      src: sanitized.source?.file
        ? `${sanitized.source.file}:${sanitized.source.line}:${sanitized.source.col}`
        : undefined,
      title: formattedMessage,
      ts: sanitized.timestamp,
      ...sanitized.context,
      ...(sanitized.data ? { data: sanitized.data } : {}),
      ...(sanitized.error ? { error: sanitized.error } : {}),
      ...(sanitized.stack ? { stack: sanitized.stack } : {}),
    };
  }

  private writePino(level: LogLevel, payload: object) {
    switch (level) {
      case LogLevel.ERROR:
        this.pino.error(payload);
        break;
      case LogLevel.WARN:
        this.pino.warn(payload);
        break;
      case LogLevel.INFO:
        this.pino.info(payload);
        break;
      case LogLevel.DEBUG:
        this.pino.debug(payload);
        break;
      case LogLevel.TRACE:
        this.pino.trace(payload);
        break;
    }
  }

  private writeConsole(level: LogLevel, formattedMessage: string, summary: object) {
    const styles = {
      [LogLevel.ERROR]: { bgColor: ColorType.white, color: ColorType.red },
      [LogLevel.WARN]: { bgColor: ColorType.white, color: ColorType.yellow },
      [LogLevel.INFO]: { bgColor: ColorType.white, color: ColorType.blue },
      [LogLevel.DEBUG]: { bgColor: ColorType.purple, color: ColorType.green },
      [LogLevel.TRACE]: { bgColor: ColorType.purple, color: ColorType.yellow },
    } as const;
    const style = styles[level];
    if (!style) return;

    this.logger
      .setPadStartText({
        logType: LogType.info,
        style,
        title: formattedMessage,
      })
      .log(summary);
  }

  private writeStructured(level: LogLevel, formattedMessage: string, summary: object) {
    if (this.isServer && this.pino) {
      this.writePino(level, {
        level: LogLevel[level],
        msg: formattedMessage,
        ...summary,
      });
      return;
    }
    this.writeConsole(level, formattedMessage, summary);
  }

  private writeStringCopy(
    level: LogLevel,
    formattedMessage: string,
    logEntry: LogEntry,
    summary: object,
  ) {
    if (this.isServer || !this.stringOutputEnabled) return;

    const stringifiableLog = {
      data: logEntry,
      level: LogLevel[level],
      message: formattedMessage,
      raw: summary,
    };

    // biome-ignore lint/suspicious/noConsole: console is used for logging
    console.log(`📋 JSON [${LogLevel[level]}]:`, this.stringifyForCopy(stringifiableLog));
  }

  private log(
    level: LogLevel,
    message: string,
    context: LogContext = {},
    data?: any,
    error?: Error,
  ): void {
    if (!this.shouldLog(level)) return;

    const formattedMessage = this.formatMessage(level, message, context);
    const logEntry = this.createLogEntry(level, message, context, data, error);
    const summary = this.buildLogSummary(formattedMessage, logEntry, data, error);
    this.writeStructured(level, formattedMessage, summary);
    this.writeStringCopy(level, formattedMessage, logEntry, summary);

    if (!isDev() && level >= LogLevel.WARN) {
      this.sendToLogService(logEntry);
    }
  }

  // Convert rich values to compact serializable forms and redact sensitive fields
  private sanitize(value: any, depth = 0): any {
    if (value == null) return value;

    // TODO:
    if (depth > 10) return `${depth.toString().slice(0, 10)}...`;

    // URLSearchParams -> string
    if (typeof URLSearchParams !== "undefined" && value instanceof URLSearchParams) {
      return value.toString();
    }

    // Headers -> plain object with redaction
    if (typeof Headers !== "undefined" && value instanceof Headers) {
      const obj: Record<string, string> = {};
      value.forEach((v, k) => {
        obj[k] = this.shouldRedactKey(k) ? this.redact(v) : v;
      });
      return obj;
    }

    // Arrays
    if (Array.isArray(value)) return value.map((v) => this.sanitize(v, depth + 1));

    // Plain objects
    if (typeof value === "object") {
      const out: Record<string, any> = {};
      for (const [k, v] of Object.entries(value)) {
        out[k] = this.shouldRedactKey(k) ? this.redact(String(v)) : this.sanitize(v, depth + 1);
      }
      return out;
    }

    return value;
  }

  private shouldRedactKey(key: string): boolean {
    const k = key.toLowerCase();
    return (
      k === "authorization" ||
      k === "cookie" ||
      k === "set-cookie" ||
      k === "re-captcha" ||
      k.includes("token") ||
      k.includes("jwt")
    );
  }

  private redact(_value: string): string {
    return "[REDACTED]";
  }

  private stringifyForCopy(obj: any): string {
    try {
      return JSON.stringify(obj, null, 2);
    } catch (_e) {
      // Fallback for objects that can't be stringified
      try {
        return JSON.stringify(this.sanitize(obj), null, 2);
      } catch (_e2) {
        return "[Unserializable Object - Unable to Copy]";
      }
    }
  }

  private sendToLogService(_logEntry: LogEntry): void {
    // In production, send important logs to external service
    // This could be Sentry, LogRocket, or your own logging service
    // if (typeof window !== 'undefined' && 'gtag' in window) {
    //   // Send to Google Analytics as custom events
    //   ;(window as any).gtag('event', 'log_error', {
    //     error_message: logEntry.message,
    //     error_context: JSON.stringify(logEntry.context),
    //     error_level: LogLevel[logEntry.level],
    //   })
    // }
  }

  // Public API methods
  // New preferred signature: error(message, error?, context?, data?)
  // Backward compatible with: error(message, context?, data?, error?) and error(message, { error })
  error(message: string, errOrContext?: unknown, contextOrData?: any, dataMaybe?: any): void {
    let err: Error | undefined;
    let context: LogContext = {};
    let data: any;

    if (errOrContext instanceof Error) {
      // New signature
      err = errOrContext;
      context = (contextOrData as LogContext) || {};
      data = dataMaybe;
    } else if (dataMaybe instanceof Error) {
      // Old signature
      err = dataMaybe;
      context = (errOrContext as LogContext) || {};
      data = contextOrData;
    } else if (
      errOrContext &&
      typeof errOrContext === "object" &&
      "error" in (errOrContext as any)
    ) {
      // Called like error(message, { error, ...context })
      const obj = { ...(errOrContext as Record<string, any>) };
      const maybeErr = obj.error;
      obj.error = undefined;
      if (maybeErr instanceof Error) {
        err = maybeErr;
      } else if (typeof maybeErr === "string") {
        err = new Error(maybeErr);
      }
      context = obj as LogContext;
      data = contextOrData;
    } else {
      // No error provided
      context = (errOrContext as LogContext) || {};
      data = contextOrData;
    }

    this.log(LogLevel.ERROR, message, context, data, err);
  }

  warn(message: string, context: LogContext = {}, data?: any): void {
    this.log(LogLevel.WARN, message, context, data);
  }

  info(message: string, context: LogContext = {}, data?: any): void {
    this.log(LogLevel.INFO, message, context, data);
  }

  debug(message: string, context: LogContext = {}, data?: any): void {
    this.log(LogLevel.DEBUG, message, context, data);
  }

  trace(message: string, context: LogContext = {}, data?: any): void {
    this.log(LogLevel.TRACE, message, context, data);
  }

  // Step-by-step logging for complex flows
  step(stepNumber: number, stepName: string, context: LogContext = {}, data?: any): void {
    this.info(`Step ${stepNumber}: ${stepName}`, context, data);
  }

  // Performance logging
  time(label: string, context: LogContext = {}): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      // biome-ignore lint/suspicious/noConsole: console is used for logging
      console.time(`${this.prefix} ⏱️ ${context.component || "PERF"} ${label}`);
    }
  }

  timeEnd(label: string, context: LogContext = {}): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      // biome-ignore lint/suspicious/noConsole: console is used for logging
      console.timeEnd(`${this.prefix} ⏱️ ${context.component || "PERF"} ${label}`);
    }
  }

  // Group logging for related operations
  group(label: string, context: LogContext = {}): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      // biome-ignore lint/suspicious/noConsole: console is used for logging
      console.group(`${this.prefix} 📁 ${context.component || "GROUP"} ${label}`);
    }
  }

  groupEnd(): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      // biome-ignore lint/suspicious/noConsole: console is used for logging
      console.groupEnd();
    }
  }

  // Control string output for copying logs
  enableStringOutput(): void {
    this.stringOutputEnabled = true;
    this.info("String output enabled - logs will include copyable JSON", {
      action: "enableStringOutput",
    });
  }

  disableStringOutput(): void {
    this.stringOutputEnabled = false;
    this.info("String output disabled", { action: "disableStringOutput" });
  }

  isStringOutputEnabled(): boolean {
    return this.stringOutputEnabled;
  }
}

type LogData = Record<string, any>;
// Convenience functions for common patterns
export const createComponentLogger = (componentName: string) => ({
  debug: (message: string, data?: LogData, context: LogContext = {}) =>
    logger.debug(message, { component: componentName, ...context }, data),
  disableStringOutput: () => logger.disableStringOutput(),

  // String output control
  enableStringOutput: () => logger.enableStringOutput(),
  // Preferred: error(message, error?, context?, data?)
  error: (
    message: string,
    error?: Error | any | LogData,
    context: LogContext = {},
    data?: LogData,
  ) => logger.error(message, error as any, { component: componentName, ...context }, data),

  group: (label: string) => logger.group(label, { component: componentName }),

  groupEnd: () => logger.groupEnd(),

  info: (message: string, data: LogData = {}, context: LogContext = {}) =>
    logger.info(message, { component: componentName, ...context }, data),
  isStringOutputEnabled: () => logger.isStringOutputEnabled(),

  step: (stepNumber: number, stepName: string, data?: LogData, context: LogContext = {}) =>
    logger.step(stepNumber, stepName, { component: componentName, ...context }, data),

  time: (label: string) => logger.time(label, { component: componentName }),

  timeEnd: (label: string) => logger.timeEnd(label, { component: componentName }),

  trace: (message: string, data?: LogData, context: LogContext = {}) =>
    logger.trace(message, { component: componentName, ...context }, data),

  warn: (message: string, data: LogData = {}, context: LogContext = {}) =>
    logger.warn(message, { component: componentName, ...context }, data),
});

// Hook for React components
export const useLogger = (componentName: string) => {
  return createComponentLogger(componentName);
};

// Create a callable logger that also exposes base logging methods (client variant)
type LoggerAPI = {
  error: (message: string, errOrContext?: unknown, contextOrData?: any, dataMaybe?: any) => void;
  warn: (message: string, context?: LogContext, data?: any) => void;
  info: (message: string, context?: LogContext, data?: any) => void;
  debug: (message: string, context?: LogContext, data?: any) => void;
  trace: (message: string, context?: LogContext, data?: any) => void;
  step: (stepNumber: number, stepName: string, context?: LogContext, data?: any) => void;
  time: (label: string, context?: LogContext) => void;
  timeEnd: (label: string, context?: LogContext) => void;
  group: (label: string, context?: LogContext) => void;
  groupEnd: () => void;
  enableStringOutput: () => void;
  disableStringOutput: () => void;
  isStringOutputEnabled: () => boolean;
};

export type ComponentLogger = ReturnType<typeof createComponentLogger>;
export type LoggerCallable = ((componentName: string) => ComponentLogger) & LoggerAPI;

const baseLogger = new Logger();

const loggerCallable = ((componentName: string) =>
  createComponentLogger(componentName)) as unknown as LoggerCallable;

// Bind base methods onto callable
loggerCallable.error = baseLogger.error.bind(baseLogger);
loggerCallable.warn = baseLogger.warn.bind(baseLogger);
loggerCallable.info = baseLogger.info.bind(baseLogger);
loggerCallable.debug = baseLogger.debug.bind(baseLogger);
loggerCallable.trace = baseLogger.trace.bind(baseLogger);
loggerCallable.step = baseLogger.step.bind(baseLogger);
loggerCallable.time = baseLogger.time.bind(baseLogger);
loggerCallable.timeEnd = baseLogger.timeEnd.bind(baseLogger);
loggerCallable.group = baseLogger.group.bind(baseLogger);
loggerCallable.groupEnd = baseLogger.groupEnd.bind(baseLogger);
loggerCallable.enableStringOutput = baseLogger.enableStringOutput.bind(baseLogger);
loggerCallable.disableStringOutput = baseLogger.disableStringOutput.bind(baseLogger);
loggerCallable.isStringOutputEnabled = baseLogger.isStringOutputEnabled.bind(baseLogger);

// Create singleton instance (callable)
export const logger = loggerCallable;

type JsonScan = {
  braceCount: number;
  finished: boolean;
  jsonStr: string;
  started: boolean;
};

function scanJsonLine(jsonLine: string, state: JsonScan) {
  for (const char of jsonLine) {
    if (char === "{") {
      state.braceCount += 1;
      state.started = true;
    } else if (char === "}") {
      state.braceCount -= 1;
    }
    if (state.started) {
      state.jsonStr += char;
    }
    if (state.started && state.braceCount === 0) {
      state.finished = true;
      return;
    }
  }
}

function readFirstJsonValue(
  lines: string[],
  startIndex: number,
): { ok: true; value: unknown } | null {
  const state: JsonScan = { braceCount: 0, finished: false, jsonStr: "", started: false };
  for (let index = startIndex; index < lines.length; index += 1) {
    scanJsonLine(lines[index] ?? "", state);
    if (!state.finished) continue;
    try {
      return { ok: true, value: JSON.parse(state.jsonStr) };
    } catch {
      return null;
    }
  }
  return null;
}

// Utility functions for working with stringified logs
export const logUtils = {
  /**
   * Save current session logs to downloadable file (client-side only)
   */
  downloadSessionLogs: (filename = "session-logs.json") => {
    if (typeof window === "undefined") {
      // biome-ignore lint/suspicious/noConsole: intentional console warn for browser-only function
      console.warn("downloadSessionLogs can only be used in browser environment");
      return;
    }

    // Create a simple log collector (this is just an example)
    const sessionLogs = {
      instructions: [
        "1. Open browser console",
        "2. Look for logs with 📋 JSON prefix",
        "3. Copy the JSON data from those logs",
        "4. Use logUtils.extractJsonFromConsoleOutput() to parse them",
      ],
      note: "Copy console output and use logUtils.extractJsonFromConsoleOutput() to parse logs",
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
    };

    const blob = new Blob([JSON.stringify(sessionLogs, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);

    logger.info("Session log template downloaded", {
      action: "downloadSessionLogs",
      filename,
    });
  },
  /**
   * Extract JSON logs from console output text
   * Useful when you've copied console output and want to extract the JSON parts
   */
  extractJsonFromConsoleOutput: (consoleText: string): any[] => {
    const jsonLogs: any[] = [];
    const lines = consoleText.split("\n");

    for (let index = 0; index < lines.length; index += 1) {
      const line = lines[index]?.trim();
      if (!line?.startsWith("📋 JSON [")) continue;
      const parsed = readFirstJsonValue(lines, index + 1);
      if (parsed) jsonLogs.push(parsed.value);
    }

    return jsonLogs;
  },

  /**
   * Format logs for external tools (like log analyzers)
   */
  formatForExternalTool: (logs: any[]): string => {
    return logs.map((log) => JSON.stringify(log)).join("\n");
  },
};
