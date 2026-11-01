import { AuthAccessError, type AuthClient, requireConfirmedUser, sameOrigin } from "@shared/auth";

import { billingMessages } from "../constants/messages";
import { BillingActionError } from "../index";

export async function billingPost(
  request: Request,
  action: (account: string) => Promise<string>,
  createClient: () => Promise<AuthClient>,
) {
  const headers = { "Cache-Control": "private, no-store" };
  if (!sameOrigin(request))
    return Response.json({ error: "Invalid origin." }, { headers, status: 403 });
  try {
    const user = await requireConfirmedUser(await createClient());
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
