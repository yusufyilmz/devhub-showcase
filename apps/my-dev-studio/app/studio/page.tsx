import { redirect } from "next/navigation";

import type { ProfileSnapshot } from "@shared/lib/profile";
import { editCvPath } from "@shared/lib/profiles";

import { readWorkspaceSnapshot } from "@/services/admin/get-auth";

export default async function AdminPage() {
  let snapshot: ProfileSnapshot | null;
  try {
    snapshot = await readWorkspaceSnapshot();
  } catch {
    redirect("/login");
  }
  if (!snapshot?.username) redirect("/login?error=setup");
  redirect(editCvPath(snapshot.username));
}
