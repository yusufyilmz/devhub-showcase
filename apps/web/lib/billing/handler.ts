import { AuthAccessError, requireConfirmedUser } from "@shared/auth";
import { createServerClient } from "@shared/lib/supabase";

import { sameOrigin } from "../admin-auth";

export async function billingPost(request: Request, action: (account: string) => Promise<string>) {
  const headers = { "Cache-Control": "private, no-store" };
  if (!sameOrigin(request))
    return Response.json({ error: "Invalid origin." }, { headers, status: 403 });
  try {
    const user = await requireConfirmedUser(await createServerClient());
    const url = await action(user.id);
    return Response.json({ url }, { headers });
  } catch (error) {
    return Response.json(
      { error: "Billing is unavailable. Please retry or check setup." },
      { headers, status: error instanceof AuthAccessError ? 403 : 503 },
    );
  }
}
