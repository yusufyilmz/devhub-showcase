import { useEffect } from "react";

import type { StoredUser } from "../storage/userStorage";
import { useUserConfigStore } from "./userConfigStore";

/** Cache only server-confirmed display fields. Never use this cache for authorization. */
export function useUserStorageSync(user: StoredUser | null | undefined) {
  useEffect(() => {
    if (user === undefined) return;
    let active = true;
    Promise.resolve(useUserConfigStore.persist.rehydrate()).then(() => {
      if (active) useUserConfigStore.getState().setUser(user);
    });
    return () => {
      active = false;
    };
  }, [user]);
}
