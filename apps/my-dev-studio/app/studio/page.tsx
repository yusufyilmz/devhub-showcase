import { redirect } from "next/navigation";

import { editCvPath } from "@shared/lib/profiles";

import { readWorkspaceSnapshot } from "@/services/admin/get-auth";

export default async function AdminPage() {
  let snapshot;
  try {
    snapshot = await readWorkspaceSnapshot();
  } catch {
    redirect("/login");
  }
  if (!snapshot?.username) redirect("/login?error=setup");
  redirect(editCvPath(snapshot.username));
}
