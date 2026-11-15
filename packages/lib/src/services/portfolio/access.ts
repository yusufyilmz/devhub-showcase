import { z } from "zod";

import { ProfileSetupError, type ProfileSnapshot } from "../../repositories/profile/contract";
import { validatePublicProfile } from "../../schemas/profile/index";
import type { PortfolioAccessServer } from "../../types/portfolio";
import { portfolioGrantCookie, verifyPortfolioGrant } from "./password";

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

export function createProtectedProfileReader({
  readCookie,
  accessServer,
}: {
  readCookie: (name: string) => Promise<string | undefined>;
  accessServer: () => PortfolioAccessServer;
}) {
  async function readProtectedProfile(
    id: string,
    surface: "website" | "cv" = "website",
  ): Promise<ProfileSnapshot | null> {
    if (id !== "main" && !z.uuid().safeParse(id).success) return null;
    const value = await readCookie(portfolioGrantCookie(id));
    if (!value) return null;
    const { client, secret } = accessServer();
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

  return readProtectedProfile;
}
