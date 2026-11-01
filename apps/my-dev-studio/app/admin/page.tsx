import { redirect } from "next/navigation";

import type { ProfileSnapshot } from "@shared/lib/profile-errors";
import { editCvPath } from "@shared/lib/username";

import { requireWorkspace } from "@/features/admin/admin-auth";

export default async function AdminPage() {
  let snapshot: ProfileSnapshot | null;
  try {
    const { repository } = await requireWorkspace();
    snapshot = await repository.read();
  } catch {
    redirect("/admin/login");
  }
  if (!snapshot?.username) redirect("/admin/login?error=setup");
  redirect(editCvPath(snapshot.username));
}
