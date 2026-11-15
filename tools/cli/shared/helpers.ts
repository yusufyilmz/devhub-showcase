import path from "node:path";

export function formatError(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

export function displayPath(filePath: string): string {
  return path.relative(process.cwd(), filePath) || filePath;
}

export function setFailure() {
  process.exitCode = 1;
}
