import { cache } from "react";

import { cvPath, editCvPath } from "@shared/lib/profiles";
import { readPublicProfile } from "@shared/lib/published-profile";
import { readOwnedProfileUsername } from "@shared/lib/repositories/profile";
import { createServerClient } from "@shared/lib/supabase";
import type { SupabaseDbClient } from "@shared/lib/types";
import type { PageAction } from "@shared/ui/home-section";

export type { PageAction };

type HomeAction = PageAction & { username?: string };
type HomeSession = { action: HomeAction; client: SupabaseDbClient | null };

const guest: HomeAction = {
  href: "/login",
  label: "Create your portfolio",
  signedIn: false,
};

/**
 * Keep the verified server client in request-local cache so the account menu
 * can check administrator status without requesting the identity a second time.
 * Only the action is passed to client components.
 */
export const getHomeSession = cache(async (): Promise<HomeSession> => {
  try {
    const client = await createServerClient();
    const {
      data: { user },
      error,
    } = await client.auth.getUser();
    if (error || !user?.email_confirmed_at) return { action: guest, client: null };

    const { data, error: profileError } = await readOwnedProfileUsername(client, user.id);
    if (profileError)
      return {
        action: { href: "/studio", label: "Open your studio", signedIn: true },
        client,
      };

    return {
      action: {
        href: data?.username ? editCvPath(data.username) : "/studio",
        label: "Open your studio",
        signedIn: true,
        username: data?.username ?? undefined,
      },
      client,
    };
  } catch {
    return { action: guest, client: null };
  }
});

/** Read the public-safe action without exposing the authenticated client. */
export const getHomeAction = cache(
  async (): Promise<HomeAction> => (await getHomeSession()).action,
);

export const getHomeExample = cache(async () => {
  try {
    const snapshot = await readPublicProfile("main");
    return snapshot?.username ? cvPath(snapshot.username) : null;
  } catch {
    return null;
  }
});
