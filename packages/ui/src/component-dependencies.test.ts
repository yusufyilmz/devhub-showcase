// @vitest-environment node
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const root = fileURLToPath(new URL("./", import.meta.url));

function sourceFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const file = join(directory, entry.name);
    if (entry.isDirectory()) return sourceFiles(file);
    return /\.tsx?$/.test(file) && !/\.(?:test|stories|d)\.tsx?$/.test(file) ? [file] : [];
  });
}

function runtimeImports(file: string): string[] {
  const source = readFileSync(file, "utf8");
  const imports = source.matchAll(
    /^(?:import|export)\s+(?!type\b)([^;]*?)\s+from\s+["']([^"']+)["']/gm,
  );
  return [...imports].flatMap(([, bindings, specifier]) => {
    if (!bindings || !specifier) return [];
    const names = bindings
      .trim()
      .replace(/^\{|\}$/g, "")
      .split(",")
      .filter(Boolean);
    if (names.length && names.every((name) => /^\s*type\s/.test(name))) return [];
    return [specifier];
  });
}

function resolveLocal(file: string, specifier: string): string | undefined {
  if (!specifier.startsWith(".")) return undefined;
  const stem = resolve(dirname(file), specifier);
  return [stem, `${stem}.ts`, `${stem}.tsx`, join(stem, "index.ts"), join(stem, "index.tsx")].find(
    (candidate) => existsSync(candidate) && statSync(candidate).isFile(),
  );
}

function dependencyCycles(graph: Map<string, string[]>): string[][] {
  const visited = new Set<string>();
  const active: string[] = [];
  const cycles: string[][] = [];
  function visit(file: string) {
    const index = active.indexOf(file);
    if (index !== -1) {
      cycles.push([...active.slice(index), file].map((item) => relative(root, item)));
      return;
    }
    if (visited.has(file)) return;
    active.push(file);
    for (const dependency of graph.get(file) ?? []) visit(dependency);
    active.pop();
    visited.add(file);
  }
  for (const file of graph.keys()) visit(file);
  return cycles;
}

describe("UI component dependency boundaries", () => {
  it("keeps application form controls behind shared primitives", () => {
    const repository = resolve(root, "../../..");
    const packages = readdirSync(join(repository, "packages")).flatMap((name) => {
      const src = join(repository, "packages", name, "src");
      return existsSync(src) ? sourceFiles(src) : [];
    });
    const apps = readdirSync(join(repository, "apps")).flatMap((name) =>
      ["app", "features"].flatMap((folder) => {
        const directory = join(repository, "apps", name, folder);
        return existsSync(directory) ? sourceFiles(directory) : [];
      }),
    );
    const primitives = new Set([
      join(root, "forms/input/Input.tsx"),
      join(root, "forms/textarea/Textarea.tsx"),
      join(root, "forms/native-select/native-select.tsx"),
    ]);
    const violations = [...packages, ...apps].filter(
      (file) =>
        !primitives.has(file) &&
        /<(?:button|input|textarea|select|label)(?:\s|>)/.test(readFileSync(file, "utf8")),
    );
    expect(violations.map((file) => relative(repository, file))).toEqual([]);
  });
  const files = sourceFiles(root);

  it("keeps internal runtime imports acyclic, including the Card dispatcher", () => {
    const graph = new Map(
      files.map((file) => [
        file,
        runtimeImports(file).flatMap((specifier) => {
          const dependency = resolveLocal(file, specifier);
          return dependency && files.includes(dependency) ? [dependency] : [];
        }),
      ]),
    );
    expect(dependencyCycles(graph)).toEqual([]);
  });

  it("keeps type imports erased and style modules independent of component implementations", () => {
    for (const file of files.filter((item) => item.endsWith("/types.ts"))) {
      expect(runtimeImports(file), relative(root, file)).toEqual([]);
    }
    for (const file of files.filter((item) => item.endsWith("/styles.ts"))) {
      const components = runtimeImports(file)
        .map((specifier) => resolveLocal(file, specifier))
        .filter((dependency) => dependency?.endsWith(".tsx"));
      expect(components, relative(root, file)).toEqual([]);
    }
  });
});
