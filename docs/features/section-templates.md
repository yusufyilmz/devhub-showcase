# Section package and templates

@shared/sections exposes an explicit renderer registry, a separate editor registry, individual section entrypoints and styles.css. Public rendering imports the renderers entrypoint; the editor imports editors. The package depends on content and portable components, not Next.js routes, auth or database clients. See [the complete source mapping](../reference/pageforge-section-migration.md).

## Saved data and compatibility

Existing custom sections without sectionType continue to use the previous composition renderer. New sections carry a registered sectionType, compatible renderer, options, ordered items and optional profile source. Existing six-ID sectionOrder remains unchanged. sectionSequence orders all current built-in and custom IDs; new copies and imports get fresh IDs. Limits are 60 custom sections and 30 items per section, subject to the normal profile request-size limit.

Options include description, alignment, columns and type-specific recipient email, subscription URL, map coordinates or media URLs. Items support body, links, images, values/prices, periods, bullet points, code examples and optional video captions. All prose and code are escaped. Relative source assets require an explicit HTTP/HTTPS base URL; the app server never fetches source media.

## Template library

The Templates editor saves up to five templates to a separate account-private portfolio_section_templates row. Owner RLS and confirmed-user API checks isolate accounts. No anonymous role can read it. Revision checks reject conflicting updates. It is independent of profile publication and is available while editing managed portfolios under the same signed-in account.

Configuration templates omit authored items, personal section names, descriptions, media, contact details and profile bindings by default. The explicit Include authored content, media and bindings option includes those fields for saving/export. The library is saved immediately by its own button; applying changes only the current portfolio draft, which still needs Save changes. Templates do not change identity, username, auth, sharing, CV content or account ownership.

Export uses the versioned mydevstudio.sections format, version 1, with name, includesContent and sections. Each file is validated and limited to 160,000 characters of normalized JSON data. Input files are limited to 500 KB. Unsupported versions, unknown types, unsafe links, duplicate IDs and prototype properties are rejected before any draft is changed.

Applying can append or replace custom sections. Replace requests explicit confirmation. Both create fresh section and item IDs. Source bindings rebind to the current profile with all current/future compatible items, and the review calls this out. Private projects stay excluded. Built-in sections remain in place.

## PageForge import

The review accepts a block array, content blocks, grouped sections or a PageConfig content tree containing header, hero, main, sidebar and footer groups. Known underscore aliases and experience/skills/socials/gallery names normalize to the new catalog. The fixture in tests/fixtures/pageforge-sections.json exercises all 42 source families.

Supported content becomes typed items, descriptions, links and options. Grouped FAQs and menus flatten into authorable items; images, prices, features, authors and periods map to supported fields. Conversion notes describe external integrations and visual adaptations. Unsupported section types abort the import; scripts, CSS, metadata, auth, endpoints and executable React/MDX are never applied. Review and previews occur before Apply to draft. Publishing remains a separate user choice.

The migration 20261030092215_private_section_templates.sql creates only the private library table and owner policies. Check the target environment's migration history before applying it; documentation does not certify production migration state. The migration is separate from profile content and publication.
