import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const repoRoot = new URL("../../../", import.meta.url);

function exportAliases(folder: string, options: { cssOnly?: boolean; packageName?: string } = {}) {
  const { cssOnly = false, packageName = `@shared/${folder}` } = options;
  const exports = JSON.parse(
    readFileSync(new URL(`packages/${folder}/package.json`, repoRoot), "utf8"),
  ).exports as Record<string, string>;

  return Object.entries(exports)
    .filter(([key]) => !key.includes("*"))
    .filter(([key]) => (cssOnly ? key.endsWith(".css") : !key.endsWith(".css")))
    .flatMap(([key, target]) => {
      const resolved =
        typeof target === "string"
          ? target
          : typeof (target as { default?: string })?.default === "string"
            ? (target as { default?: string }).default
            : null;

      if (!resolved) return [];
      return [
        {
          find: key === "." ? packageName : `${packageName}/${key.slice(2)}`,
          replacement: fileURLToPath(new URL(`packages/${folder}/${resolved}`, repoRoot)),
        },
      ];
    });
}

/** Vite aliases for workspace packages when stories or fixtures import outside apps/. */
export function getMonorepoAliases() {
  return [
    ...exportAliases("config").sort((a, b) => b.find.length - a.find.length),
    ...exportAliases("ui", { cssOnly: true }).sort((a, b) => b.find.length - a.find.length),
  ];
}
