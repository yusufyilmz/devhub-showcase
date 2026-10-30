import type { PortfolioProfile } from "@shared/content";
export interface ProfileSnapshot {
  id?: string;
  username?: string;
  isPublic?: boolean;
  profile: PortfolioProfile;
  revision: number;
  updatedAt: string;
}
export interface ProfileRepository {
  read(): Promise<ProfileSnapshot | null>;
  isOwner(userId: string): Promise<boolean>;
  save(
    profile: PortfolioProfile,
    revision: number,
    isPublic?: boolean,
    username?: string,
  ): Promise<ProfileSnapshot | null>;
}
export class ProfileConflictError extends Error {
  constructor() {
    super(
      "This profile changed in another tab. Reload the latest version before saving.",
    );
  }
}
export class ProfileAccessError extends Error {
  constructor() {
    super("Only the portfolio owner can edit this information.");
  }
}
export class ProfileSetupError extends Error {
  constructor() {
    super(
      "Profile storage is not configured. Apply the CV profile migrations first.",
    );
  }
}

export class ProfileNotFoundError extends Error {
  constructor() {
    super("This profile is private or does not exist.");
  }
}

export class ProfileUsernameError extends Error {
  constructor() {
    super("This username is already taken. Choose another one.");
  }
}
