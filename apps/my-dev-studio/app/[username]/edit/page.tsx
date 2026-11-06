import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { requireWorkspace } from "@/features/admin/admin-auth";
import { UserStorageSync } from "@/features/admin/user-storage-sync";
import { ProfileEditor } from "@/features/studio";

export const metadata: Metadata = {
  robots: { follow: false, index: false },
  title: "Edit your CV",
};
export default async function EditCvPage({
  params,
  searchParams,
}: {
  params: Promise<{ username: string }>;
  searchParams?: Promise<{ view?: string }>;
}) {
  const { username } = await params;
  const initiallyArranging = (await searchParams)?.view === "arrange";
  let workspace: Awaited<ReturnType<typeof requireWorkspace>>;
  try {
    workspace = await requireWorkspace();
  } catch {
    redirect("/login");
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
      <ProfileEditor initial={snapshot} initiallyArranging={initiallyArranging} />
    </>
  );
}
