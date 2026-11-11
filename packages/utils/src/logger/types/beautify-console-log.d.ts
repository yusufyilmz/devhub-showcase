/** biome-ignore-all lint/suspicious/noExplicitAny:tools */
declare module "beautify-console-log/lib/beautify-console" {
  export class BeautifyConsole {
    static getInstance(): BeautifyConsole;
    success(message: string, color?: any): void;
    info(message: string, color?: any): void;
    warn(message: string, color?: any): void;
    error(message: string, color?: any): void;
    log(message: string, color?: any): void;
    group(label: string): void;
    groupEnd(): void;
  }
}

declare module "beautify-console-log/lib/beautify-console/model" {
  export enum LogType {
    SUCCESS,
    INFO,
    WARN,
    ERROR,
  }
  export enum ColorType {
    Green,
    Blue,
    Yellow,
    Red,
    White,
    Cyan,
    Magenta,
    Gray,
  }
}
