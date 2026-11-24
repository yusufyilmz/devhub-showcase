import { spawnSync } from "node:child_process";
import { readdirSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { createConsoleUI } from "../shared/logger/console-ui.ts";

const groups = ["apps", "packages", "tools"] as const;

export function workspacePackageDirs(root: string): string[] {
  const directories: string[] = [];
  for (const group of groups) {
    let names: string[] = [];
    try {
      names = readdirSync(join(root, group));
    } catch {
      continue;
    }
    for (const name of names.toSorted()) {
      const directory = join(root, group, name);
      try {
        if (statSync(join(directory, "package.json")).isFile()) directories.push(directory);
      } catch {
        // A group can contain files that are not workspace packages.
      }
    }
  }
  return directories;
}

/** A clean depcheck report is a success line. Anything else is the finding list. */
export function formatDepcheckOutput(output: string): { lines: string[]; ok: boolean } {
  const text = output.trim();
  if (text === "" || text === "No depcheck issue") return { lines: [], ok: true };
  return { lines: text.split(/\r?\n/).filter((line) => line !== ""), ok: false };
}

export function runDepcheckWorkspaces(input: {
  root: string;
  run: (directory: string, config: string) => number;
}): number {
  const config = join(input.root, ".depcheckrc");
  let status = 0;
  for (const directory of workspacePackageDirs(input.root)) {
    const code = input.run(directory, config);
    if (code !== 0) status = code || 1;
  }
  return status;
}

function main(): void {
  const root = fileURLToPath(new URL("../../../", import.meta.url));
  const log = createConsoleUI("depcheck");
  const code = runDepcheckWorkspaces({
    root,
    run: (directory, config) => {
      const name = relative(root, directory);
      log.start(name);
      const result = spawnSync("pnpm", ["exec", "depcheck", directory, "--config", config], {
        cwd: root,
        encoding: "utf8",
        stdio: ["inherit", "pipe", "pipe"],
      });
      const code = result.status ?? 1;
      const report = formatDepcheckOutput(result.stdout ?? "");
      const errors = (result.stderr ?? "").trim();
      if (code === 0 && report.ok) log.success(`${name} passed`);
      else {
        if (report.lines.length > 0) log.details(report.lines);
        if (errors) log.details(errors.split(/\r?\n/));
        log.error(`${name} failed with exit ${code}`);
      }
      if (result.error) log.error(result.error.message);
      return code;
    },
  });
  if (code === 0) log.success("All workspace packages passed depcheck.");
  process.exitCode = code;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
