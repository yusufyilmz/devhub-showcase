import { create } from "zustand";
import { persist } from "zustand/middleware";

import { cleanThemePreferences, type ThemePreferences } from "../storage/themePreferences";
import {
  isThemeMode,
  type ThemeMode,
  type ThemeSettings,
  themeStorage,
} from "../storage/themeStorage";

type ThemeState = ThemeSettings & {
  setThemePreferences: (preferences: ThemePreferences) => void;
  setActiveMode: (mode: ThemeMode) => void;
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      activeMode: null,
      setActiveMode: (mode) => {
        if (isThemeMode(mode)) set({ activeMode: mode });
      },
      setThemePreferences: (preferences) =>
        set((state) => ({
          themePreferences: { ...state.themePreferences, ...cleanThemePreferences(preferences) },
        })),
      themePreferences: {},
    }),
    {
      ...themeStorage,
      merge: (saved, current) => {
        const state = saved as Partial<ThemeSettings> | undefined;
        return {
          ...current,
          activeMode: isThemeMode(state?.activeMode) ? state.activeMode : null,
          themePreferences: cleanThemePreferences(state?.themePreferences),
        };
      },
      partialize: ({ activeMode, themePreferences }) => ({ activeMode, themePreferences }),
    },
  ),
);
