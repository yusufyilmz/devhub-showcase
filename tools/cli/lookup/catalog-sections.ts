import type { CatalogAudience } from "./types.ts";

/** Explicit per-subpath metadata wins; unclassified APIs stay in SHARED, never guessed UI. */
export function catalogAudience(
  name: string,
  subpath: string,
  entry: Record<string, unknown>,
  pkg: Record<string, unknown> = {},
): CatalogAudience {
  const configured = entry.audience ?? pkg.catalogAudience;
  if (configured !== undefined) {
    if (configured !== "UI" && configured !== "SERVER" && configured !== "SHARED")
      throw new Error(`Invalid catalog audience for ${name}${subpath}: ${String(configured)}`);
    return configured;
  }
  if (/\/(?:server|middlewares|internal-auth)(?:\/|$)/.test(subpath)) return "SERVER";
  if (/\/(?:ui|browser|react)(?:\/|$)/.test(subpath)) return "UI";
  if (/^@shared\/(?:ui|components|ui-kit|runtime|icons|design-tokens|storybook)$/.test(name))
    return "UI";
  if (
    /^@shared\/(?:lib|auth|assistant|billing|notifications|server|services|integrations|aws|googleapis|slack)$/.test(
      name,
    )
  )
    return "SERVER";
  return "SHARED";
}

export function selectCatalogScope(
  snapshot: Record<string, unknown>,
  audience: CatalogAudience,
): Record<string, unknown> {
  const manifest: Record<string, unknown> = {};
  const metadata = new Map(Object.entries(snapshot).map(([pkgName, pkg]) => [pkgName, pkg]));
  let symbols = 0;
  for (const [name, subpaths] of Object.entries(snapshot)) {
    for (const [subpath, entry] of Object.entries(subpaths as Record<string, unknown>)) {
      if (
        catalogAudience(
          name,
          subpath,
          entry as Record<string, unknown>,
          metadata.get(name) as Record<string, unknown>,
        ) !== audience
      )
        continue;
      symbols += ((entry as Record<string, unknown>).exports as string[])?.length ?? 0;
      manifest[name] = { ...(manifest[name] as Record<string, unknown>), [subpath]: entry };
    }
  }
  return {
    manifest,
    packages: Object.keys(snapshot).filter((pkgName) => manifest[pkgName]),
    symbols,
  };
}
