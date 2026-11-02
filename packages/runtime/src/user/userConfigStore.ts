"use client";

import { create } from "zustand";
import { createJSONStorage, persist, type StateStorage } from "zustand/middleware";

import { cleanThemePreferences, type ThemePreferences } from "./themePreferences";
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
  themePreferences: ThemePreferences;
  setThemePreferences: (preferences: ThemePreferences) => void;
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
      reset: () => set({ activeMode: null, themePreferences: {}, user: null }),
      setActiveMode: (activeMode) => {
        if (isUserConfigMode(activeMode)) set({ activeMode });
      },
      setThemePreferences: (preferences) =>
        set((state) => ({
          themePreferences: { ...state.themePreferences, ...cleanThemePreferences(preferences) },
        })),
      setUser: (user) => set({ user: cleanStoredUser(user) }),
      themePreferences: {},
      user: null,
    }),
    {
      merge: (persisted, current) => {
        const state =
          persisted && typeof persisted === "object" ? (persisted as Record<string, unknown>) : {};
        return {
          ...current,
          activeMode: isUserConfigMode(state.activeMode) ? state.activeMode : null,
          themePreferences: cleanThemePreferences(state.themePreferences),
          user: cleanStoredUser(state.user),
        };
      },
      migrate: (persisted) => {
        const state =
          persisted && typeof persisted === "object" ? (persisted as Record<string, unknown>) : {};
        return {
          activeMode: isUserConfigMode(state.activeMode) ? state.activeMode : null,
          themePreferences: cleanThemePreferences(state.themePreferences),
          user: cleanStoredUser(state.user),
        };
      },
      name: USER_CONFIG_STORAGE_KEY,
      partialize: ({ user, activeMode, themePreferences }) => ({
        activeMode,
        themePreferences,
        user,
      }),
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
  setThemePreferences: (preferences: ThemePreferences) =>
    useUserConfigStore.getState().setThemePreferences(preferences),
  setUser: (user: StoredUser | null) => useUserConfigStore.getState().setUser(user),
};
export const userconfigSelectors = {
  activeMode: (state: UserConfigState) => state.activeMode,
  themePreferences: (state: UserConfigState) => state.themePreferences,
  user: (state: UserConfigState) => state.user,
};
