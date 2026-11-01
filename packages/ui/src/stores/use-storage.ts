"use client";

import { create } from "zustand";
import { createJSONStorage, persist, type StateStorage } from "zustand/middleware";

import {
  isStorageTheme,
  type StorageTheme,
  USER_STORAGE_KEY,
  USER_STORAGE_VERSION,
} from "./storage-theme";

/** Display cache only. Authorization always comes from the server session. */
export type StoredUser = { id: string; name: string; email?: string; avatarUrl?: string };
type StorageState = {
  user: StoredUser | null;
  theme: StorageTheme | null;
  setUser: (user: StoredUser | null) => void;
  setTheme: (theme: StorageTheme) => void;
  clearUser: () => void;
};

function cleanUser(value: unknown): StoredUser | null {
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

// Private browsing, full disks and disabled storage must still allow in-memory choices.
const localStorageAdapter: StateStorage = {
  getItem: (key) => {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  removeItem: (key) => {
    try {
      localStorage.removeItem(key);
    } catch {
      /* Storage may be unavailable. */
    }
  },
  setItem: (key, value) => {
    try {
      localStorage.setItem(key, value);
    } catch {
      /* Memory state remains usable. */
    }
  },
};

export const useStorage = create<StorageState>()(
  persist(
    (set) => ({
      clearUser: () => set({ user: null }),
      setTheme: (theme) => {
        if (isStorageTheme(theme)) set({ theme });
      },
      setUser: (user) => set({ user: cleanUser(user) }),
      theme: null,
      user: null,
    }),
    {
      merge: (persisted, current) => {
        const state =
          persisted && typeof persisted === "object" ? (persisted as Record<string, unknown>) : {};
        return {
          ...current,
          theme: isStorageTheme(state.theme) ? state.theme : null,
          user: cleanUser(state.user),
        };
      },
      name: USER_STORAGE_KEY,
      partialize: ({ user, theme }) => ({ theme, user }),
      skipHydration: true,
      storage: createJSONStorage(() => localStorageAdapter),
      version: USER_STORAGE_VERSION,
    },
  ),
);

export type { StorageTheme } from "./storage-theme";
export { USER_STORAGE_KEY, USER_STORAGE_VERSION } from "./storage-theme";
