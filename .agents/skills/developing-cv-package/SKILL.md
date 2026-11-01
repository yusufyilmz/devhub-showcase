---
name: developing-cv-package
description: Render CV PDFs in @shared/templates. Use when changing pdfmake output, the Handlebars CV template, CV layout metrics, accent colors, or which profile fields appear in a downloaded CV in packages/cv.
---

# Developing the CV package

`packages/cv` is `@shared/templates`. It turns a `PortfolioProfile` into PDF bytes. The caller supplies the profile and decides who may download it. This package does not read Supabase, check a session, or choose a public versus private route.

Read [the file map](references/map.md) and [packages/cv/CATALOG.md](../../../packages/templates/CATALOG.md). Download routes live in the app. Read [mydevstudio-business](../mydevstudio-business/SKILL.md) before changing visibility.

## Render path

1. `createCvData(profile)` copies fields the template needs, applies `getPortfolioCopy(profile.cvLanguage)`, and applies layout metrics.
2. `createCvDefinition` fills `templates/cv.json.hbs` with Handlebars and `cvHelpers`.
3. `renderCv` returns PDF bytes through pdfmake.

The template source is the export `@shared/templates/template.hbs`, which points at `templates/cv.json.hbs` with types in `src/template.d.ts`. The Plop generator and the website share `cvHelpers.json` so JSON escaping matches. Change the helper and the template together.

pdfmake uses an in-memory font filesystem. Do not point it at host font files. `setUrlAccessPolicy` and `setLocalAccessPolicy` both return false. A CV is text and links only. Never fetch an image, stylesheet, or other asset named in profile data.

## Layout and visibility

`cvFormats` maps `classic`, `compact`, and `editorial` to line height, name size, page margins, section margin, and title size. An unknown or missing `cvLayout` uses `classic`. Font size defaults to 9. Page size defaults to A4. Accent colors are cyan, violet, and emerald hex values chosen from `profile.appearance.accent`.

Portfolio theme and portfolio language do not select the PDF. Use `cvLanguage`, `cvLayout`, and `cvSettings`.

Honor the existing visibility flags inside `createCvData`. Examples already in the renderer include hiding email when `cvSettings.showEmail` is false and omitting languages when `cvSettings.includeLanguages` is false. Read the rest of `createCvData` before adding a flag so the page and the PDF do not share one switch by accident.

Periods use `formatPortfolioPeriod` from `@shared/config` with `cvLanguage`.

## Change the template safely

- Treat every profile string as data. The Handlebars `json` helper stringifies values. Do not mark profile text as trusted HTML.
- Keep a document that omits a new field valid. Default it in `createCvData`.
- Add the field to `@shared/config` and `@shared/lib` when it is persisted, not only in the template.
- Do not log the profile, the generated definition, or the PDF bytes.
- Do not widen who can download. Public routes serve a published snapshot. Private routes stay behind the app guard. A missing or private named profile is a 404 with no fallback to another profile.

## Tests

`src/index.test.ts` covers the renderer. Extend it when layout metrics, a visibility flag, or escaping changes. Use a fictional profile. App route tests such as `app/[username]/cv.pdf/route.test.ts` cover authorization and response headers. Run both when the bytes or the route contract change.

```sh
pnpm --filter @shared/templates typecheck
pnpm exec vitest run --project unit packages/cv/src/index.test.ts
```

The root script `pnpm cv:generate` is a generator. Read `turbo/generators` before running it. Do not commit a generated PDF unless the task's deliverable is that file.

## Dependencies

`@shared/config`, `handlebars`, and `pdfmake` are the runtime dependencies. New external packages use `catalog:`. This package must not depend on `apps/my-dev-studio`, `@shared/auth`, or `@shared/ui`.

## Related skills

- [Developing the config package](../developing-config-package/SKILL.md)
- [Developing the lib package](../developing-lib-package/SKILL.md)
- [Developing the MyDevStudio app](../developing-my-dev-studio-app/SKILL.md)
