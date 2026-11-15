export type LogLevel = 0 | 1 | 2 | 3 | 4;
export declare const LogLevel: {
  readonly ERROR: 0;
  readonly WARN: 1;
  readonly INFO: 2;
  readonly DEBUG: 3;
  readonly TRACE: 4;
  readonly 0: "ERROR";
  readonly 1: "WARN";
  readonly 2: "INFO";
  readonly 3: "DEBUG";
  readonly 4: "TRACE";
};
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
type LogData = Record<string, any>;
export declare const createComponentLogger: (componentName: string) => {
  debug: (message: string, data?: LogData, context?: LogContext) => void;
  disableStringOutput: () => void;
  enableStringOutput: () => void;
  error: (
    message: string,
    error?: Error | any | LogData,
    context?: LogContext,
    data?: LogData,
  ) => void;
  group: (label: string) => void;
  groupEnd: () => void;
  info: (message: string, data?: LogData, context?: LogContext) => void;
  isStringOutputEnabled: () => boolean;
  step: (stepNumber: number, stepName: string, data?: LogData, context?: LogContext) => void;
  time: (label: string) => void;
  timeEnd: (label: string) => void;
  trace: (message: string, data?: LogData, context?: LogContext) => void;
  warn: (message: string, data?: LogData, context?: LogContext) => void;
};
export declare const useLogger: (componentName: string) => {
  debug: (message: string, data?: LogData, context?: LogContext) => void;
  disableStringOutput: () => void;
  enableStringOutput: () => void;
  error: (
    message: string,
    error?: Error | any | LogData,
    context?: LogContext,
    data?: LogData,
  ) => void;
  group: (label: string) => void;
  groupEnd: () => void;
  info: (message: string, data?: LogData, context?: LogContext) => void;
  isStringOutputEnabled: () => boolean;
  step: (stepNumber: number, stepName: string, data?: LogData, context?: LogContext) => void;
  time: (label: string) => void;
  timeEnd: (label: string) => void;
  trace: (message: string, data?: LogData, context?: LogContext) => void;
  warn: (message: string, data?: LogData, context?: LogContext) => void;
};
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
export declare const logger: LoggerCallable;
export declare const logUtils: {
  /**
   * Save current session logs to downloadable file (client-side only)
   */
  downloadSessionLogs: (filename?: string) => void;
  /**
   * Extract JSON logs from console output text
   * Useful when you've copied console output and want to extract the JSON parts
   */
  extractJsonFromConsoleOutput: (consoleText: string) => any[];
  /**
   * Format logs for external tools (like log analyzers)
   */
  formatForExternalTool: (logs: any[]) => string;
};
