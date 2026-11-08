import { sameOrigin } from "@shared/auth";
import { companionProgressHandlers } from "@shared/lib/companion-progress";
import { createServerClient } from "@shared/lib/supabase";

export const { GET, POST } = companionProgressHandlers({
  app: "studio",
  async identify() {
    const client = await createServerClient();
    const { data, error } = await client.auth.getUser();
    const user = data.user;
    return { client, user: !error && user?.email_confirmed_at && !user.is_anonymous ? user : null };
  },
  sameOrigin,
});
