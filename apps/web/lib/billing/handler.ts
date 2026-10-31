import { AuthAccessError, requireConfirmedUser } from "@shared/auth";
import { createServerClient } from "@shared/lib/supabase";

import { sameOrigin } from "../admin-auth";
import { BillingActionError, billingMessages } from "./errors";

export async function billingPost(request: Request, action: (account: string) => Promise<string>) {
  const headers = { "Cache-Control": "private, no-store" };
  if (!sameOrigin(request))
    return Response.json({ error: "Invalid origin." }, { headers, status: 403 });
  try {
    const user = await requireConfirmedUser(await createServerClient());
    const url = await action(user.id);
    return Response.json({ url }, { headers });
  } catch (error) {
    const code =
      error instanceof AuthAccessError
        ? "sign_in_required"
        : error instanceof BillingActionError
          ? error.code
          : "unavailable";
    return Response.json(
      { code, error: billingMessages[code] },
      { headers, status: error instanceof AuthAccessError ? 403 : 503 },
    );
  }
}
