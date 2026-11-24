import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { parseArgs } from "node:util";

/** Verification scripts, cheapest local checks first. `check` repeats these; `check:fix` rewrites files. */
export const CHECK_ALL_STEPS = [
  "check:lint",
  "check:format",
  "check:assist",
  "check:catalogs",
  "check:exports",
  "check:packages",
  "check:ui-catalog",
  "check:docs",
  "check:links",
  "check:skills",
  "check:architecture",
  "check:circular",
  "check:complexity",
  "check:duplicates",
  "check:depcheck",
  "check:depcheck:workspaces",
  "check:unused:deps",
  "check:unused:files",
  "check:secrets",
  "check:security",
  "check:security:prod",
  "check:outdated",
  "check:types",
  "check:unit",
  "check:coverage",
  "check:build",
] as const;

export type CheckAllCache = {
  next: string;
  steps: string[];
  version: 1;
};

type CheckAllLog = {
  error: (message: string) => void;
  info: (message: string) => void;
  start: (message: string) => void;
  success: (message: string) => void;
};

type RunCheckAllInput = {
  cache: CheckAllCache | null;
  fresh: boolean;
  log?: CheckAllLog;
  onCache: (cache: CheckAllCache | null) => void;
  run: (script: string) => number;
  steps: readonly string[];
};

export function checkAllFresh(argv: readonly string[]): boolean {
  const { values } = parseArgs({
    args: argv.filter((arg) => arg !== "--"),
    options: { fresh: { default: false, type: "boolean" } },
    strict: true,
  });
  return values.fresh === true;
}

export function readCheckAllCache(file: string): CheckAllCache | null {
  try {
    const parsed: unknown = JSON.parse(readFileSync(file, "utf8"));
    return isCheckAllCache(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function writeCheckAllCache(file: string, cache: CheckAllCache | null): void {
  if (!cache) {
    rmSync(file, { force: true });
    return;
  }
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, `${JSON.stringify(cache, null, 2)}\n`);
}

export function runCheckAll(input: RunCheckAllInput): number {
  const start = input.fresh ? 0 : resumeIndex(input.cache, input.steps);
  const total = input.steps.length;
  if (start > 0) {
    const cached = start === 1 ? "1 earlier step" : `${start} earlier steps`;
    input.log?.info(`Resuming at ${input.steps[start]}. ${cached} cached.`);
  }

  for (let index = start; index < total; index += 1) {
    const script = input.steps[index] ?? "";
    input.log?.start(`${index + 1}/${total} ${script}`);
    const code = input.run(script);
    const next = input.steps[index + 1];
    if (code !== 0) {
      input.onCache({ next: script, steps: [...input.steps], version: 1 });
      input.log?.error(`${script} failed with exit ${code}. Next pnpm check:all continues here.`);
      return code;
    }
    input.log?.success(`${script} passed`);
    input.onCache(next ? { next, steps: [...input.steps], version: 1 } : null);
  }

  input.log?.success(`All ${total} checks passed.`);
  return 0;
}

function resumeIndex(cache: CheckAllCache | null, steps: readonly string[]): number {
  if (!cache) return 0;
  if (
    cache.steps.length !== steps.length ||
    cache.steps.some((step, index) => step !== steps[index])
  ) {
    return 0;
  }
  return Math.max(steps.indexOf(cache.next), 0);
}

function isCheckAllCache(value: unknown): value is CheckAllCache {
  if (!value || typeof value !== "object") return false;
  const cache = value as Record<string, unknown>;
  return (
    cache.version === 1 &&
    typeof cache.next === "string" &&
    Array.isArray(cache.steps) &&
    cache.steps.every((step) => typeof step === "string")
  );
}
