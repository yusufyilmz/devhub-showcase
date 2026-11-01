---
name: developing-content-package
description: Change public page copy in @shared/content, including the home FAQ. Use when editing marketing copy or homepage questions in packages/content. Profile types, themes, and section metadata stay in @shared/config.
---

# Developing the content package

`packages/content` is `@shared/content`. It owns page copy that is not the persisted profile document. Today that is the homepage FAQ. Profile types, themes, section metadata, and site chrome copy live in `@shared/config`.

Read [the file map](references/map.md) and [packages/content/CATALOG.md](../../../packages/content/CATALOG.md).

## What belongs here

- Questions and answers shown on the public home page.
- Future marketing or product-page copy that is not a field on `PortfolioProfile` and not a label inside the portfolio or CV document.

Leave these out:

- A new profile field, theme, language, or section id. Use `@shared/config`.
- Validation, usernames, or publication rules. Use `@shared/lib`.
- Assistant replies that the model or classifier selects. Those fixed strings live in `@shared/assistant` `src/messages`.
- Navbar, footer, error page, and CV labels already exported as `copy` from `@shared/config`.

## Change the home FAQ

`homeFaq` is exported from `src/home/faq.ts` through `src/index.ts`. The home page in `apps/my-dev-studio` reads it. Keep each entry a question plus an answer a visitor can verify in the product.

When the answer describes a behavior, match the current product:

- Owners edit their own portfolio. A missing or private profile does not fall back to someone else's content.
- Publication is explicit.
- Portfolio language and theme are separate from PDF language and layout.
- Visitors do not need an account to read a published page.
- Do not promise a live social feed, a code-free claim the editor does not support, or a plan that billing does not sell.

Update `CATALOG.md` if you add a new public symbol. The only export today is `@shared/content` from `src/index.ts`. Add a subpath export only when callers need to load one file without the rest, and add that path to `package.json` `exports`.

## Add another copy module

1. Confirm the words are page copy, not profile schema and not config `copy`.
2. Add `src/<page>/<name>.ts` and export it from `src/index.ts`.
3. Add a catalog row.
4. Import `@shared/content` from the app or from `@shared/components`. Do not duplicate the strings in the route file.
5. This package currently has no runtime dependencies. Keep it free of React, Supabase, and `@shared/lib` so it can stay a leaf.

## Verification

```sh
pnpm --filter @shared/content typecheck
pnpm --filter my-dev-studio typecheck
```

If the home page rendering changes, open `/` in the dev server and read the FAQ. Run the home feature test when the page contract changes:

```sh
pnpm exec vitest run --project unit apps/my-dev-studio/features/home/home-page.test.tsx
pnpm --filter my-dev-studio dev
```

## Related skills

- [Developing the config package](../developing-config-package/SKILL.md)
- [Developing the MyDevStudio app](../developing-my-dev-studio-app/SKILL.md)
