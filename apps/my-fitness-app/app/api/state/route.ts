import { NextResponse } from "next/server";

import { database } from "@shared/services/db/client";
import { loadLegacyWorkspace } from "@shared/services/fitness";
import {
  InvalidWorkspaceError,
  RevisionConflictError,
  WorkspaceRepository,
  WorkspaceService,
} from "@shared/services/workspace";

import { starterWorkspace } from "@/features/task-workspace/starter";
import { configured, fitnessUser, requestIdentity, sameOrigin } from "@/lib/auth";

export const dynamic = "force-dynamic";
const headers = { "Cache-Control": "private, no-store", Vary: "Authorization, Cookie" };

class SignInRequired extends Error {}
class SetupRequired extends Error {}

async function context(request: Request) {
  if (!configured() || !process.env.SUPABASE_DB_URL)
    throw new SetupRequired("Fitness workspace setup is incomplete.");
  const { user, client } = await requestIdentity(request);
  const account = fitnessUser(user);
  if (!account)
    throw new SignInRequired("Sign in with a confirmed account to open your workspace.");
  const repository = new WorkspaceRepository(
    database(),
    async (id) => (await loadLegacyWorkspace(client, id)) ?? starterWorkspace(),
  );
  return { service: new WorkspaceService(repository), userId: account.id };
}

function failure(error: unknown) {
  const status =
    error instanceof SignInRequired
      ? 401
      : error instanceof SetupRequired
        ? 503
        : error instanceof RevisionConflictError
          ? 409
          : error instanceof InvalidWorkspaceError
            ? 400
            : 500;
  return NextResponse.json(
    {
      error:
        status === 500
          ? "Could not connect to your workspace. Check your connection and database setup."
          : (error as Error).message,
    },
    { headers, status },
  );
}

export async function GET(request: Request) {
  try {
    const { service, userId } = await context(request);
    const snapshot = await service.load(userId);
    return NextResponse.json({ ...snapshot, canEdit: true, workspaceId: userId }, { headers });
  } catch (error) {
    return failure(error);
  }
}

export async function PUT(request: Request) {
  if (!sameOrigin(request)) return new Response(null, { headers, status: 403 });
  try {
    const { service, userId } = await context(request);
    const raw = await request.text();
    if (raw.length > 5000000) return new Response(null, { headers, status: 413 });
    let input: unknown;
    try {
      input = JSON.parse(raw);
    } catch {
      return new Response(null, { headers, status: 400 });
    }
    // The snapshot ID is a precondition. The verified session always selects the row.
    if (
      !input ||
      typeof input !== "object" ||
      !("workspaceId" in input) ||
      input.workspaceId !== userId
    )
      return NextResponse.json(
        { error: "Your session changed. Reload before saving." },
        { headers, status: 409 },
      );
    return NextResponse.json({ revision: await service.save(userId, input) }, { headers });
  } catch (error) {
    return failure(error);
  }
}
