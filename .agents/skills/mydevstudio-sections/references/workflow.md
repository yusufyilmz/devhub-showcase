# Section workflow

1. Read `packages/config/src/sections/section-registry.ts`, `packages/config/src/sections/custom-sections.ts`, `packages/config/src/profile/profile.ts`, and `packages/lib/src/schemas/section/index.ts`. Built-in sources are fixed profile fields. Custom sections use stable custom UUID ids, and their items have their own ids.
2. Register renderer metadata explicitly. Implement the view and editor in `packages/ui/src/sections` and export them through the existing package entry points. Do not accept an arbitrary component path, script, or raw HTML.
3. Keep the six built-in ids in `sectionOrder`. `sectionSequence` interleaves built-in and custom ids and must contain each existing section once. A missing sequence falls back to the old built-in order, then custom creation order.
4. Add editor controls and previews through the existing draft and save pipeline. Duplicate ids independently. Remove stale ordering references. Use the shared sortable list.
5. Treat services, testimonials, FAQs, statistics, calls to action, and social work as authorable compositions, not a second data store. Keep defaults consistent with the content shape. Label manual social curation clearly. Do not promise a live account feed.
6. Keep hero text readable over image and video backgrounds. Provide a pause control and a reduced-motion path for video. Keep the plain hero when media is unset. Do not autoplay audio.
7. Parse social URLs by exact host and path. Build YouTube player URLs from validated video ids. Never embed an arbitrary user-provided iframe. Load the player only after the visitor asks for it. Keep Instagram and Pinterest cards linked to the original public work. Do not scrape, store access tokens, or import an account automatically.
8. Test serialization, rejected input, earlier defaults, selected and hidden content, and the browser interaction. Check desktop and mobile layout. Preserve third-party notices when adapting code.

Read `docs/features/section-templates.md` for the private template library and versioned import and export. Read `docs/reference/pageforge-section-migration.md` for source mappings. Preserve earlier sections that omit `sectionType`. Do not store saved templates inside the published profile document.
