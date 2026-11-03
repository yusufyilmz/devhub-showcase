"use client";
import { useCallback } from "react";

import type { PortfolioProfile } from "@shared/config";
import { urls } from "@shared/config/urls";
import { useStudioRequest } from "@shared/runtime/studio";
import { RevisionHistory } from "@shared/ui/portfolio";
export function OwnerRevisionHistory({
  profile,
  revision,
  onChange,
}: {
  profile: PortfolioProfile;
  revision: number;
  onChange: (profile: PortfolioProfile) => void;
}) {
  const request = useStudioRequest();
  const load = useCallback(async () => {
    const response = await request(urls.next.studio.profileHistory());
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data;
  }, [request]);
  const read = useCallback(
    async (value: number) => {
      const response = await request(`${urls.next.studio.profileHistory()}?revision=${value}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      return data;
    },
    [request],
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
