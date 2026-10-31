import { renderCv } from "@shared/cv";
import template from "@shared/cv/template.hbs";
import { unstable_rethrow } from "next/navigation";

import { getPublishedProfile } from "@/lib/published-profile";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const snapshot = await getPublishedProfile();
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
