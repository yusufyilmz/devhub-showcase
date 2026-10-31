import { glob, readFile, writeFile } from "node:fs/promises";

import YAML from "yaml";

const fix = process.argv.includes("--fix");
let errors = 0;

for await (const file of glob("**/SKILL.md", {
  exclude: (path) => path.includes("node_modules") || path.includes(".next"),
})) {
  const content = await readFile(file, "utf8");

  if (!content.startsWith("---\n")) {
    console.error(`Missing YAML frontmatter: ${file}`);
    errors++;
    continue;
  }

  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);

  if (!match) {
    console.error(`Invalid frontmatter: ${file}`);
    errors++;
    continue;
  }

  const document = YAML.parseDocument(match[1]);

  if (document.errors.length) {
    console.error(`${file}:`, document.errors);
    errors++;
    continue;
  }

  const metadata = document.toJS();

  if (!metadata?.name || !metadata?.description) {
    console.error(`Missing name or description: ${file}`);
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

  console.log(`✓ ${file}`);
}

process.exitCode = errors ? 1 : 0;
