import { ZodError } from "zod";

import { ProfileAccessError } from "@shared/lib/profile";

import { requireWorkspace } from "@/features/admin/admin-auth";

import { JobsError, jobCv } from "../_workspace";

export async function GET(request: Request) {
  try {
    return await jobCv(await requireWorkspace(), new URL(request.url).searchParams.get("job"));
  } catch (error) {
    const status =
      error instanceof JobsError
        ? error.status
        : error instanceof ProfileAccessError
          ? 403
          : error instanceof ZodError
            ? 400
            : 503;
    const message = error instanceof JobsError ? error.message : "Private CV unavailable.";
    return Response.json(
      { error: message },
      { headers: { "Cache-Control": "private, no-store" }, status },
    );
  }
}
