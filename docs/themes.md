# Portfolio themes

In the studio, open Appearance and choose Studio, Paper, Graphite or Bloom. Studio retains the original palette and styling. Paper uses warm surfaces and serif headings; Graphite uses neutral surfaces, monospaced headings and sharper cards; Bloom uses lavender surfaces and softer cards.

Theme, layout, language and CV format are independent. Every portfolio theme works with Engineer, Designer, Consultant and Minimal, in light and dark mode, and with the existing cyan, violet and emerald accents. A portfolio theme changes the website; the PDF retains its own format and uses the selected accent as before.

The Appearance editor previews a theme with the owner's name, role and summary. The light/dark preview buttons affect only that preview and its thumbnails. They do not change the saved default mode. The Default color mode control sets Dark, Light or Match device and updates the example. Match device uses a dark example until a preview mode is chosen; public pages follow the visitor's device. Save changes to apply the draft preferences to the public page.

Public pages receive the selected theme and its palette variables from the saved document on the server. CSS selects the matching light or dark palette when the existing theme toggle or device preference changes. MUI overlays use the same surface and text colors. Visitor color overrides retain the existing per-profile storage keys. The homepage and editor do not receive the portfolio theme; the editor preview has its own local scope.

Older documents default to Studio, including documents with an existing appearance object. The new theme value is enum-validated in the existing JSON document and uses the same owner checks and revision handling. No migration, new dependency or external font request is required. Theme styles use system heading fonts and the existing body fonts. Tailwind also scans the app feature directory so preview and editor accessibility utilities are included in the production stylesheet.

Tests cover legacy defaults, invalid theme names, palette contrast, preview isolation, preserving content/layout/CV format, saving and reloading themes, every theme/layout combination on desktop and mobile, light/dark toggles, device-mode changes and visitor overrides. Screenshots of the Designer themes and Appearance picker are retained in the browser test output.

This is step three. Homepage explanations, search visibility improvements and personal name logos remain separate changes.
