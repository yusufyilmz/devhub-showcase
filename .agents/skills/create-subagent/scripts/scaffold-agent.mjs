#!/usr/bin/env node
// Create a scoped Claude Code project subagent without overwriting existing files.
import fs from "node:fs";
import path from "node:path";

const [name, ...arguments_] = process.argv.slice(2);

function option(flag) {
  const index = arguments_.indexOf(flag);
  return index === -1 ? "" : (arguments_[index + 1] ?? "");
}
function fail(message) {
  throw new Error(message);
}
function oneLine(value, title, max) {
  if (!value || value.trim().length < 8 || value.length > max || /[\r\n]/.test(value)) {
    fail(title + " must be a single nonempty sentence, 8-" + max + " characters.");
  }
  return value.trim();
}

if (!name || !/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(name) || name.length > 64) {
  fail("Agent name must be lower-case kebab-case, at most 64 characters.");
}
const description = oneLine(option("--description"), "Description", 350);
const mission = oneLine(option("--mission"), "Mission", 500);
const scope = option("--scope").trim();
const mode = option("--mode") || "review";
if (!["review", "implementation"].includes(mode)) {
  fail("Mode must be review or implementation.");
}
if (
  !scope ||
  scope.startsWith("-") ||
  scope.includes("\\") ||
  path.isAbsolute(scope) ||
  scope.split("/").includes("..") ||
  scope.split("/").includes("") ||
  scope.length > 200
) {
  fail("Scope must be a nonempty, repository-relative path without traversal.");
}

const root = fs.realpathSync(process.cwd());
const directory = path.join(root, ".claude", "agents");
fs.mkdirSync(directory, { recursive: true });
const target = path.join(directory, name + ".md");
const tools = mode === "review" ? "Read, Grep, Glob" : "Read, Grep, Glob, Edit, Write, Bash";

const content = [
  "---",
  "name: " + name,
  "description: " + JSON.stringify(description),
  "tools: " + tools,
  "model: inherit",
  "---",
  "",
  "# " + name,
  "",
  "**Mission:** " + mission,
  "",
  "**Scope:** " + scope,
  "",
  "## Working agreement",
  "",
  "1. Read AGENTS.md, the relevant repository skill and exact files in scope.",
  "2. Stay within the requested mission and existing package boundaries.",
  mode === "review"
    ? "3. Read source and report evidence. Do not modify files or claim to have run shell checks."
    : "3. Make only authorized scoped changes. Write focused tests, run relevant checks, and preserve unrelated work.",
  "4. Never expose credentials, modify production data, merge, deploy or change ownership without explicit authorization.",
  "5. Stop and report a blocker rather than guessing about an unavailable command, dependency or environment.",
  "",
  "## Handoff",
  "",
  "Return a concise summary, inspected or changed paths, evidence with actual commands/results,",
  "risks or findings, incomplete checks, and the recommended next action.",
  "Do not claim a task is done merely because code exists.",
  "",
].join("\n");

try {
  fs.writeFileSync(target, content, { encoding: "utf8", flag: "wx" });
} catch (error) {
  if (error && error.code === "EEXIST") fail("Subagent already exists: " + path.relative(root, target));
  throw error;
}
console.log("Created " + path.relative(root, target) + " (" + mode + ").");
