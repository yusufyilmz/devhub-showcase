import { ZodError } from "zod";

import { ProfileAccessError } from "@shared/lib/profile";

import { requireWorkspace, sameOrigin } from "@/features/admin/admin-auth";

import { changeJobs, JobsError, loadJobs } from "./_workspace";

const headers = { "Cache-Control": "private, no-store" };
function failure(error: unknown) {
  if (error instanceof JobsError)
    return Response.json({ error: error.message }, { headers, status: error.status });
  if (error instanceof ProfileAccessError)
    return Response.json({ error: "Sign in to use Job Hunter." }, { headers, status: 403 });
  if (error instanceof ZodError || error instanceof SyntaxError) {
    const message = error instanceof ZodError ? error.issues[0]?.message : "Invalid request.";
    return Response.json({ error: message }, { headers, status: 400 });
  }
  return Response.json(
    { error: "Job Hunter is unavailable. Try again." },
    { headers, status: 503 },
  );
}

export const maxDuration = 60;
export async function GET() {
  try {
    return Response.json(await loadJobs(await requireWorkspace()), { headers });
  } catch (error) {
    return failure(error);
  }
}

export async function POST(request: Request) {
  if (!sameOrigin(request))
    return Response.json({ error: "Invalid origin." }, { headers, status: 403 });
  try {
    const workspace = await requireWorkspace();
    const body = await request.text();
    if (body.length > 20_000)
      return Response.json({ error: "Request is too large." }, { headers, status: 413 });
    const signal = AbortSignal.any([request.signal, AbortSignal.timeout(40_000)]);
    return Response.json(await changeJobs(workspace, JSON.parse(body), signal), { headers });
  } catch (error) {
    return failure(error);
  }
}
