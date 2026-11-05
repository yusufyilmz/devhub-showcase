import { NextResponse } from "next/server";

import { proposeFitnessChange } from "@shared/assistant/fitness";
import { fitnessAssistantRequest } from "@shared/assistant/fitness-contract";
import { allowFitnessAssistant } from "@shared/cache";

import { assistantContext } from "@/features/assistant/plan-context";
import { SetupRequired, SignInRequired, workspaceContext } from "@/features/task-workspace/server";
import { sameOrigin } from "@/lib/auth";

export const maxDuration = 60;
const headers = { "Cache-Control": "private, no-store" };

function error(message: string, status: number) {
  return NextResponse.json({ error: message }, { headers, status });
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) return error("Request origin is not allowed.", 403);
  try {
    const { service, userId } = await workspaceContext(request);
    const raw = await request.text();
    if (raw.length > 16_000) return error("The request is too large.", 413);
    const input = fitnessAssistantRequest.safeParse(parseJson(raw));
    if (!input.success) return error("Choose a plan and enter a short request.", 400);
    if (!process.env.OPENAI_API_KEY || !process.env.REDIS_URL || !process.env.REDIS_TOKEN)
      return error("Fitness assistants are not configured for this deployment.", 503);

    const snapshot = await service.load(userId);
    if (snapshot.revision !== input.data.revision)
      return error("Your saved plan changed. Reload the workspace and try again.", 409);
    const context = assistantContext(snapshot.state, input.data);
    if (!context) return error("This task is unavailable for the selected assistant.", 404);
    if (!(await allowFitnessAssistant(userId)))
      return error("The assistant attempt limit was reached. Try again later.", 429);

    const proposal = await proposeFitnessChange(input.data.mode, context, request.signal);
    return NextResponse.json(proposal, { headers });
  } catch (failure) {
    if (failure instanceof SignInRequired) return error("Sign in to use the assistant.", 401);
    if (failure instanceof SetupRequired)
      return error("Fitness workspace setup is incomplete.", 503);
    return error("Could not generate a proposal. Try again.", 502);
  }
}

function parseJson(raw: string): unknown {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
