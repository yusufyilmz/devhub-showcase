import { notFound, permanentRedirect } from "next/navigation";
import { cache } from "react";

import {
  readPublicProfile,
  readPublicProfileByUsername,
  resolvePublishedUsername,
} from "@shared/services/published-profile";

export const getPublicProfile = cache(async (id: string) => {
  const snapshot = await readPublicProfile(id);
  if (!snapshot) notFound();
  return snapshot;
});

export const getUsernameProfile = cache(
  async (username: string, suffix: "" | "/cv.pdf" | "/icon.svg" | "/share.png" = "") => {
    const snapshot = await readPublicProfileByUsername(username);
    if (!snapshot) {
      const alias = await resolvePublishedUsername(username);
      if (alias && alias.username !== username)
        permanentRedirect(`/${encodeURIComponent(alias.username)}${suffix}`);
      notFound();
    }
    return snapshot;
  },
);
