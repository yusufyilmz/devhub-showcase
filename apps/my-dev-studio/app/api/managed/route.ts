import { z } from "zod";

import { profileSchema, usernameSchema } from "@shared/lib/profiles";

import { sameOrigin } from "@/services/admin/get-auth";
import { managedFailure, privateHeaders, readManagedBody } from "@/services/management/get-api";
import { createManaged, requirePortfolioAdmin } from "@/services/management/get-portfolios";

const inputSchema = z.object({
  profile: profileSchema,
  username: usernameSchema,
});
export async function POST(request: Request) {
  if (!sameOrigin(request)) return Response.json({ error: "Invalid origin." }, { status: 403 });
  try {
    const admin = await requirePortfolioAdmin();
    const input = inputSchema.parse(await readManagedBody(request));
    return Response.json(await createManaged(admin, input.username, input.profile), {
      headers: privateHeaders,
      status: 201,
    });
  } catch (error) {
    return managedFailure(error);
  }
}
