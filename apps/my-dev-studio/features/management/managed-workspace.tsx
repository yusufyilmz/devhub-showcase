"use client";

import { useRouter } from "next/navigation";

import { ManagedWorkspace as ManagedWorkspaceView } from "@shared/components/studio";
import type { ProfileSnapshot } from "@shared/lib/profile-errors";

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
