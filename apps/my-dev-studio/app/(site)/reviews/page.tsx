import { redirect } from "next/navigation";

import { editCvPath } from "@shared/lib/profiles";

import { requireAdmin } from "@/services/admin/get-auth";

export default async function ReviewsPage() {
  const workspace = await requireAdmin().catch(() => null);
  if (!workspace) redirect("/login");

  const snapshot = await workspace.repository.read();
  if (!snapshot?.username) redirect("/studio");

  redirect(`${editCvPath(snapshot.username)}?tab=reviews`);
}
