import type { PortfolioProfile } from "@shared/config";

/** Published or owner profile row shape used across lib and services. */
export interface ProfileSnapshot {
  id?: string;
  isPublic?: boolean;
  profile: PortfolioProfile;
  revision: number;
  updatedAt: string;
  username?: string;
}
