"use client";

import { useRouter } from "next/navigation";

import type { ProfileSnapshot } from "@shared/lib/profile-errors";

import { ManagedWorkspace as ManagedWorkspaceView } from "@/features/studio";

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
