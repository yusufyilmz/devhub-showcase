import { createServerClient } from "@shared/lib/supabase";
import { editCvPath } from "@shared/lib/username";
export async function OwnerEditLink({ username }: { username: string }) {
  const client = await createServerClient();
  const {
    data: { user },
  } = await client.auth.getUser();
  if (!user?.email_confirmed_at) return null;
  const { data, error } = await client
    .from("portfolio_profiles")
    .select("id")
    .eq("owner_id", user.id)
    .eq("username", username)
    .maybeSingle();
  if (error || !data) return null;
  return (
    <div className="portfolio-inner">
      <a className="studio-secondary" href={editCvPath(username)}>
        Edit my CV
      </a>
    </div>
  );
}
