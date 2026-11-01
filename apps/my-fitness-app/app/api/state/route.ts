import { NextResponse } from "next/server";

import { database } from "@shared/services/db/client";
import { loadLegacyWorkspace } from "@shared/services/fitness";
import {
  InvalidWorkspaceError,
  OwnerAccessRequiredError,
  RevisionConflictError,
  WorkspaceAccessService,
  WorkspaceNotPublishedError,
  WorkspaceRepository,
  WorkspaceService,
} from "@shared/services/workspace";

import { configured, requestIdentity, sameOrigin, workspaceOwnerId } from "@/lib/auth";

export const dynamic = "force-dynamic";
const headers = { "Cache-Control": "private, no-store", Vary: "Authorization" };
async function context(request: Request) {
  if (!configured() || !process.env.SUPABASE_DB_URL || !process.env.WORKSPACE_OWNER_ID) return null;
  const ownerId = workspaceOwnerId();
  const { user, client } = await requestIdentity(request);
  const repo = new WorkspaceRepository(database(), (id) => loadLegacyWorkspace(client, id));
  return {
    access: new WorkspaceAccessService(ownerId, repo),
    service: new WorkspaceService(repo),
    user,
  };
}
function failure(error: unknown) {
  const status =
    error instanceof OwnerAccessRequiredError
      ? 403
      : error instanceof WorkspaceNotPublishedError
        ? 404
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
    const ctx = await context(request);
    if (!ctx)
      return NextResponse.json(
        { error: "Configure Supabase and WORKSPACE_OWNER_ID first." },
        { headers, status: 503 },
      );
    const canEdit = ctx.access.canEdit(ctx.user?.id);
    const snapshot = canEdit
      ? await ctx.service.load(ctx.access.requireOwner(ctx.user?.id))
      : await ctx.access.readShared();
    return NextResponse.json({ ...snapshot, canEdit }, { headers });
  } catch (error) {
    return failure(error);
  }
}
export async function PUT(request: Request) {
  if (!sameOrigin(request)) return new Response(null, { headers, status: 403 });
  try {
    const ctx = await context(request);
    if (!ctx) return new Response(null, { headers, status: 503 });
    const ownerId = ctx.access.requireOwner(ctx.user?.id);
    const raw = await request.text();
    if (raw.length > 5000000) return new Response(null, { headers, status: 413 });
    let input: unknown;
    try {
      input = JSON.parse(raw);
    } catch {
      return new Response(null, { headers, status: 400 });
    }
    return NextResponse.json({ revision: await ctx.service.save(ownerId, input) }, { headers });
  } catch (error) {
    return failure(error);
  }
}
