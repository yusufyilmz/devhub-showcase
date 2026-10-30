import { readPublicProfile } from "@shared/lib/published-profile";
import { createServerClient } from "@shared/lib/supabase";
import { cvPath, editCvPath } from "@shared/lib/username";
import { cache } from "react";

export type HomeAction = { href: string; label: string; signedIn: boolean };
const guest: HomeAction = {
  href: "/admin/login",
  label: "Create your portfolio",
  signedIn: false,
};
/** Read session identity without provisioning a workspace on a public page visit. */
export const getHomeAction = cache(async (): Promise<HomeAction> => {
  try {
    const client = await createServerClient();
    const {
      data: { user },
      error,
    } = await client.auth.getUser();
    if (error || !user?.email_confirmed_at) return guest;
    const { data, error: profileError } = await client
      .from("portfolio_profiles")
      .select("username")
      .eq("owner_id", user.id)
      .maybeSingle();
    if (profileError)
      return { href: "/admin", label: "Open your studio", signedIn: true };
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
