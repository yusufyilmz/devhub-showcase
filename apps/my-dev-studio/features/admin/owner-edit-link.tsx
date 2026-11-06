import { editCvPath } from "@shared/lib/profiles";
import { createServerClient } from "@shared/lib/supabase";
import { EditIcon, GripVerticalIcon } from "@shared/ui/icons";

const editLinkClass =
  "icon-button inline-flex h-10 w-10 items-center justify-center rounded-md bg-[var(--primary)] text-sm font-medium text-[var(--primary-foreground)] ring-offset-[var(--background)] transition-colors hover:bg-[var(--primary)]/90 focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:outline-none";

export async function OwnerEditLink({
  username,
  floating = true,
  offset = false,
}: {
  username: string;
  floating?: boolean;
  offset?: boolean;
}) {
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
  const href = editCvPath(username);
  const links = (
    <div className="flex gap-2">
      <a aria-label="Edit my CV" className={editLinkClass} href={href}>
        <EditIcon fontSize="xlarge" />
      </a>
      <a
        aria-label="Arrange portfolio sections"
        className={editLinkClass}
        href={`${href}?view=arrange#portfolio-draft-preview`}
        title="Arrange portfolio sections"
      >
        <GripVerticalIcon aria-hidden="true" size={20} />
      </a>
    </div>
  );
  if (!floating) return links;
  return (
    <div className={`fixed right-8 z-[200] ${offset ? "bottom-28" : "bottom-8"}`}>{links}</div>
  );
}
