import { storage } from "@shared/config/storage";

import { sessionStorageBase } from "./browserStorage";

const prefix = `${storage.draftRecovery}:`;

export const draftStorage = {
  clear() {
    sessionStorageBase.access((area) => {
      for (let index = area.length - 1; index >= 0; index--) {
        const key = area.key(index);
        if (key?.startsWith(prefix)) area.removeItem(key);
      }
    });
  },
  key: (user: string, profile: string) =>
    `${prefix}${encodeURIComponent(user)}:${encodeURIComponent(profile)}`,
  read: (key: string) => sessionStorageBase.access((area) => area.getItem(key)),
  remove: (key: string) =>
    sessionStorageBase.access((area) => {
      area.removeItem(key);
      return true;
    }),
  write: sessionStorageBase.setItem,
};
