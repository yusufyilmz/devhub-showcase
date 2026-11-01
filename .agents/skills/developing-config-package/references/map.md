# Config package map

Package `@shared/config` in `packages/config`. No database client and no authorization.

## Source

| Path                                   | Owns                                                        |
| -------------------------------------- | ----------------------------------------------------------- |
| `src/profile/profile.ts`               | `PortfolioProfile` and the default `profile`                |
| `src/profile/branding.ts`              | `getNameInitials`                                           |
| `src/profile/demo-profile.json`        | Fictional demo document                                     |
| `src/portfolio/themes.ts`              | Theme ids, palettes, preview accents                        |
| `src/portfolio/languages.ts`           | Languages, portfolio copy, period formatting                |
| `src/portfolio/portfolio-types.ts`     | `PortfolioType`, `CvLayout`                                 |
| `src/portfolio/portfolio-sections.ts`  | Built-in section ids, labels, and order                     |
| `src/sections/authorable-sections.ts`  | Authorable families and `MAX_CUSTOM_SECTIONS`               |
| `src/sections/section-registry.ts`     | Registry and built-in order                                 |
| `src/sections/section-compositions.ts` | Compositions                                                |
| `src/sections/custom-sections.ts`      | Custom section ids and views                                |
| `src/sections/section-source.ts`       | Source extraction from a profile                            |
| `src/sections/section-content.ts`      | Content shapes                                              |
| `src/sections/section-templates.ts`    | Template type shapes                                        |
| `src/copy/site-copy`                   | Navbar, footer, CV, chat, errors, metadata, structured data |
| `src/copy/chat-messages`               | Chat copy bundled into `copy.chatMessages`                  |
| `src/variables`                        | Shared variables, `sites-config.json`, variable schema      |
| `src/urls`                             | Shared URL helpers for config                               |
| `src/constants.ts`                     | `CHATSIZE`, `dataStyle`, `effects`, `style`                 |
| `src/index.ts`                         | Public root                                                 |
| `CATALOG.md`                           | Public inventory                                            |

## Field change checklist

- [ ] Type and default in `src/profile/profile.ts`
- [ ] Optional in the Zod schema so old documents parse
- [ ] Import and template mapping if the field can arrive from CV, Google, or PageForge
- [ ] Renderer and editor
- [ ] CV template only if the PDF shows it
- [ ] Catalog row if the public export list changes
- [ ] Test with the field absent

## Values that stay independent

| Portfolio choice                                                         | PDF choice                                                 |
| ------------------------------------------------------------------------ | ---------------------------------------------------------- |
| Portfolio language via `getPortfolioCopy` and the profile language field | `cvLanguage`                                               |
| `portfolioThemes` and accent                                             | `cvLayout`, `cvSettings`, CV accent derived at render time |
| Section visibility on the page                                           | Whether that block is included in the PDF                  |

Read `packages/cv/src/index.ts` `createCvData` before assuming a profile flag hides a PDF block. Flags such as `showEmail` and `includeLanguages` are applied there.

## Checks

```sh
pnpm --filter @shared/config typecheck
pnpm exec vitest run --project unit packages/lib/src/domain
```
