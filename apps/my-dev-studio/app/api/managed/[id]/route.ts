import { readPublicProfile } from "@shared/lib/published-profile";

import { sameOrigin } from "@/services/admin/get-auth";
import { managedFailure, privateHeaders, readManagedBody } from "@/services/management/get-api";
import {
  managedRepository,
  requirePortfolioAdmin,
  saveManaged,
} from "@/services/management/get-portfolios";

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!sameOrigin(request)) return Response.json({ error: "Invalid origin." }, { status: 403 });
  try {
    await requirePortfolioAdmin();
    const saved = await saveManaged((await context.params).id, await readManagedBody(request));
    return Response.json(saved, { headers: privateHeaders });
  } catch (error) {
    return managedFailure(error);
  }
}

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { repository } = await managedRepository((await context.params).id);
    const snapshot = await repository.read();
    const publishedSnapshot =
      new URL(request.url).searchParams.get("knowledge") === "1" && snapshot?.id
        ? await readPublicProfile(snapshot.id)
        : undefined;
    return snapshot
      ? Response.json(
          { ...snapshot, ...(publishedSnapshot === undefined ? {} : { publishedSnapshot }) },
          { headers: privateHeaders },
        )
      : Response.json({ error: "Portfolio not found." }, { headers: privateHeaders, status: 404 });
  } catch (error) {
    return managedFailure(error);
  }
}
