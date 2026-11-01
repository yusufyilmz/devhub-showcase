import { redirect } from "next/navigation";

import { editCvPath } from "@shared/lib/profiles";
import type { ProfileSnapshot } from "@shared/services/profile";

import { requireWorkspace } from "@/features/admin/admin-auth";

export default async function AdminPage() {
  let snapshot: ProfileSnapshot | null;
  try {
    const { repository } = await requireWorkspace();
    snapshot = await repository.read();
  } catch {
    redirect("/login");
  }
  if (!snapshot?.username) redirect("/login?error=setup");
  redirect(editCvPath(snapshot.username));
}
