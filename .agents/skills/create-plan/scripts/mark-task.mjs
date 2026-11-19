#!/usr/bin/env node
// Mark one fully verified plan task and record concrete evidence.
// This tool records evidence supplied by the caller; it does not run checks.
import fs from "node:fs";
import path from "node:path";

function fail(message) {
  throw new Error(message);
}

const [fileArg, ...flags] = process.argv.slice(2);
function option(key) {
  const index = flags.indexOf(key);
  return index < 0 ? "" : (flags[index + 1] ?? "");
}
const taskId = option("--id");
const evidence = option("--evidence").trim();
if (!fileArg || !/^P\d+\.\d+$/.test(taskId) || !evidence) {
  fail(
    'Usage: mark-task.mjs .agents/plans/<plan>.md --id P1.1 --evidence "actual passing check or artifact"',
  );
}
if (evidence.length > 500 || /[\r\n|]/.test(evidence)) {
  fail("Evidence must be a single line of at most 500 characters without table separators.");
}

const root = fs.realpathSync(path.resolve(".agents/plans"));
const file = fs.realpathSync(path.resolve(fileArg));
if (!file.startsWith(root + path.sep) || !file.endsWith(".md")) {
  fail("Only Markdown plans inside .agents/plans may be modified.");
}

const original = fs.readFileSync(file, "utf8");
const unchecked = `- [ ] **${taskId}**`;
const checked = `- [x] **${taskId}**`;
const lines = original.split("\n");
const matches = lines.flatMap((line, index) =>
  line.startsWith(unchecked) || line.startsWith(checked) ? [index] : [],
);
if (matches.length !== 1) {
  fail(`Expected exactly one task with identifier ${taskId}; found ${matches.length}.`);
}
const index = matches[0];
const wasChecked = lines[index].startsWith(checked);
if (!wasChecked) lines[index] = `${checked}${lines[index].slice(unchecked.length)}`;

const evidenceHeader = "## Completion evidence";
const rowPrefix = `| ${taskId} |`;
const existingEvidence = lines.some((line) => line.startsWith(rowPrefix));
if (wasChecked && existingEvidence) {
  console.log(`${taskId} is already checked and has evidence; no changes.`);
  process.exit(0);
}
if (!lines.includes(evidenceHeader)) {
  if (lines.at(-1) === "") lines.pop();
  lines.push("", evidenceHeader, "", "| Task | Verified evidence |", "| --- | --- |");
}
if (!existingEvidence) {
  // Completion evidence is the final section of create-plan documents.
  while (lines.at(-1) === "") lines.pop();
  lines.push(`| ${taskId} | ${evidence} |`);
}
const next = lines.join("\n").replace(/\n*$/, "\n");
if (next !== original) fs.writeFileSync(file, next, "utf8");
console.log(`Marked ${taskId} completed and recorded evidence.`);
