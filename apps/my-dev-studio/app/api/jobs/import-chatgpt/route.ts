import { ZodError } from "zod";

import { ProfileAccessError } from "@shared/lib/profile";

import { requireWorkspace, sameOrigin } from "@/services/admin/get-auth";
import { importChatgptResearch } from "@/services/jobs/import-chatgpt";

const headers = { "Cache-Control": "private, no-store" };
export const maxDuration = 60;

export async function POST(request: Request) {
  if (!sameOrigin(request))
    return Response.json({ error: "Invalid origin." }, { headers, status: 403 });

  try {
    const workspace = await requireWorkspace();
    const body = await request.text();
    if (body.length > 20_000)
      return Response.json({ error: "Report is too large." }, { headers, status: 413 });

    const result = await importChatgptResearch(
      workspace,
      JSON.parse(body),
      new URL(request.url).searchParams.get("preview") === "1",
    );
    return Response.json(result, { headers });
  } catch (error) {
    if (error instanceof ProfileAccessError)
      return Response.json({ error: "Sign in to import jobs." }, { headers, status: 403 });
    if (error instanceof ZodError || error instanceof SyntaxError)
      return Response.json({ error: "Invalid ChatGPT report format." }, { headers, status: 400 });
    if (error instanceof Error && error.message === "Duplicate job URL in one report.")
      return Response.json({ error: error.message }, { headers, status: 400 });
    return Response.json({ error: "Job import is unavailable." }, { headers, status: 503 });
  }
}
