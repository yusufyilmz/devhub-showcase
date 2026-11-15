# Repository lookup

The lookup command runs locally and returns JSON records with the source artifact and, where available, a section anchor.

## Prerequisites

Use the repository's Node and pnpm versions. Run `pnpm install --frozen-lockfile` and run the commands from the repository root. These checks use the terminal and require no server, routes, accounts, or credentials.

## Local checks

| Step | Source                                                    | Action                                                                                                              | Expected result                                                                                          | Actual result                                       |
| ---- | --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| 1    | [UI catalog](../../../packages/ui/CATALOG.md)             | Run `pnpm lookup capability "native select"`.                                                                       | A match points to the UI catalog.                                                                        | Passed in the workspace checkout.                   |
| 2    | [Design guide](../../../DESIGN.md)                        | Run `pnpm lookup design focus`.                                                                                     | Matches point to sections in the design guide.                                                           | Passed in the workspace checkout.                   |
| 3    | [Artifact reader](../../../tools/cli/lookup/artifacts.ts) | Run `pnpm lookup symbol HomeButton`. For the missing-manifest check, use a disposable copy with the catalog absent. | The configured export resolves to its public import path. An absent manifest reports `missing_artifact`. | Public import and missing-manifest behavior passed. |

## Symbol catalog

Symbol lookup reads `.ai/catalogs/symbols-catalog.md`. The initial catalog covers the five public exports from `@shared/ui/buttons`. Add entries for other verified public exports using the package name and public subpath. Use `"."` for the package root and list a type-only export as `type ButtonProps`, for example.

For example, a symbol catalog can contain this frontmatter.

```yaml
---
catalog:
  "@shared/ui":
    "./buttons":
      audience: UI
      exports: [ HomeButton ]
---
```

Capability lookup reads the Markdown files under `.ai/catalogs` when present and otherwise uses the package catalogs. Design lookup uses `.ai/design`, `.ai/designs`, and design catalogs when present, with the root design guide as a fallback. Use `pnpm --silent lookup` when piping successful JSON output into another command.
