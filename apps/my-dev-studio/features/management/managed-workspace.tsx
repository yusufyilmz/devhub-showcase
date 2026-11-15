"use client";

import { useRouter } from "next/navigation";

import { ManagedWorkspace as ManagedWorkspaceView } from "@shared/assistant/management-ui";
import type { ProfileSnapshot } from "@shared/lib/profile";

export function ManagedWorkspace({ initial, id }: { initial: ProfileSnapshot; id: string }) {
  const router = useRouter();
  return (
    <ManagedWorkspaceView
      id={id}
      initial={initial}
      onTransferred={() => {
        router.push("/admin/portfolios");
        router.refresh();
      }}
    />
  );
}
