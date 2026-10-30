import { cache } from "react";

import { headers } from "next/headers";

import { requireWorkspace } from "./admin-auth";
import { getPublicProfile, getUsernameProfile } from "./public-profile";
import { getPublishedProfile } from "./published-profile";
export const getActiveProfile = cache(async () => {
  const path = (await headers()).get("x-profile-path") ?? "/";
  const match = path.match(/^\/p\/([^/]+)(?:\/|$)/);
  if (match?.[1]) return getPublicProfile(match[1]);
  if (path === "/admin" || /^\/[^/]+\/edit$/.test(path)) {
    try {
      const { repository } = await requireWorkspace();
      const snapshot = await repository.read();
      if (snapshot) return snapshot;
    } catch {
      /* The editor page handles authentication/setup failures. */
    }
    return null;
  }
  const username = path.match(/^\/([a-z0-9-]+)\/?$/)?.[1];
  if (username && !["admin", "reviews"].includes(username)) return getUsernameProfile(username);
  return getPublishedProfile();
});
