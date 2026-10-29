# Portfolio types: step one

Users can choose Engineer, Designer, Consultant or Minimal. Engineer retains the original layout. Designer presents public projects as a gallery before the biography and experience. Consultant uses a personal introduction beside the career details on wide screens. Minimal uses a narrow column and quieter typography. All respect the existing accent and light/dark preferences.

New workspaces start with `templateChosen: false`. Their first editor visit shows the type picker, then continues to the normal editor. The choice is saved with the rest of the profile when the owner presses Save changes. Selecting a layout does not publish a portfolio, change a username, delete content or copy someone else's career details. Existing documents without these fields default to Engineer, Classic CV and a completed picker, so existing users can continue editing immediately. Existing users can change their choice in the Layout section.

The PDF section independently selects Classic, Editorial or Compact. Editorial has a larger name and more whitespace; Compact uses tighter margins and spacing. Every format uses the same Plop Handlebars source, privacy settings, safe JSON escaping and bundled fonts. First selection suggests a CV format; later portfolio switches preserve the current CV choice.

The optional Project cover image URL field appears in Projects. Designer loads that public image directly in the visitor's browser with no referrer. The application and PDF renderer do not fetch it. Without an image, a numbered cover keeps the gallery usable. Project links can point to external case studies or video pages. Uploads, video embedding and case study subpages are outside this step. Public pages and PDFs continue to exclude projects whose public flag is false.

All settings live in the existing validated profile JSON document and use the current owner authorization, optimistic revision checks and private-by-default sharing. No database migration or new dependency is required. The original owner's testimonials and chat remain on the Engineer layout.

The Designer direction is inspired by the large introduction and selected work gallery in Yusuf's brother's portfolio. It does not import his content, media, video integrations or deployment configuration.

Validation covers new-user selection, legacy defaults, invalid types and unsafe cover URLs, preserving content and independent CV preferences, all three PDF formats and desktop/mobile public-page navigation and downloads.

Next steps, in separate changes: portfolio and CV language options; more visual themes; homepage explanations; search metadata and generated personal name logos. None of those later steps are included here.
