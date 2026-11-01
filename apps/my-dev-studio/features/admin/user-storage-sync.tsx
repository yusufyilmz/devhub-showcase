"use client";

import { useEffect } from "react";

import { type StoredUser, useStorage } from "@shared/ui/stores";

/** Cache only server-confirmed display fields. Never use this cache for authorization. */
export function UserStorageSync({ user }: { user: StoredUser | null }) {
  useEffect(() => {
    let active = true;
    void Promise.resolve(useStorage.persist.rehydrate()).then(() => {
      if (active) useStorage.getState().setUser(user);
    });
    return () => {
      active = false;
    };
  }, [user]);
  return null;
}
