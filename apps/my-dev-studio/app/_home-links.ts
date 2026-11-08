import { cache } from "react";

import type { PageAction } from "@shared/assistant/sections";
import { cvPath, editCvPath } from "@shared/lib/profiles";
import { readPublicProfile } from "@shared/lib/published-profile";
import { readOwnedProfileUsername } from "@shared/lib/repositories/profile";
import { createServerClient } from "@shared/lib/supabase";

export type { PageAction };

const guest: PageAction = {
  href: "/login",
  label: "Create your portfolio",
  signedIn: false,
};
/** Read session identity without provisioning a workspace on a public page visit. */
export const getHomeAction = cache(async (): Promise<PageAction> => {
  try {
    const client = await createServerClient();
    const {
      data: { user },
      error,
    } = await client.auth.getUser();
    if (error || !user?.email_confirmed_at) return guest;
    const { data, error: profileError } = await readOwnedProfileUsername(client, user.id);
    if (profileError) return { href: "/admin", label: "Open your studio", signedIn: true };
    return {
      href: data?.username ? editCvPath(data.username) : "/admin",
      label: "Open your studio",
      signedIn: true,
    };
  } catch {
    return guest;
  }
});
export const getHomeExample = cache(async () => {
  try {
    const snapshot = await readPublicProfile("main");
    return snapshot?.username ? cvPath(snapshot.username) : null;
  } catch {
    return null;
  }
});
