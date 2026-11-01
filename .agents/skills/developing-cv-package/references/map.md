# CV package map

Package `@shared/templates` in `packages/cv`.

| Symbol               | Role                                                                          |
| -------------------- | ----------------------------------------------------------------------------- |
| `createCvData`       | Profile fields, labels, layout numbers, and visibility flags for the template |
| `createCvDefinition` | pdfmake document definition                                                   |
| `renderCv`           | PDF bytes                                                                     |
| `cvHelpers`          | Handlebars helpers shared with the CLI generator                              |
| `cvFormats`          | `classic`, `compact`, and `editorial` metrics inside `src/index.ts`           |

| Export                           | File                                                        |
| -------------------------------- | ----------------------------------------------------------- |
| `@shared/templates`              | `src/index.ts`                                              |
| `@shared/templates/template.hbs` | `templates/cv.json.hbs` with types from `src/template.d.ts` |

## App routes that call the renderer

| Route                                       | Who it serves                       |
| ------------------------------------------- | ----------------------------------- |
| `app/[username]/cv.pdf/route.ts`            | Published profile for that username |
| `app/cv.pdf/route.ts`                       | Original main portfolio PDF         |
| `app/p/[id]/cv.pdf/route.ts`                | Compatibility id route              |
| `app/p/examples/[slug]/cv.pdf/route.ts`     | Public example                      |
| `app/admin/portfolios/[id]/cv.pdf/route.ts` | Guarded managed download            |
| `app/api/admin/cv/route.ts`                 | Authenticated personal download     |

The feature helper is `apps/my-dev-studio/features/portfolio/cv-response.ts`. Change authorization there, not in this package.

## Renderer invariants

- Fonts load from pdfmake's virtual filesystem.
- Remote and local URL access policies stay closed.
- Missing `cvLayout` selects `classic`.
- Labels follow `cvLanguage`.
- Email and language blocks follow `cvSettings` flags. Read `createCvData` for the full list before editing one flag.
- Profile strings stay data.

## Checks

```sh
pnpm --filter @shared/templates typecheck
pnpm exec vitest run --project unit packages/cv/src/index.test.ts
```
