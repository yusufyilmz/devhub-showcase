import { redirect } from "next/navigation";

import { requireWorkspace } from "@/features/admin/admin-auth";
import { StudioChat } from "@/features/chat/studio-chat";

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
  return <StudioChat initial={snapshot} />;
}
