import { sameOrigin } from "../../../../../lib/admin-auth";
import { managedFailure, privateHeaders, readManagedBody } from "../../../../../lib/managed-api";
import { requirePortfolioAdmin, saveManaged } from "../../../../../lib/managed-portfolios";
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
