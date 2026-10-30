# Section workflow

1. Inspect packages/content/src/section-registry.ts, custom-sections.ts, profile.ts and packages/lib/src/domain/section.ts. Built-in sources are fixed profile fields. Custom sections have stable custom-UUID IDs and independently identified items.
2. Register explicit renderer metadata and implement the view in packages/components or a portfolio adapter. Do not accept arbitrary component paths, scripts or raw HTML.
3. Preserve sectionOrder's six built-in IDs. sectionSequence interleaves all built-in and custom IDs and must contain each existing section once. Missing sequence falls back to the old built-in order followed by custom creation order.
4. Add editor controls and previews through the existing draft/save pipeline. Duplicate IDs independently; remove stale ordering references. Use the shared accessible sortable list.
5. Treat services, testimonials, FAQs, statistics, calls to action and social work as authorable compositions, not a second data store. Keep defaults consistent with content shape. Label manual social curation clearly; do not promise live account feeds.
6. Keep hero content readable over image/video backgrounds. Provide a pause control and reduced-motion handling for video. Preserve the plain hero when media is unset. Do not autoplay audio.
7. Parse social URLs by exact host and path. Construct YouTube player URLs from validated video IDs; never embed arbitrary user-provided iframe HTML. Load the player only after a visitor requests it. Keep Instagram/Pinterest visual cards linked to the original public work. No hidden scraping, access tokens or automatic account imports.
8. Test serialization, rejected inputs, legacy defaults, selected/hidden content and browser interactions. Inspect desktop/mobile screenshots. Preserve third-party notices if porting implementation code; conceptual reimplementation must not claim copied code.

See docs/roadmap.md for remaining work. Template and PageForge import/export compatibility is a separate stage; presets do not constitute a migration of the PageForge application.
