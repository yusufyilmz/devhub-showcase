import { ZodError } from "zod";

import { allowJobResearchImport } from "@shared/lib/cache";
import { ProfileAccessError } from "@shared/lib/profile";
import { chatgptImportIssues, parseChatgptJobImport } from "@shared/lib/services/jobs";

import { requireWorkspace, sameOrigin } from "@/services/admin/get-auth";
import { chatgptImportEnabled } from "@/services/jobs/get-config";
import { importChatgptResearch } from "@/services/jobs/import-chatgpt";

const headers = { "Cache-Control": "private, no-store" };
export const maxDuration = 60;

function json(body: object, status: number) {
  return Response.json(body, { headers, status });
}

function rejectedReport(error: unknown) {
  if (error instanceof ProfileAccessError) return json({ error: "Sign in to import jobs." }, 403);
  if (error instanceof SyntaxError) {
    return json(
      {
        error: "Invalid ChatGPT report format.",
        fields: [{ message: "Enter valid JSON.", path: "report" }],
      },
      400,
    );
  }
  const fields = chatgptImportIssues(error);
  if (error instanceof ZodError || fields.length > 0) {
    return json({ error: "Invalid ChatGPT report format.", fields }, 400);
  }
  return json({ error: "Job import is unavailable." }, 503);
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) return json({ error: "Invalid origin." }, 403);
  if (!chatgptImportEnabled()) return json({ error: "ChatGPT import is turned off." }, 404);

  try {
    const workspace = await requireWorkspace();
    const body = await request.text();
    if (body.length > 20_000) return json({ error: "Report is too large." }, 413);
    if (!(await allowJobResearchImport(workspace.user.id))) {
      return json({ error: "Too many import attempts. Try again later." }, 429);
    }
    const payload = JSON.parse(body);
    parseChatgptJobImport(payload);
    const result = await importChatgptResearch(
      workspace,
      payload,
      new URL(request.url).searchParams.get("preview") === "1",
    );
    return json(result, 200);
  } catch (error) {
    return rejectedReport(error);
  }
}
