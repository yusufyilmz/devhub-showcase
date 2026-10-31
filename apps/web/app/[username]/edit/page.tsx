import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { ProfileEditor } from "@/features/admin/profile-editor";
import { requireWorkspace } from "@/lib/admin-auth";
export const metadata: Metadata = {
  robots: { follow: false, index: false },
  title: "Edit your CV",
};
export default async function EditCvPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  let workspace: Awaited<ReturnType<typeof requireWorkspace>>;
  try {
    workspace = await requireWorkspace();
  } catch {
    redirect("/admin/login");
  }
  const snapshot = await workspace.repository.read();
  if (!snapshot || snapshot.username !== username) notFound();
  return <ProfileEditor initial={snapshot} />;
}
