import { redirect } from "next/navigation";

import { StudioChat } from "@shared/assistant/studio-chat";

import { requireWorkspace } from "@/services/admin/get-auth";
import { getAccountMenu } from "@/services/home/get-account-menu";

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
  if (!snapshot) redirect("/studio");
  return (
    <StudioChat accountMenu={await getAccountMenu({ protectDraft: true })} initial={snapshot} />
  );
}
