import { unstable_rethrow } from "next/navigation";

import { renderCv } from "@shared/assistant/cv";
import template from "@shared/assistant/cv.hbs";

import { getPublishedProfile } from "./_profile";

export const runtime = "nodejs";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const snapshot = await getPublishedProfile("cv");
    const pdf = await renderCv(snapshot.profile, template);
    const name =
      snapshot.profile.name.replace(/[^a-zA-Z0-9]+/g, "_").replace(/^_|_$/g, "") || "Profile";
    return new Response(new Uint8Array(pdf), {
      headers: {
        "Cache-Control": "no-store",
        "Content-Disposition": `attachment; filename="${name}_CV.pdf"`,
        "Content-Type": "application/pdf",
        "X-Content-Type-Options": "nosniff",
        "X-Profile-Revision": String(snapshot.revision),
        ...(snapshot.profile.publicationVisibility === "unlisted"
          ? { "X-Robots-Tag": "noindex, nofollow" }
          : {}),
      },
    });
  } catch (error) {
    unstable_rethrow(error);
    console.error("CV generation failed.");
    return new Response("The CV is temporarily unavailable. Please try again.", {
      headers: { "Cache-Control": "no-store" },
      status: 503,
    });
  }
}
