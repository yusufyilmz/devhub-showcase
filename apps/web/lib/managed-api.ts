import {
  ProfileAccessError,
  ProfileConflictError,
  ProfileUsernameError,
} from "@shared/lib/profile-errors";
import { ZodError } from "zod";

export async function readManagedBody(request: Request): Promise<unknown> {
  const text = await request.text();
  if (text.length > 250000) throw new Error("size");
  try {
    return JSON.parse(text);
  } catch {
    throw new SyntaxError("Invalid JSON");
  }
}
export function managedFailure(error: unknown) {
  if (error instanceof ProfileAccessError)
    return Response.json({ error: "Administrator access required." }, { status: 403 });
  if (error instanceof ZodError)
    return Response.json(
      {
        error: error.issues
          .slice(0, 5)
          .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
          .join("\n"),
      },
      { status: 400 },
    );
  if (error instanceof SyntaxError)
    return Response.json({ error: "Invalid JSON." }, { status: 400 });
  if (error instanceof ProfileConflictError || error instanceof ProfileUsernameError)
    return Response.json({ error: error.message }, { status: 409 });
  if (error instanceof Error && error.message === "size")
    return Response.json({ error: "The import is too large." }, { status: 413 });
  return Response.json(
    {
      error: "Could not access managed portfolios. Check setup and try again.",
    },
    { status: 503 },
  );
}
export const privateHeaders = { "Cache-Control": "private, no-store" };
