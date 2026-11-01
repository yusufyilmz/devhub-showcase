import { notFound } from "next/navigation";
import { connection } from "next/server";
import { cache } from "react";

import { profile } from "@shared/config";
import { validateProfile } from "@shared/lib/profiles";
import { ProfileNotFoundError, type ProfileSnapshot } from "@shared/services/profile";
import { readPublishedProfile } from "@shared/services/published-profile";

export const getPublishedProfile = cache(async (): Promise<ProfileSnapshot> => {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) await connection();
  try {
    return await readPublishedProfile();
  } catch (error) {
    if (error instanceof ProfileNotFoundError) notFound();
    console.warn("Published portfolio storage is unavailable; using the bundled profile.");
    return { profile: validateProfile(profile), revision: 0, updatedAt: "" };
  }
});
