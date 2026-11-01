import { redirect } from "next/navigation";

import { requireWorkspace } from "@/features/admin/admin-auth";
import { ProfileEditor } from "@/features/studio";

export const metadata = {
  robots: { follow: false, index: false },
  title: "Studio assistant",
};

export default async function ChatPage() {
  let workspace: Awaited<ReturnType<typeof requireWorkspace>>;
  try {
    workspace = await requireWorkspace();
  } catch {
    redirect("/login");
  }
  const snapshot = await workspace.repository.read();
  if (!snapshot) redirect("/admin");
  return <ProfileEditor initial={snapshot} initialTab="AI assistant" />;
}
