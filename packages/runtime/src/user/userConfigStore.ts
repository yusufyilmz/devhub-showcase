import { create } from "zustand";
import { persist } from "zustand/middleware";

import { cleanStoredUser, type StoredUser, userStorage } from "../storage/userStorage";

type UserConfigState = {
  user: StoredUser | null;
  setUser: (user: StoredUser | null) => void;
  clearUser: () => void;
};

/** Display cache only. Authorization always comes from the server session. */
export const useUserConfigStore = create<UserConfigState>()(
  persist(
    (set) => ({
      clearUser: () => set({ user: null }),
      setUser: (user) => set({ user: cleanStoredUser(user) }),
      user: null,
    }),
    {
      ...userStorage,
      merge: (saved, current) => ({
        ...current,
        user: cleanStoredUser((saved as { user?: unknown } | undefined)?.user),
      }),
      partialize: ({ user }) => ({ user }),
    },
  ),
);
