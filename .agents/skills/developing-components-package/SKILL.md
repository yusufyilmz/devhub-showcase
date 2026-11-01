---
name: developing-components-package
description: Develop portable studio UI, portfolio sections, editors, layout, chat, and portfolio surfaces in @shared/components. Use when changing packages/components, a section renderer or editor, StudioShell, PortfolioChat, login panel, or a studio screen that must stay free of route handlers.
---

# Developing the components package

`packages/components` is `@shared/components`. It owns portable studio UI, section renderers and editors, layout shells, chat presentation, and portfolio surfaces. Primitive controls live in `@shared/ui`. Routes and authorization live in `apps/my-dev-studio`.

Read [the file map](references/map.md) and [packages/components/CATALOG.md](../../../packages/components/CATALOG.md). For a section, also read [mydevstudio-sections](../mydevstudio-sections/SKILL.md) and `docs/features/section-system.md`. For owner, publish, and privacy behavior, read [mydevstudio-business](../mydevstudio-business/SKILL.md).

`docs/architecture.md` and `docs/reference/shared-packages.md` still mention `packages/sections`, `apps/web`, and a components package with no internal dependencies. Those notes are stale. This package currently depends on `@shared/auth`, `@shared/config`, `@shared/content`, `@shared/design-system`, `@shared/lib`, `@shared/runtime`, and `@shared/ui`. Use those packages for types, validators, tokens, and primitives. Do not move route handlers, session decisions, or repositories into this package.

## Where a visual change goes

Stop at the first match:

1. The URL, metadata, or HTTP handler must exist. Put that in `apps/my-dev-studio/app`, and put data access in `features/`. Pass the result into the component.
2. The piece is a primitive control, theme, or toast. Put it in `@shared/ui`.
3. The piece is a section, editor, studio screen, shell, chat surface, or portfolio surface. Put it here.
4. The piece is only a re-export. Do not add it. Callers import the existing entry point.

A component receives data, labels, and callbacks as props. It does not choose an API URL. `LoginPanel` is the pattern: copy, endpoints, and destinations are props.

## Change a section

Read `packages/config/src/sections/section-registry.ts`, `custom-sections.ts`, and `packages/lib/src/domain/section.ts` first.

1. Keep content identity, renderer choice, and presentation separate. Built-in sections use fixed profile fields. Custom sections use stable UUID ids.
2. Add the view under `src/sections/variants/<name>`. Export it from `src/sections/variants/index.ts`, which is `@shared/components/sections`.
3. Register the renderer in `src/sections/renderers` so `RenderSection` can resolve the saved type. Register the editor in `src/sections/editors` so `EditSection` can resolve it.
4. Update `@shared/config` metadata and `@shared/lib` validation in the same change when the saved shape changes. Documents that omit the new field must still render.
5. Do not accept an arbitrary component path, script, or raw HTML. Do not embed an arbitrary user-provided iframe. Social and video rules are in the sections skill.
6. Add a colocated story and a unit test for defaults, empty content, and a legacy document that omits the field.

Item, list, and form parts stay in the section folder. Most sections export a matching editor from that folder. `CVSection`, `AboutMeSection`, `EducationsSection`, `ExperienceSection`, `ReferralSection`, `ReviewSection`, `SkillSection`, and `SummarySection` are exceptions; check the catalog before assuming an editor export exists.

## Change a studio screen

Studio screens live in `src/studio` (`admin`, `billing`, `management`, `examples`). Shells live in `src/layout`: `StudioShell`, `PageShell`, and `PortfolioLayout`.

- Fetching and navigation stay in the app feature. The screen accepts the snapshot, the save function, and links as props.
- Do not add `features/<name>.tsx` in the app that only re-exports a shared component.
- Billing presentation may live here. The Stripe gateway, prices, and account status stay in `apps/my-dev-studio/features/billing`.
- Editor building blocks live in `src/editor`: `CollectionEditor`, `SortableList`, `SectionContentEditor`, `OptionsEditor`, and `SourceEditor`. `SortableList` commits a completed reorder through `onChange`. It does not persist.

## Chat and portfolio surfaces

| Export                              | Path                 | Use                                 |
| ----------------------------------- | -------------------- | ----------------------------------- |
| `@shared/components/chat`           | `src/chat`           | Bubbles, composer, list, typing     |
| `@shared/components/portfolio-chat` | `src/portfolio/chat` | `PortfolioChat` on a published page |
| `@shared/components/portfolio`      | `src/portfolio`      | `HeroSurface`, `WorkMedia`          |

Chat placed inside a portfolio section stays in `src/sections/variants/chat-section`. Visitor authorization and rate limits stay in the app, `@shared/lib`, and `@shared/cache`. This package renders the conversation it is given.

Hero text must stay readable over image and video. Video needs a pause control and a reduced-motion path. Keep the plain hero when media is unset. Do not autoplay audio.

## Public exports

Add a new entry point in `packages/components/package.json` `exports`, export it from the matching `index.ts`, and add a row to `CATALOG.md`. Current entry points include `.`, `./chat`, `./portfolio`, `./portfolio-chat`, `./sections`, `./section/editors`, `./section/renderers`, `./forms`, `./editor`, `./login`, `./pages`, `./layout`, `./containers`, `./studio`, and `./studio/examples.css`.

`./login` points at `src/auth/login-panel.tsx`. That folder is the sign-in panel, not `@shared/auth`.

## Tests and stories

Colocate `component.test.tsx` and `component.stories.tsx` with the source. Start unit tests with `describe`. Storybook loads `packages/components/src/**/*.stories.*`.

For a section, test serialization, rejected input, legacy defaults, hidden content, and the editor interaction. Check a narrow viewport when layout changes. Safe media URLs are part of the section contract.

```sh
pnpm --filter @shared/components typecheck
pnpm exec vitest run --project unit packages/components/src/<path>.test.tsx
pnpm --filter storybook-app storybook
```

App routes that render the changed surface still need the app skill and, for UI behavior, a browser pass against `pnpm --filter my-dev-studio dev`.

## Related skills

- [Developing the UI package](../developing-ui-package/SKILL.md)
- [Developing the config package](../developing-config-package/SKILL.md)
- [Developing the MyDevStudio app](../developing-my-dev-studio-app/SKILL.md)
- [Sections](../mydevstudio-sections/SKILL.md)
