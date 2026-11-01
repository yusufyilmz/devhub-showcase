import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { ProfileEditor } from "@shared/components/studio";

import { requireWorkspace } from "@/features/admin/admin-auth";
import { UserStorageSync } from "@/features/admin/user-storage-sync";

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
  return (
    <>
      <UserStorageSync
        user={{
          id: workspace.user.id,
          name: snapshot.profile.name,
          ...(workspace.user.email ? { email: workspace.user.email } : {}),
        }}
      />
      <ProfileEditor initial={snapshot} />
    </>
  );
}
