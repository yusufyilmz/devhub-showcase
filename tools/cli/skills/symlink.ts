import fs from "node:fs";
import path from "node:path";

import { logInfo } from "../shared/logger/log.ts";

const EDITORS = [".cursor", ".claude"] as const;

function ensureLink(linkPath: string, linkTarget: string, dryRun: boolean): "created" | "skipped" {
  const existing = fs.lstatSync(linkPath, { throwIfNoEntry: false });
  if (existing) {
    if (existing.isSymbolicLink() && fs.readlinkSync(linkPath) === linkTarget) return "skipped";
    logInfo(`Preserving existing path: ${linkPath}`);
    return "skipped";
  }
  if (dryRun) {
    logInfo(`Would link ${linkPath} -> ${linkTarget}`);
    return "created";
  }
  fs.mkdirSync(path.dirname(linkPath), { recursive: true });
  fs.symlinkSync(linkTarget, linkPath);
  logInfo(`Linked ${linkPath} -> ${linkTarget}`);
  return "created";
}

/** Point editor skill folders at the canonical `.agents/skills` directory. */
export function symlinkSkills(rootDir: string, dryRun = false): number {
  const root = fs.realpathSync(rootDir);
  const source = path.join(root, ".agents", "skills");
  if (!fs.existsSync(source)) throw new Error(`Missing skill source: ${source}`);
  let created = 0;
  for (const editor of EDITORS) {
    const linkPath = path.join(root, editor, "skills");
    const linkTarget = path.relative(path.dirname(linkPath), source);
    if (ensureLink(linkPath, linkTarget, dryRun) === "created") created += 1;
  }
  logInfo(`${dryRun ? "Would create" : "Created"} ${created} skill symlink(s).`);
  return 0;
}
