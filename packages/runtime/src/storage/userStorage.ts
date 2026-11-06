import { storage   } from "@shared/config/storage";

import { localStorageBase, versionedStorage } from "./browserStorage";

export type StoredUser = { id: string; name: string; email?: string; avatarUrl?: string };

export const userStorage = versionedStorage<{ user: StoredUser | null }>(
  localStorageBase,
  storage.userConfig,
);

export function cleanStoredUser(value: unknown): StoredUser | null {
  if (!value || typeof value !== "object") return null;
  const user = value as Record<string, unknown>;
  if (typeof user.id !== "string" || typeof user.name !== "string") return null;
  return {
    id: user.id.slice(0, 200),
    name: user.name.slice(0, 200),
    ...(typeof user.email === "string" ? { email: user.email.slice(0, 320) } : {}),
    ...(typeof user.avatarUrl === "string" ? { avatarUrl: user.avatarUrl.slice(0, 2000) } : {}),
  };
}
