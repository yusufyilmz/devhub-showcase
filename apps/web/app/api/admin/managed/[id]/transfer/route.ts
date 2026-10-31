import { z } from "zod";

import { sameOrigin } from "@/lib/admin-auth";
import { managedFailure, privateHeaders, readManagedBody } from "@/lib/managed-api";
import { managedRepository } from "@/lib/managed-portfolios";

const transferSchema = z.object({
  email: z.email(),
  revision: z.number().int().min(1),
});
export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!sameOrigin(request)) return Response.json({ error: "Invalid origin." }, { status: 403 });
  try {
    const admin = await managedRepository((await context.params).id);
    const input = transferSchema.parse(await readManagedBody(request));
    const { data, error } = await admin.client.rpc("transfer_managed_portfolio", {
      expected_revision: input.revision,
      profile_id: admin.repository.id,
      target_email: input.email,
    });
    if (error)
      return Response.json(
        {
          error: ["22023", "23505", "40001"].includes(error.code)
            ? error.message
            : "Could not transfer this portfolio.",
        },
        { status: 409 },
      );
    return Response.json(data, { headers: privateHeaders });
  } catch (error) {
    return managedFailure(error);
  }
}
