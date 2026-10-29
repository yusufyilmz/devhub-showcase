# Portfolio section order

Open **Section order** in your editor to arrange About, Experience, Projects, Skills, Education and Languages. Drag the handle using a mouse, pen or touch screen. Move buttons and handle keyboard shortcuts (Arrow Up, Arrow Down, Home and End) provide alternatives. Escape cancels a drag. Reordering remains a draft until **Save changes** succeeds; the existing discard, ownership and revision conflict controls still apply.

The saved order belongs to the current user's profile and applies to all four public layouts. The introduction, contact area, footer and original portfolio testimonials retain their fixed positions. Empty career sections are skipped. The PDF keeps its separately selected CV layout.

**Reset to layout default** removes the override. Designer defaults to selected work first; other layouts start with About. Existing documents without `sectionOrder` use these defaults automatically. Choosing a different layout preserves an explicit order until it is reset.

The optional `sectionOrder` profile field is validated as a complete permutation of known section IDs. It lives in the existing profile document; no database migration, credentials or dependency changes are required. The generic pointer and keyboard sortable control is available at `@shared/components/sortable-list` for other apps in the workspace. It contains no portfolio or authentication logic.
