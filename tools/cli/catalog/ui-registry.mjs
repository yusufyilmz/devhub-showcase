import { isDeepStrictEqual } from "node:util";

import {
  portfolioAccentIds,
  portfolioThemes,
} from "../../../packages/config/src/portfolio/themes.ts";
import { authorableSectionTypes } from "../../../packages/config/src/sections/authorable-sections.ts";
import { themeOptions } from "../../../packages/config/src/theme/index.ts";
import registry from "../../../packages/ui/src/registry/components.json" with { type: "json" };
import { code, table } from "./table.ts";

export function renderUiCatalogMarkers(template) {
  const checks = [
    ["section IDs", Object.keys(registry.sections).sort(), [...authorableSectionTypes].sort()],
    ["theme IDs", registry.themes.presets.map(({ id }) => id), portfolioThemes.map(({ id }) => id)],
    ["portfolio accents", registry.themes.portfolioAccents, portfolioAccentIds],
    ["theme attributes", registry.themes.attributes, themeOptions],
  ];
  for (const [label, actual, expected] of checks) {
    if (!isDeepStrictEqual(actual, expected)) {
      throw new Error(`UI registry ${label} differ from the supported options in @shared/config.`);
    }
  }

  const columnKey = (title) =>
    title
      .toLowerCase()
      .replaceAll(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  function renderSectionTable() {
    const rows = [...Object.values(registry.sections), ...registry.otherSections]
      .sort((a, b) => a.component.localeCompare(b.component))
      .map(({ component, related, description, notes }) => [
        [component, ...(related ?? [])].map(code).join(", "),
        description ?? "",
        notes ?? "",
      ]);
    return table(["Section", "Description", "Also exports"], rows);
  }

  const special = {
    "section-count": () => String(Object.keys(registry.sections).length),
    sections: renderSectionTable,
    "theme-options": () =>
      table(
        ["Attribute", "Values"],
        [
          ...Object.entries(registry.themes.attributes).map(([key, values]) => [
            code(`data-${key}`),
            values.map(code).join(", "),
          ]),
          ["Portfolio accents", registry.themes.portfolioAccents.map(code).join(", ")],
        ],
      ),
    "theme-presets": () =>
      table(
        ["Portfolio theme", "ID", "Description"],
        registry.themes.presets.map(({ name, id, description }) => [name, code(id), description]),
      ),
  };

  return template.replace(/<!-- registry:([\w-]+) -->/g, (_, id) => {
    if (Object.hasOwn(special, id)) return special[id]();
    const group = registry.components[id];
    if (!group) throw new Error(`Unknown catalog group "${id}"`);
    return table(
      group.columns,
      group.entries.map((entry) => group.columns.map((column) => entry[columnKey(column)] ?? "")),
    );
  });
}
