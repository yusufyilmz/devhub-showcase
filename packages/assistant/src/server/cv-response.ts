import type { ProfileSnapshot } from "@shared/lib/profile";

import { renderCv } from "../components/cv/index";

export function createCvResponse(template: string) {
  return async function cvResponse(snapshot: ProfileSnapshot) {
    const pdf = await renderCv(snapshot.profile, template);
    const name =
      snapshot.profile.name.replace(/[^a-zA-Z0-9]+/g, "_").replace(/^_|_$/g, "") || "Profile";
    return new Response(new Uint8Array(pdf), {
      headers: {
        "Cache-Control": "private, no-store",
        "Content-Disposition": `attachment; filename="${name}_CV.pdf"`,
        "Content-Language": snapshot.profile.cvLanguage ?? "en",
        "Content-Type": "application/pdf",
        "X-Content-Type-Options": "nosniff",
        "X-Profile-Revision": String(snapshot.revision),
        ...(snapshot.profile.publicationVisibility === "unlisted" ||
        snapshot.profile.publicationVisibility === "password"
          ? { "X-Robots-Tag": "noindex, nofollow" }
          : {}),
      },
    });
  };
}
