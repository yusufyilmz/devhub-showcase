"use client";
import { useCallback, useMemo } from "react";

import type { PortfolioProfile } from "@shared/config";
import { urls } from "@shared/config/urls";
import { useStudioRequest } from "@shared/runtime/studio";
import { PublicationControls } from "@shared/ui/portfolio";

export function ProfilePublication({
  id,
  profile,
  managed,
  revision,
  dirty,
  disabled,
  onChanged,
}: {
  id?: string;
  profile: PortfolioProfile;
  managed: boolean;
  revision: number;
  dirty: boolean;
  disabled: boolean;
  onChanged: (published: boolean) => void;
}) {
  const request = useStudioRequest();
  const endpoint =
    managed && id ? urls.next.studio.managedPublication(id) : urls.next.studio.publication();
  const load = useCallback(async () => {
    const response = await request(endpoint);
    const result = await response.json();
    if (!response.ok) throw new Error(result.error);
    return result;
  }, [request, endpoint]);
  const change = useCallback(
    async (publish: boolean, revision: number, password?: string) => {
      const response = await request(endpoint, {
        body: JSON.stringify({ publish, revision, ...(password ? { password } : {}) }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
    },
    [request, endpoint],
  );
  const scheduling = useMemo(() => {
    const scheduleEndpoint = `${endpoint}/schedule`;
    async function operation(method: string, body?: unknown) {
      const response = await request(scheduleEndpoint, {
        method,
        ...(body === undefined
          ? {}
          : { body: JSON.stringify(body), headers: { "Content-Type": "application/json" } }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      return result.result;
    }
    return {
      cancel: async (scheduleId: string) => {
        await operation("DELETE", { scheduleId });
      },
      create: async (runAt: string, timezone: string, revision: number) => {
        await operation("POST", { revision, runAt, timezone });
      },
      load: () => operation("GET"),
    };
  }, [endpoint, request]);
  return (
    <PublicationControls
      change={change}
      dirty={dirty}
      disabled={disabled}
      key={revision}
      load={load}
      onChanged={onChanged}
      profile={profile}
      revision={revision}
      scheduling={scheduling}
    />
  );
}
