import { ProfileAccessError } from "@shared/services/profile";

import { requireWorkspace } from "@/features/admin/admin-auth";
import { cvResponse } from "@/features/portfolio/cv/cv-response";

export const runtime = "nodejs";

export const dynamic = "force-dynamic";

export async function GET(_request: Request) {
  try {
    const { repository } = await requireWorkspace();
    const snapshot = await repository.read();
    if (!snapshot) throw new Error("Missing profile");
    return await cvResponse(snapshot);
  } catch (error) {
    return new Response(
      error instanceof ProfileAccessError
        ? "Sign in to download your saved CV."
        : "CV storage is temporarily unavailable.",
      {
        headers: { "Cache-Control": "private, no-store" },
        status: error instanceof ProfileAccessError ? 403 : 503,
      },
    );
  }
}
