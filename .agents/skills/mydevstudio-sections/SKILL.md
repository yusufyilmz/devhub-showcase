---
name: mydevstudio-sections
description: Extend MyDevStudio portfolio sections, compositions, hero backgrounds and social work showcases. Use for renderer registration, section settings, custom sections, ordering, previews and legacy profile compatibility.
---

# MyDevStudio sections

Read [the section workflow](references/workflow.md) and `docs/features/section-system.md` before extending a schema. Section metadata lives in `packages/config`. Renderers and editors live in `packages/components/src/sections`. Keep content identity, renderer choice, and presentation separate. Preserve defaults and old saved documents. Do not move auth or database access into shared components. Validate every new field and test public filtering, draft previews, empty states, mobile layout, and safe media URLs.
