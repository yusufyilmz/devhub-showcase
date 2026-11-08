# CV package map

Package `@shared/assistant/cv` in `packages/assistant`.

| Symbol               | Role                                                                             |
| -------------------- | -------------------------------------------------------------------------------- |
| `createCvData`       | Profile fields, labels, layout numbers, and visibility flags for the template    |
| `createCvDefinition` | pdfmake document definition                                                      |
| `renderCv`           | PDF bytes                                                                        |
| `cvHelpers`          | Handlebars helpers shared with the CLI generator                                 |
| `cvFormats`          | `classic`, `compact`, and `editorial` metrics inside `src/components/cv/data.ts` |

| Export                     | File                                                                 |
| -------------------------- | -------------------------------------------------------------------- |
| `@shared/assistant/cv`     | `src/index.ts`                                                       |
| `@shared/assistant/cv.hbs` | `templates/cv.json.hbs` with types from `src/types/cv-template.d.ts` |

## App routes that call the renderer

| Route                                       | Who it serves                       |
| ------------------------------------------- | ----------------------------------- |
| `app/[username]/cv.pdf/route.ts`            | Published profile for that username |
| `app/cv.pdf/route.ts`                       | Original main portfolio PDF         |
| `app/p/[id]/cv.pdf/route.ts`                | Compatibility id route              |
| `app/p/examples/[slug]/cv.pdf/route.ts`     | Public example                      |
| `app/admin/portfolios/[id]/cv.pdf/route.ts` | Guarded managed download            |
| `app/api/admin/cv/route.ts`                 | Authenticated personal download     |

The feature helper is `apps/my-dev-studio/app/api/cv/_response.ts`. Change authorization there, not in this package.

## Renderer invariants

- Fonts load from pdfmake's virtual filesystem.
- Remote and local URL access policies stay closed.
- Missing `cvLayout` selects `classic`.
- Labels follow `cvLanguage`.
- Email and language blocks follow `cvSettings` flags. Read `createCvData` for the full list before editing one flag.
- Profile strings stay data.

## Checks

```sh
pnpm --filter @shared/assistant typecheck
pnpm exec vitest run --project unit packages/assistant/src/components/cv/render.test.ts
```

## Source folders

- `src/components/cv/data.ts` prepares projected profile data and layout metrics.
- `src/components/cv/definition.ts` owns document definitions and shared Handlebars helpers.
- `src/components/cv/render.ts` configures safe in-memory fonts and produces PDF bytes.
- ATS content and section ordering live alongside those modules, with colocated tests.
- `src/components/studio/import/` contains import/review controls; `src/components/studio/settings/` contains CV settings. Import these through `@shared/assistant/studio`.
- `src/types/cv-template.d.ts` types the `@shared/assistant/cv.hbs` export.
