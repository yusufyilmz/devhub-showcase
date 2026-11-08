import { notFound, permanentRedirect, redirect } from "next/navigation";
import { cache } from "react";

import {
  readPortfolioAccessStatus,
  readPublicProfile,
  readPublicProfileByUsername,
  resolvePublishedUsername,
} from "@shared/lib/published-profile";

import { readProtectedProfile } from "./access/_session";

export const getPublicProfile = cache(async (id: string) => {
  const snapshot = (await readPublicProfile(id)) ?? (await readProtectedProfile(id));
  if (!snapshot) notFound();
  return snapshot;
});

export const getUsernameProfile = cache(
  async (username: string, suffix: "" | "/cv.pdf" | "/icon.svg" | "/share.png" = "") => {
    const snapshot = await readPublicProfileByUsername(username);
    if (!snapshot) {
      const gate = await readPortfolioAccessStatus(username);
      if (gate) {
        const protectedSnapshot = await readProtectedProfile(gate.id);
        if (protectedSnapshot) return protectedSnapshot;
        if (!suffix) redirect(`/${encodeURIComponent(username)}/access`);
        notFound();
      }
      const alias = await resolvePublishedUsername(username);
      if (alias && alias.username !== username)
        permanentRedirect(`/${encodeURIComponent(alias.username)}${suffix}`);
      notFound();
    }
    return snapshot;
  },
);
