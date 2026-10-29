# Portfolio and CV languages

In the studio, open **Language settings** to choose English, Spanish or Turkish separately for the portfolio and the PDF CV. Save changes to apply the settings. These are owner preferences, not a visitor translation switch. Existing profiles default to English.

The portfolio setting controls the four layouts' navigation, career section headings, project and contact actions, card reveal hints, theme controls, date formatting and HTML language. The CV setting controls PDF section headings, link labels, date formatting, the current-role label and document title. PDF downloads include a Content-Language header. The settings apply to every CV format and to both public and owner-only downloads through the same renderer and Plop template.

Saved content is not automatically translated. Names, biographies, achievements, project descriptions, skill group names, qualifications and spoken-language entries stay exactly as entered. Write that content in the language you want to publish. Maintaining several translated versions of the same biography or using a translation service is outside this change. The Languages section continues to list languages the owner speaks.

The platform homepage, studio, sign-in forms and the original owner's legacy AI chat remain in English. Editor pages declare English even when their portfolio is configured in another language. No alternate-language URLs or hreflang claims are created because each portfolio has one published content version.

Settings are enum-validated fields in the existing profile document. They use the same owner checks, private sharing default and revision conflict handling. No migration, new dependency, external translation request or production data edit is needed. Generic shared components accept supplied labels and keep their English defaults.

Tests cover legacy defaults, unsupported languages, dictionary completeness, localized current roles, all nine CV language/format combinations, independent saves without content changes, all four public layouts in Spanish and Turkish, private CV download language, editor reload persistence and mobile layout overflow. Browser tests use the isolated local fixture, not real Google accounts or a production database.
