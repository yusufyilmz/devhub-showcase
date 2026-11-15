import { renderCv } from "@shared/assistant/cv";
import template from "@shared/assistant/cv.hbs";
import { AuthAccessError, requireConfirmedUser } from "@shared/auth";
import { cvLibrarySchema } from "@shared/lib/profiles";
import { createServerClient } from "@shared/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const headers = { "Cache-Control": "private, no-store" };
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const client = await createServerClient();
    const user = await requireConfirmedUser(client);
    const result = await client
      .from("portfolio_cv_variants")
      .select("variants,revision")
      .eq("owner_id", user.id)
      .maybeSingle();
    if (result.error) throw new Error("storage");
    const variant = cvLibrarySchema
      .parse(result.data?.variants ?? [])
      .find((item) => item.id === id);
    if (!variant) return new Response("CV version not found.", { headers, status: 404 });
    const bytes = await renderCv(variant.profile, template, undefined, variant.order);
    const filename = variant.name.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 90);
    return new Response(new Uint8Array(bytes), {
      headers: {
        ...headers,
        "Content-Disposition": `attachment; filename="${filename}.pdf"`,
        "Content-Type": "application/pdf",
        "X-Content-Type-Options": "nosniff",
        "X-CV-Library-Revision": String(result.data?.revision),
      },
    });
  } catch (error) {
    return new Response("CV version unavailable.", {
      headers,
      status: error instanceof AuthAccessError ? 403 : 503,
    });
  }
}
