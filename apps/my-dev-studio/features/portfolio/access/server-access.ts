import { cookies } from "next/headers";

import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

import { validatePublicProfile } from "@shared/lib/profiles";
import type { Database } from "@shared/lib/types";
import { ProfileSetupError, type ProfileSnapshot } from "@shared/services/profile";

import { env } from "@/env";

import { portfolioGrantCookie, verifyPortfolioGrant } from "./password";

export function portfolioAccessServer() {
  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const secret = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !secret) throw new ProfileSetupError();
  const client = createClient<Database>(url, secret, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: { fetch: (input, init) => fetch(input, { ...init, cache: "no-store" }) },
  });
  return { client, secret };
}
export const passwordRecordSchema = z.object({
  access_version: z.uuid(),
  password_digest: z.string().regex(/^scrypt-v1\$[0-9a-f]{32}\$[0-9a-f]{64}$/),
});
const protectedSnapshotSchema = z.object({
  document: z.unknown(),
  id: z.string(),
  revision: z.number().int(),
  updated_at: z.string(),
  username: z.string(),
});
export async function readProtectedProfile(
  id: string,
  surface: "website" | "cv" = "website",
): Promise<ProfileSnapshot | null> {
  if (id !== "main" && !z.uuid().safeParse(id).success) return null;
  const value = (await cookies()).get(portfolioGrantCookie(id))?.value;
  if (!value) return null;
  const { client, secret } = portfolioAccessServer();
  const version = verifyPortfolioGrant(id, value, secret);
  if (!version) return null;
  const { data, error } = await client.rpc("read_protected_publication", {
    access_version: version,
    profile_id: id,
    surface,
  });
  if (error) throw new ProfileSetupError();
  if (!data) return null;
  const row = protectedSnapshotSchema.parse(data);
  if (row.id !== id) throw new ProfileSetupError();
  return {
    id: row.id,
    isPublic: true,
    profile: validatePublicProfile(row.document),
    revision: row.revision,
    updatedAt: row.updated_at,
    username: row.username,
  };
}
