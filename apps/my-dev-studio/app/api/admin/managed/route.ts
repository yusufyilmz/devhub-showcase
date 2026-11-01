import { z } from "zod";

import { profileSchema } from "@shared/lib/profile";
import { usernameSchema } from "@shared/lib/username";

import { sameOrigin } from "@/features/admin/admin-auth";
import { managedFailure, privateHeaders, readManagedBody } from "@/features/management/managed-api";
import { createManaged, requirePortfolioAdmin } from "@/features/management/managed-portfolios";

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
