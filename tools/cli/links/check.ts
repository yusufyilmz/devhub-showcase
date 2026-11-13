import fs from "node:fs";
import path from "node:path";

import { logError, logInfo } from "../shared/logger/log.ts";
import { defaultDocPaths, discoverDocs } from "./discover.ts";
import {
  applyLinkFixPlan,
  buildLinkFixPlan,
  fingerprintLinkFixPlan,
  type LinkFixPlan,
} from "./link-fixes.ts";
import { type DocIssue, extractLinks, validateLocalLinks } from "./markdown-links.ts";

export interface CheckLinksOptions {
  dryRun?: boolean;
  external?: boolean;
  fix?: boolean;
  paths?: string[];
  root?: string;
}

function httpLinks(files: string[]): Map<string, { file: string; line: number; url: string }> {
  const found = new Map<string, { file: string; line: number; url: string }>();
  for (const file of files) {
    const content = fs.readFileSync(file, "utf8");
    for (const link of extractLinks(content)) {
      if (!/^https?:\/\//i.test(link.url) || found.has(link.url)) continue;
      found.set(link.url, {
        file,
        line: content.slice(0, link.index).split("\n").length,
        url: link.url,
      });
    }
  }
  return found;
}

async function checkUrl(url: string): Promise<string | undefined> {
  try {
    const response = await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: AbortSignal.timeout(15_000),
    });
    if (response.ok) return undefined;
    return `HTTP ${response.status}`;
  } catch (error) {
    return error instanceof Error ? error.message : String(error);
  }
}

/** Check local Markdown links, and http(s) links when external checking is on. */
export async function checkLinks(options: CheckLinksOptions = {}): Promise<DocIssue[]> {
  const root = options.root ?? process.cwd();
  const inputs = options.paths?.length ? options.paths : defaultDocPaths(root);
  if (inputs.length === 0) return [];
  const files = discoverDocs(root, inputs);
  const issues = validateLocalLinks(files, root);
  if (options.external === false) return issues;

  const external = [...httpLinks(files).values()];
  const issuesWithNetwork = [...issues];
  let cursor = 0;
  async function next(): Promise<void> {
    const link = external[cursor];
    cursor += 1;
    if (!link) return;
    const message = await checkUrl(link.url);
    if (message) {
      issuesWithNetwork.push({
        file: path.relative(root, link.file).split(path.sep).join("/"),
        line: link.line,
        message: `${link.url}: ${message}`,
        rule: "external-link",
        severity: "error",
        url: link.url,
      });
    }
    await next();
  }
  await Promise.all(Array.from({ length: Math.min(8, external.length) }, () => next()));
  return issuesWithNetwork;
}

export async function reportLinks(options: CheckLinksOptions = {}): Promise<number> {
  if (options.dryRun && !options.fix) throw new Error("--dry-run requires --fix");
  const root = options.root ?? process.cwd();
  if (options.fix) applyFixes(root, options);
  const issues = await checkLinks(options);
  if (issues.length === 0) {
    logInfo("No broken Markdown links.");
    return 0;
  }
  logError(`Found ${issues.length} broken link(s):`);
  for (const issue of issues) {
    logError(`${issue.file}:${issue.line ?? 1}: ${issue.message}`);
  }
  return 1;
}

function selectedFiles(root: string, paths: string[] | undefined): string[] {
  const inputs = paths?.length ? paths : defaultDocPaths(root);
  if (inputs.length === 0) return [];
  return discoverDocs(root, inputs);
}

function logFixPlan(plan: LinkFixPlan, applied: boolean, backup?: string): void {
  for (const change of plan.changes) {
    for (const link of change.links)
      logInfo(`${change.file}:${link.line}: ${link.from} → ${link.to}`);
  }
  for (const skipped of plan.skipped) logInfo(`Skipped ${skipped}`);
  if (plan.changes.length === 0) return;
  if (!applied) {
    logInfo(`Would update ${plan.changes.length} file(s).`);
    return;
  }
  logInfo(`Updated ${plan.changes.length} file(s).${backup ? ` Backup: ${backup}` : ""}`);
}

function applyFixes(root: string, options: CheckLinksOptions): void {
  const files = selectedFiles(root, options.paths);
  const searchable = discoverDocs(root, ["."]);
  const plan = buildLinkFixPlan(files, root, searchable);
  if (options.dryRun || plan.changes.length === 0) {
    logFixPlan(plan, false);
    return;
  }
  const preview = fingerprintLinkFixPlan(plan);
  if (fingerprintLinkFixPlan(buildLinkFixPlan(files, root, searchable)) !== preview) {
    throw new Error("Links changed since preview; run --fix --dry-run again");
  }
  logFixPlan(plan, true, applyLinkFixPlan(plan));
}
