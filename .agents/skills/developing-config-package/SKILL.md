---
name: developing-config-package
description: Change profile types, themes, languages, CV layout choices, and section metadata in @shared/config. Use when adding a persisted profile field, theme, portfolio type, authorable section, section composition, or site copy that describes the profile document in packages/config.
---

# Developing the config package

`packages/config` is `@shared/config`. It owns the profile shape, themes, languages, portfolio and CV choices, section metadata, and copy that describes those structures. It does not read a database, authorize a request, or render a page.

Read [the file map](references/map.md) and [packages/config/CATALOG.md](../../../packages/config/CATALOG.md). A section change also needs [mydevstudio-sections](../mydevstudio-sections/SKILL.md). Publication, usernames, and privacy need [mydevstudio-business](../mydevstudio-business/SKILL.md).

Homepage FAQ copy lives in `@shared/config`, not here. Zod validation of a save lives in `@shared/lib`. Rendering lives in `@shared/ui` and `@shared/templates`.

## Change a persisted profile field

Update these together. A document that omits the field must keep loading.

1. The type and default on `PortfolioProfile` in `src/profile/profile.ts`. The exported `profile` value is the default document.
2. The save and import schemas in `packages/lib/src/domain/profile.ts`, plus any import path that copies the field (`cv-import`, `pageforge-import`, `google-profile`, `section-templates`).
3. The renderer and editor in `@shared/ui`.
4. PDF output in `@shared/templates` when the field can appear on a CV.
5. Tests for the valid value, the rejected value, and a fixture that omits the field.

Do not give the field a second name in copy, config, and the validator. Pick the name already used on `PortfolioProfile`.

Portfolio language and theme are independent from CV language and PDF layout. `cvLanguage`, `cvLayout`, and `cvSettings` are not aliases of `languages` or `portfolioThemes`. A styling change must not publish a profile or change who can download the PDF.

## Change section metadata

| Module                                 | Role                                                                |
| -------------------------------------- | ------------------------------------------------------------------- |
| `src/sections/authorable-sections.ts`  | Families an owner can add, their sources, and `MAX_CUSTOM_SECTIONS` |
| `src/sections/section-registry.ts`     | Built-in section order                                              |
| `src/sections/section-compositions.ts` | Compositions over existing sources, not a second data store         |
| `src/sections/custom-sections.ts`      | Custom section ids and views                                        |
| `src/sections/section-source.ts`       | How a section reads profile fields                                  |
| `src/sections/section-content.ts`      | Section content types                                               |
| `src/sections/section-templates.ts`    | Saved and exported template shapes                                  |

Keep the six built-in ids in `sectionOrder`. `sectionSequence` interleaves built-in and custom ids and must contain each existing section once. A missing sequence falls back to the old built-in order, then custom creation order.

Services, testimonials, FAQs, statistics, calls to action, and social work are compositions over profile data. Do not store them as a second document. Do not store saved templates inside the published profile.

Register renderer metadata explicitly. Do not accept an arbitrary component path.

## Themes, languages, and types

| Export                                                   | Module                                | Use                               |
| -------------------------------------------------------- | ------------------------------------- | --------------------------------- |
| `portfolioThemes`, `portfolioAccents`, `getThemePalette` | `src/portfolio/themes.ts`             | Palette and preview accent        |
| `languages`, `getPortfolioCopy`, `formatPortfolioPeriod` | `src/portfolio/languages.ts`          | Portfolio and CV labels           |
| `portfolioTypes`, `cvLayouts`                            | `src/portfolio/portfolio-types.ts`    | Layout and PDF format choices     |
| `getPortfolioSections`, `portfolioSectionIds`            | `src/portfolio/portfolio-sections.ts` | Built-in section order and labels |

Theme tokens that the browser applies still live in `@shared/ui`. This package describes the allowed theme ids and palettes. Adding a theme id requires both the config entry and the CSS variables.

## Copy in this package

`src/copy` holds site, chat, CV, error, and structured-data copy exported as `copy` from the package root. Chat message strings that the assistant speaks as fixed replies also have a home in `@shared/assistant` `src/messages`. Match the existing file before adding a new copy module. Public marketing FAQ belongs in `@shared/config`.

`src/profile/demo-profile.json` is fixture content. Use fictional people. Do not commit a real CV, token, or private export.

## Exports

| Export                     | Path            |
| -------------------------- | --------------- |
| `@shared/config`           | `src/index.ts`  |
| `@shared/config/variables` | `src/variables` |
| `@shared/config/urls`      | `src/urls`      |
| `@shared/config/sections`  | `src/sections`  |

`@shared/config/sections` exists so callers can load section metadata without the rest of the package. Add a symbol to the matching `index.ts` and to `CATALOG.md`. This package has no runtime dependency on `@shared/lib`; keep it that way so validation can depend on config without a cycle.

## Verification

```sh
pnpm --filter @shared/config typecheck
pnpm exec vitest run --project unit packages/lib/src/domain/profile.test.ts
pnpm check:exports
```

When the field is rendered, also run the component test and the CV test that covers it. Say which checks ran.

## Related skills

- [Developing the lib package](../developing-lib-package/SKILL.md)
- [Developing the UI package](../developing-ui-package/SKILL.md)
- [Developing the CV package](../developing-cv-package/SKILL.md)
- [Developing the content package](../developing-content-package/SKILL.md)
