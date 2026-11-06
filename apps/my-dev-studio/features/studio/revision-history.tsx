"use client";
import { useCallback } from "react";

import type { PortfolioProfile } from "@shared/config";
import { urls } from "@shared/config/urls";
import { useStudioRequest } from "@shared/runtime/studio";
import { RevisionHistory } from "@shared/ui/portfolio";
export function OwnerRevisionHistory({
  profile,
  managedId,
  revision,
  onChange,
}: {
  managedId?: string;
  profile: PortfolioProfile;
  revision: number;
  onChange: (profile: PortfolioProfile) => void;
}) {
  const request = useStudioRequest();
  const endpoint = managedId ? urls.studio.managedHistory(managedId) : urls.studio.profileHistory();
  const load = useCallback(async () => {
    const response = await request(endpoint);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data;
  }, [request, endpoint]);
  const read = useCallback(
    async (value: number) => {
      const response = await request(`${endpoint}?revision=${value}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      return data;
    },
    [request, endpoint],
  );
  return (
    <RevisionHistory
      load={load}
      onChange={onChange}
      profile={profile}
      read={read}
      revision={revision}
    />
  );
}
