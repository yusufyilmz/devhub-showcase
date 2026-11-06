import { redirect } from "next/navigation";

import { editCvPath } from "@shared/lib/profiles";

import { requireAdmin } from "@/features/admin/admin-auth";

export default async function ReviewsPage() {
  const workspace = await requireAdmin().catch(() => null);
  if (!workspace) redirect("/login");

  const snapshot = await workspace.repository.read();
  if (!snapshot?.username) redirect("/admin");

  redirect(`${editCvPath(snapshot.username)}?tab=reviews`);
}
