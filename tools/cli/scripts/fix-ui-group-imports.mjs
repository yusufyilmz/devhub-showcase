import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const uiSrc = path.join(root, "packages/ui/src");

const GROUPS = {
  buttons: [
    "icon-button",
    "toggle",
    "toggle-button",
    "toggle-group",
    "switch",
    "segmented-control",
    "button",
    "buttons",
    "action-button",
  ],
  cards: ["HoverCard"],
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
    folderToGroup.set(folder, group);
  }
}

const importPattern = /from (["'])(\.\.\/)([a-z0-9-]+)((?:\/[^"']*)?)\1/g;

function fileGroup(filePath) {
  const relative = path.relative(uiSrc, filePath);
  const top = relative.split(path.sep)[0];
  if (folderToGroup.has(top) || Object.hasOwn(GROUPS, top)) return top;
  return null;
}

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(full);
      continue;
    }
    if (!/\.(ts|tsx)$/.test(entry.name)) continue;

    const sourceGroup = fileGroup(full);
    if (!sourceGroup) continue;

    const text = await readFile(full, "utf8");
    const updated = text.replace(importPattern, (match, quote, dotdot, folder, rest) => {
      const targetGroup = folderToGroup.get(folder);
      if (!targetGroup || targetGroup === sourceGroup) {
        return match;
      }
      return `from ${quote}../../${targetGroup}/${folder}${rest}${quote}`;
    });

    if (updated !== text) {
      await writeFile(full, updated);
    }
  }
}

await walk(uiSrc);
console.log("Fixed cross-group relative imports in packages/ui/src.");
