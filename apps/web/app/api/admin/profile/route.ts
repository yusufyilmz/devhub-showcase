import {
  ProfileAccessError,
  ProfileConflictError,
  ProfileSetupError,
  ProfileUsernameError,
} from "@shared/lib/profile-errors";
import { ZodError } from "zod";

import { requireWorkspace, sameOrigin } from "@/lib/admin-auth";

export async function GET() {
  try {
    const { repository } = await requireWorkspace();
    const snapshot = await repository.read();
    if (!snapshot) throw new ProfileSetupError();
    return Response.json(snapshot, {
      headers: { "Cache-Control": "private, no-store" },
    });
  } catch (error) {
    return failure(error);
  }
}
export async function PUT(request: Request) {
  if (!sameOrigin(request))
    return Response.json({ error: "Invalid request origin." }, { status: 403 });
  try {
    const { user, service } = await requireWorkspace();
    const body = await request.text();
    if (body.length > 250000)
      return Response.json({ error: "The profile is too large." }, { status: 413 });
    let input: unknown;
    try {
      input = JSON.parse(body);
    } catch {
      return Response.json({ error: "Invalid profile data." }, { status: 400 });
    }
    const snapshot = await service.save(user.id, input);
    return Response.json(snapshot, {
      headers: { "Cache-Control": "private, no-store" },
    });
  } catch (error) {
    return failure(error);
  }
}
function failure(error: unknown) {
  if (error instanceof ZodError)
    return Response.json(
      {
        error: error.issues
          .slice(0, 6)
          .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
          .join("\n"),
      },
      { status: 400 },
    );
  if (error instanceof ProfileAccessError)
    return Response.json({ error: error.message }, { status: 403 });
  if (error instanceof ProfileConflictError || error instanceof ProfileUsernameError)
    return Response.json({ error: error.message }, { status: 409 });
  return Response.json(
    { error: "Could not access profile storage. Check setup or try again." },
    { status: 503 },
  );
}
