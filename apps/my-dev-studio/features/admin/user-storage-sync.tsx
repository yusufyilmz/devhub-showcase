"use client";

import { useEffect } from "react";

import { type StoredUser, useUserConfigStore } from "@shared/runtime/stores";

/** Cache only server-confirmed display fields. Never use this cache for authorization. */
export function UserStorageSync({ user }: { user: StoredUser | null }) {
  useEffect(() => {
    let active = true;
    void Promise.resolve(useUserConfigStore.persist.rehydrate()).then(() => {
      if (active) useUserConfigStore.getState().setUser(user);
    });
    return () => {
      active = false;
    };
  }, [user]);
  return null;
}
