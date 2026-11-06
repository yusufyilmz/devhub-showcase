import { sameOrigin } from "@shared/auth";
import { createServerClient } from "@shared/lib/supabase";
import { companionProgressHandlers } from "@shared/services/companion-progress";

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
