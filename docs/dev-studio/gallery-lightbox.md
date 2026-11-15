# Gallery lightbox

Add a **Gallery Grid** section in the existing section library. Give every item
an image URL, title and optional body/caption. Clicking an image opens the shared
lightbox with previous/next buttons, arrow-key navigation, a counter and thumbnail
selection. Escape, the close button or the backdrop closes the viewer. Focus is
trapped inside the dialog and restored on close. Images keep their aspect ratio.

This uses the existing section document, visibility, ordering, editor, validation,
draft preview and save flow. No migration or upload service is required. Image
URLs must be HTTP or HTTPS. Mixed text/media sections retain their existing view
so earlier content is not silently omitted. This change does not fetch source URLs
on the server, add downloads, or publish anything automatically.

Homepage portfolio examples use the same viewer: click an example to inspect its
actual fictional portfolio page. Only the active preview is mounted. The viewer
follows the selected layout filter. Open full page retains the normal example
route, including its sample CV. Modified clicks still open the original link.
Iframe content has its own keyboard focus; use the viewer buttons to navigate
examples while interacting with the embedded page.

The implementation adapts the lightbox pattern from the supplied gallery example
without importing its app-specific routes, hooks, UI dependencies or download code.
