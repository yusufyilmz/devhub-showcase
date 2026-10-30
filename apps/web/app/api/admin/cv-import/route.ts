import { requireConfirmedUser } from "@shared/auth";
import { allowCvImport } from "@shared/cache";
import { CvImportModel } from "@shared/chat";
import { CvImportError, MAX_CV_BYTES, validateCvFile } from "@shared/lib/cv-file";
import { ProfileAccessError } from "@shared/lib/profile-errors";
import { createServerClient } from "@shared/lib/supabase";

import { sameOrigin } from "../../../../lib/admin-auth";

export const runtime = "nodejs";
export const maxDuration = 90;
const headers = { "Cache-Control": "private, no-store" };
function configured() {
  return Boolean(process.env.OPENAI_API_KEY && process.env.REDIS_URL && process.env.REDIS_TOKEN);
}
async function identity() {
  return requireConfirmedUser(await createServerClient(), () => new ProfileAccessError());
}
export async function GET() {
  try {
    await identity();
    return Response.json({ enabled: configured() }, { headers });
  } catch {
    return Response.json({ error: "Sign in to import a CV." }, { headers, status: 403 });
  }
}
/** Bounded before multipart parsing, including chunked requests. */
async function readUpload(request: Request) {
  const reader = request.body?.getReader();
  if (!reader) throw new CvImportError("Choose a CV file.", 400);
  const chunks: Uint8Array[] = [];
  let length = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    length += value.byteLength;
    if (length > MAX_CV_BYTES + 65536) {
      await reader.cancel();
      throw new CvImportError("Choose a CV up to 3 MB.", 413);
    }
    chunks.push(value);
  }
  const body = new Response(Buffer.concat(chunks), {
    headers: { "Content-Type": request.headers.get("Content-Type") ?? "" },
  });
  let form: FormData;
  try {
    form = await body.formData();
  } catch {
    throw new CvImportError("Invalid upload. Choose the CV again.", 400);
  }
  const file = form.get("cv");
  if (!(file instanceof File) || form.getAll("cv").length !== 1)
    throw new CvImportError("Choose one CV file.", 400);
  return validateCvFile(file);
}
export async function POST(request: Request) {
  if (!sameOrigin(request))
    return Response.json({ error: "Invalid request origin." }, { headers, status: 403 });
  try {
    const user = await identity();
    if (!configured())
      throw new CvImportError(
        "CV import is not configured yet. You can still enter your details manually.",
        503,
      );
    const file = await readUpload(request);
    if (!(await allowCvImport(user.id)))
      throw new CvImportError(
        "CV import limit reached. Please try later. You can make up to three attempts per hour.",
        429,
      );
    const result = await new CvImportModel().extract(
      file,
      AbortSignal.any([request.signal, AbortSignal.timeout(60000)]),
    );
    return Response.json(result, { headers });
  } catch (error) {
    if (error instanceof ProfileAccessError)
      return Response.json({ error: "Sign in to import a CV." }, { headers, status: 403 });
    if (error instanceof CvImportError)
      return Response.json({ error: error.message }, { headers, status: error.status });
    return Response.json(
      { error: "CV processing is unavailable. Try again later or enter your details manually." },
      { headers, status: 503 },
    );
  }
}
