"use client";

import { create } from "zustand";
import { createJSONStorage, persist, type StateStorage } from "zustand/middleware";

import {
  cleanStoredUser,
  isUserConfigMode,
  type StoredUser,
  USER_CONFIG_STORAGE_KEY,
  USER_CONFIG_STORAGE_VERSION,
  type UserConfigMode,
} from "./userConfigPersistence";

/** Display cache only. Authorization always comes from the server session. */
export type { StoredUser } from "./userConfigPersistence";

type UserConfigState = {
  user: StoredUser | null;
  activeMode: UserConfigMode | null;
  setUser: (user: StoredUser | null) => void;
  setActiveMode: (activeMode: UserConfigMode) => void;
  clearUser: () => void;
  reset: () => void;
};

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

export const useUserConfigStore = create<UserConfigState>()(
  persist(
    (set) => ({
      activeMode: null,
      clearUser: () => set({ user: null }),
      reset: () => set({ activeMode: null, user: null }),
      setActiveMode: (activeMode) => {
        if (isUserConfigMode(activeMode)) set({ activeMode });
      },
      setUser: (user) => set({ user: cleanStoredUser(user) }),
      user: null,
    }),
    {
      merge: (persisted, current) => {
        const state =
          persisted && typeof persisted === "object" ? (persisted as Record<string, unknown>) : {};
        return {
          ...current,
          activeMode: isUserConfigMode(state.activeMode) ? state.activeMode : null,
          user: cleanStoredUser(state.user),
        };
      },
      migrate: (persisted) => {
        const state =
          persisted && typeof persisted === "object" ? (persisted as Record<string, unknown>) : {};
        return {
          activeMode: isUserConfigMode(state.activeMode) ? state.activeMode : null,
          user: cleanStoredUser(state.user),
        };
      },
      name: USER_CONFIG_STORAGE_KEY,
      partialize: ({ user, activeMode }) => ({ activeMode, user }),
      skipHydration: true,
      storage: createJSONStorage(() => localStorageAdapter),
      version: USER_CONFIG_STORAGE_VERSION,
    },
  ),
);

export type { UserConfigMode } from "./userConfigPersistence";
export { USER_CONFIG_STORAGE_KEY, USER_CONFIG_STORAGE_VERSION } from "./userConfigPersistence";

export const userConfigActions = {
  clearUser: () => useUserConfigStore.getState().clearUser(),
  reset: () => useUserConfigStore.getState().reset(),
  setActiveMode: (mode: UserConfigMode) => useUserConfigStore.getState().setActiveMode(mode),
  setUser: (user: StoredUser | null) => useUserConfigStore.getState().setUser(user),
};
export const userconfigSelectors = {
  activeMode: (state: UserConfigState) => state.activeMode,
  user: (state: UserConfigState) => state.user,
};
