/** biome-ignore-all lint/complexity/noExcessiveCognitiveComplexity: scripts */

import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const uiSrc = path.join(root, "packages/ui/src");
const coreDir = path.join(uiSrc, "core");

const GROUPS = {
  buttons: [
    "icon-button",
    "toggle",
    "toggle-button",
    "toggle-group",
    "switch",
    "segmented-control",
  ],
  content: [
    "typography",
    "code",
    "inline-code",
    "kbd",
    "list",
    "table",
    "data-table",
    "chart",
    "timeline",
    "avatar",
    "avatar-group",
    "logo-cloud",
    "carousel",
    "iframe-preview",
    "map",
    "chat",
    "icons",
  ],
  customizers: ["customizers", "theme-customizer", "mouse-circle"],
  feedback: [
    "alert",
    "alert-dialog",
    "badge",
    "banner",
    "chip",
    "tag",
    "toast",
    "sonner",
    "notification",
    "spinner",
    "skeleton",
    "progress",
    "status-indicator",
    "empty-state",
    "error-page",
    "feedback",
    "error-boundary",
    "not-found",
  ],
  forms: [
    "input",
    "textarea",
    "text-field",
    "label",
    "checkbox",
    "radio-button",
    "radio-group",
    "select",
    "slider",
    "calendar",
    "input-otp",
    "form",
    "contact-form",
    "login-form",
  ],
  layout: [
    "flex",
    "card",
    "section",
    "divider",
    "seperator",
    "aspect-ratio",
    "scrollable-container",
    "scroll-button",
    "scroll-to-top",
    "resizable",
    "accordion",
    "collapsible",
    "tabs",
    "background",
    "paper",
    "reveal-card",
  ],
  navigation: [
    "brand",
    "header",
    "navbar",
    "footer",
    "page-header",
    "sidebar",
    "app-sidebar",
    "breadcrumb",
    "pagination",
    "team-switcher",
    "site-header",
    "nav",
  ],
  overlays: [
    "dialog",
    "radix-dialog",
    "drawer",
    "sheet",
    "popover",
    "tooltip",
    "dropdown-menu",
    "context-menu",
    "menubar",
    "command",
    "navigation-menu",
  ],
};

const folderToGroup = new Map();
for (const [group, folders] of Object.entries(GROUPS)) {
  for (const folder of folders) {
    if (folderToGroup.has(folder)) {
      throw new Error(`Duplicate folder mapping: ${folder}`);
    }
    folderToGroup.set(folder, group);
  }
}

async function moveCoreFolders() {
  for (const group of new Set(folderToGroup.values())) {
    await mkdir(path.join(uiSrc, group), { recursive: true });
  }
  for (const [folder, group] of folderToGroup) {
    const from = path.join(coreDir, folder);
    const to = path.join(uiSrc, group, folder);
    try {
      await rename(from, to);
    } catch (error) {
      if (error && typeof error === "object" && error.code === "ENOENT" && error.path === from) {
        continue;
      }
      throw error;
    }
  }
}

function rewriteBarrel(source) {
  let next = source;
  for (const [folder, group] of folderToGroup) {
    next = next.replaceAll(`from "./${folder}`, `from "../${group}/${folder}`);
    next = next.replaceAll(`from "./${folder}/`, `from "../${group}/${folder}/`);
  }
  return next;
}

async function writeComponentsBarrel() {
  const coreIndex = await readFile(path.join(coreDir, "index.ts"), "utf8");
  const componentsDir = path.join(uiSrc, "components");
  await mkdir(componentsDir, { recursive: true });
  await writeFile(path.join(componentsDir, "index.ts"), rewriteBarrel(coreIndex));
}

async function updatePackageExports() {
  const pkgPath = path.join(root, "packages/ui/package.json");
  const pkg = JSON.parse(await readFile(pkgPath, "utf8"));
  const exportsField = { ...pkg.exports };

  exportsField["./components"] = "./src/components/index.ts";

  for (const [folder, group] of folderToGroup) {
    exportsField[`./${folder}`] = `./src/${group}/${folder}/index.ts`;
  }

  exportsField["./button"] = "./src/buttons/button/index.ts";
  exportsField["./buttons"] = "./src/buttons/buttons/index.ts";
  exportsField["./action-button"] = "./src/buttons/action-button/index.ts";
  exportsField["./hover-card"] = "./src/cards/HoverCard.tsx";
  exportsField["./reveal-card"] = "./src/layout/reveal-card/index.ts";

  delete exportsField["./*"];

  pkg.exports = exportsField;
  pkg.scripts["folders:kebab"] =
    "node ../../tools/cli/scripts/kebab-folders.mjs src/buttons src/forms src/feedback src/overlays src/layout src/navigation src/content src/customizers";

  await writeFile(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);
}

async function replaceImportsInTree(dir) {
  const { readdir } = await import("node:fs/promises");
  const entries = await readdir(dir, { recursive: true, withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isFile()) continue;
    if (!/\.(ts|tsx|md)$/.test(entry.name)) continue;
    const fullPath = path.join(entry.parentPath ?? entry.path, entry.name);
    let text = await readFile(fullPath, "utf8");
    let changed = false;

    for (const [folder, group] of folderToGroup) {
      const patterns = [
        [`../../core/${folder}`, `../../${group}/${folder}`],
        [`../core/${folder}`, `../${group}/${folder}`],
        [`./core/${folder}`, `./${group}/${folder}`],
        [`from "@shared/ui/core/${folder}`, `from "@shared/ui/${folder}`],
      ];
      for (const [from, to] of patterns) {
        if (text.includes(from)) {
          text = text.replaceAll(from, to);
          changed = true;
        }
      }
    }

    if (changed) {
      await writeFile(fullPath, text);
    }
  }
}

async function removeCoreIndex() {
  const { rm } = await import("node:fs/promises");
  await rm(path.join(coreDir, "index.ts"));
  const { readdir } = await import("node:fs/promises");
  const remaining = await readdir(coreDir);
  if (remaining.length > 0) {
    throw new Error(`core/ is not empty: ${remaining.join(", ")}`);
  }
  await rm(coreDir, { recursive: true });
}

await moveCoreFolders();
await writeComponentsBarrel();
await updatePackageExports();
await replaceImportsInTree(uiSrc);
await removeCoreIndex();

console.log("Regrouped ui core into catalog folders.");
