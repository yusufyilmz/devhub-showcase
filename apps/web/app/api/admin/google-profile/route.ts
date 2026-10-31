import { googleProfileCategories } from "@shared/auth/google-profile-scopes";
import { ProfileAccessError } from "@shared/lib/profile-errors";
import { ZodError, z } from "zod";

import { requireWorkspace, sameOrigin } from "@/lib/admin-auth";
import { boundedText, googleProfileClientId, readGoogleProfile } from "@/lib/google-profile-import";

export const maxDuration = 30;
const headers = { "Cache-Control": "private, no-store" };
const inputSchema = z
  .object({
    categories: z
      .array(z.enum(googleProfileCategories))
      .min(1)
      .max(5)
      .refine((values) => new Set(values).size === values.length),
    token: z
      .string()
      .min(10)
      .max(4096)
      .regex(/^[A-Za-z0-9._~+/-]+=*$/),
  })
  .strict();
export async function GET() {
  try {
    await requireWorkspace();
    const clientId = googleProfileClientId();
    return Response.json({ clientId, enabled: Boolean(clientId) }, { headers });
  } catch (error) {
    return failure(error);
  }
}
export async function POST(request: Request) {
  if (!sameOrigin(request))
    return Response.json({ error: "Invalid origin." }, { headers, status: 403 });
  try {
    await requireWorkspace();
    if (!googleProfileClientId()) throw new Error("Unavailable");
    const input = inputSchema.parse(JSON.parse(await boundedText(request, 12000)));
    const review = await readGoogleProfile(
      input.token,
      input.categories,
      AbortSignal.any([request.signal, AbortSignal.timeout(15000)]),
    );
    return Response.json(review, { headers });
  } catch (error) {
    return failure(error);
  }
}
function failure(error: unknown) {
  if (error instanceof ProfileAccessError)
    return Response.json(
      { error: "Sign in to import your own Google profile." },
      { headers, status: 403 },
    );
  if (error instanceof RangeError)
    return Response.json({ error: "Google import is too large." }, { headers, status: 413 });
  if (error instanceof ZodError || error instanceof SyntaxError)
    return Response.json(
      { error: "Could not read those profile details. Review your choices and try again." },
      { headers, status: 400 },
    );
  return Response.json(
    {
      error:
        "Google profile import is unavailable. Permission may be denied or expired, or the service may need setup. Your draft has not changed.",
    },
    { headers, status: 503 },
  );
}
