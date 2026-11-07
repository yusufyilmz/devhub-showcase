import { notFound } from "next/navigation";
import { connection } from "next/server";
import { cache } from "react";

import { ProfileNotFoundError, type ProfileSnapshot } from "@shared/services/profile";
import { readPublishedProfile } from "@shared/services/published-profile";

import { env } from "@/env";

import { readProtectedProfile } from "../access/server-access";

export const getPublishedProfile = cache(
  async (surface: "website" | "cv" = "website"): Promise<ProfileSnapshot> => {
    if (env.NEXT_PUBLIC_SUPABASE_URL) await connection();
    try {
      return await readPublishedProfile(surface);
    } catch (error) {
      if (error instanceof ProfileNotFoundError) {
        const protectedSnapshot = await readProtectedProfile("main", surface);
        if (protectedSnapshot) return protectedSnapshot;
        notFound();
      }
      throw error;
    }
  },
);
