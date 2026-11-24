import { glob, readFile, writeFile } from "node:fs/promises";

import YAML from "yaml";

import { createConsoleUI } from "../shared/logger/console-ui.ts";

const log = createConsoleUI("skills");

const fix = process.argv.includes("--fix");
let errors = 0;

// Node's glob does not enter dot directories for "**", so name the skill roots.
const skillFiles = glob([".agents/skills/**/SKILL.md", ".cursor/skills/**/SKILL.md"]);

for await (const file of skillFiles) {
  const content = await readFile(file, "utf8");

  if (!content.startsWith("---\n")) {
    log.error(`Missing YAML frontmatter: ${file}`);
    errors++;
    continue;
  }

  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);

  if (!match) {
    log.error(`Invalid frontmatter: ${file}`);
    errors++;
    continue;
  }

  const document = YAML.parseDocument(match[1]);

  if (document.errors.length) {
    log.error(
      `${file}: ${document.errors.map((error) => error.message ?? String(error)).join("; ")}`,
    );
    errors++;
    continue;
  }

  const metadata = document.toJS();

  if (!metadata?.name || !metadata?.description) {
    log.error(`Missing name or description: ${file}`);
    errors++;
    continue;
  }

  if (fix) {
    const formatted = document.toString().trimEnd();
    const updated = content.replace(match[0], `---\n${formatted}\n---\n`);

    if (updated !== content) {
      await writeFile(file, updated);
    }
  }

  log.success(file);
}

process.exitCode = errors ? 1 : 0;
