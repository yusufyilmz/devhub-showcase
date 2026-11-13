import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { renderHbs } from "../catalog/render-hbs.ts";
import { logInfo } from "../shared/logger/log.ts";

const NAME_PATTERN = /^[a-z0-9][a-z0-9-]*$/;
const templates = fileURLToPath(new URL("./templates/", import.meta.url));

function render(name: string, description: string): Record<string, string> {
  const skill = renderHbs(fs.readFileSync(path.join(templates, "skill.md.hbs"), "utf8"), {
    description,
    name,
  });
  return {
    "references/overview.md": renderHbs(
      fs.readFileSync(path.join(templates, "reference.md.hbs"), "utf8"),
      { name },
    ),
    "SKILL.md": `---\nname: ${name}\ndescription: ${JSON.stringify(description)}\n---\n\n${skill}`,
    "workflows/overview.md": renderHbs(
      fs.readFileSync(path.join(templates, "workflow.md.hbs"), "utf8"),
      { name },
    ),
  };
}

/** Create a draft skill under `.agents/skills`. Existing directories are left unchanged. */
export function scaffoldSkill(
  rootDir: string,
  name: string,
  description?: string,
  dryRun = false,
): number {
  if (!NAME_PATTERN.test(name))
    throw new Error(`Invalid skill name '${name}'. Use lowercase kebab-case.`);
  const root = fs.realpathSync(rootDir);
  const skillDir = path.join(root, ".agents", "skills", name);
  if (fs.existsSync(skillDir)) {
    logInfo(`Skill already exists: ${path.relative(root, skillDir)}`);
    return 1;
  }
  const files = render(name, description?.trim() || `${name} workflow and reference notes.`);
  for (const [file, content] of Object.entries(files)) {
    const target = path.join(skillDir, file);
    logInfo(`${dryRun ? "Would write" : "Wrote"} ${path.relative(root, target)}`);
    if (dryRun) continue;
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, content.endsWith("\n") ? content : `${content}\n`);
  }
  return 0;
}
