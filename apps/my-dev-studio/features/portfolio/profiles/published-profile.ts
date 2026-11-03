import { notFound } from "next/navigation";
import { connection } from "next/server";
import { cache } from "react";

import { ProfileNotFoundError, type ProfileSnapshot } from "@shared/services/profile";
import { readPublishedProfile } from "@shared/services/published-profile";

export const getPublishedProfile = cache(
  async (surface: "website" | "cv" = "website"): Promise<ProfileSnapshot> => {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) await connection();
    try {
      return await readPublishedProfile(surface);
    } catch (error) {
      if (error instanceof ProfileNotFoundError) notFound();
      throw error;
    }
  },
);
