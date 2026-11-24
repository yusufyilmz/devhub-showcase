import fs from "node:fs";
import path from "node:path";

import { createConsoleUI } from "../shared/logger/console-ui.ts";

const skipped = new Set([
  "node_modules",
  ".git",
  "dist",
  "build",
  "coverage",
  ".next",
  "storybook-static",
]);
const patterns = [
  /BEGIN (?:RSA |OPENSSH )?PRIVATE KEY/,
  /sk_live_[0-9A-Za-z]+/,
  /AKIA[0-9A-Z]{16}/,
];

function walk(dir: string, files: string[]): void {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (skipped.has(entry.name)) continue;
    const target = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(target, files);
    else if (entry.isFile() && entry.name !== "secrets.ts") files.push(target);
  }
}

const log = createConsoleUI("secrets");
const root = path.resolve(process.argv[2] ?? process.cwd());
const files: string[] = [];
walk(root, files);
let found = 0;
for (const file of files) {
  let text = "";
  try {
    text = fs.readFileSync(file, "utf8");
  } catch {
    continue;
  }
  if (!patterns.some((pattern) => pattern.test(text))) continue;
  found += 1;
  log.error(`Possible secret: ${path.relative(root, file)}`);
}
if (found > 0) process.exitCode = 1;
else log.success("No obvious secrets found.");
