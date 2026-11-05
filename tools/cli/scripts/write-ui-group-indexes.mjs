import { readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const uiSrc = path.join(root, "packages/ui/src");

/** @type {Record<string, { skip?: string[]; extra?: string[] }>} */
const GROUPS = {
  buttons: {},
  content: {},
  customizers: {},
  feedback: {},
  forms: { skip: ["field", "lines-field", "select-field", "index.ts"] },
  layout: { skip: ["reveal-card"] },
  navigation: {
    extra: ['export { MobileMenu } from "./navbar/MobileMenu";'],
  },
  overlays: { skip: ["radix-dialog"] },
};

async function listComponentDirs(group) {
  const groupDir = path.join(uiSrc, group);
  const entries = await readdir(groupDir, { withFileTypes: true });
  const skip = new Set(GROUPS[group].skip ?? []);
  skip.add("index.ts");
  return entries
    .filter((entry) => entry.isDirectory() && !skip.has(entry.name))
    .map((entry) => entry.name)
    .sort();
}

async function writeGroupIndex(group) {
  const dirs = await listComponentDirs(group);
  const lines = [
    ...dirs.map((name) => `export * from "./${name}";`),
    ...(GROUPS[group].extra ?? []),
  ];
  const file = path.join(uiSrc, group, "index.ts");
  await writeFile(file, `${lines.join("\n")}\n`);
}

for (const group of Object.keys(GROUPS)) {
  await writeGroupIndex(group);
}

const componentsBarrel = `export * from "../buttons";
export * from "../forms";
export * from "../feedback";
export * from "../overlays";
export * from "../layout";
export * from "../navigation";
export * from "../content";
export * from "../customizers";
export * from "../cards";
`;

await writeFile(path.join(uiSrc, "components/index.ts"), componentsBarrel);

const formsEntry = `export { EmptyState } from "../feedback/empty-state";
export { Field } from "./field";
export { LinesField } from "./lines-field";
export { SelectField } from "./select-field";
export * from "./calendar";
export * from "./checkbox";
export * from "./contact-form";
export * from "./form";
export * from "./input";
export * from "./input-otp";
export * from "./label";
export * from "./login-form";
export * from "./radio-button";
export * from "./radio-group";
export * from "./select";
export * from "./slider";
export * from "./text-field";
export * from "./textarea";
`;

await writeFile(path.join(uiSrc, "forms/index.ts"), formsEntry);

console.log("Wrote group index.ts files and updated components/forms barrels.");
