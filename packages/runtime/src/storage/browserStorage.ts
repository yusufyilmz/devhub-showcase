import type { PersistStorage } from "zustand/middleware";

import { storage } from "@shared/config/storage";

function browserStorage(kind: "localStorage" | "sessionStorage") {
  function access<T>(operation: (area: Storage) => T): T | undefined {
    try {
      return operation(window[kind]);
    } catch {
      return undefined;
    }
  }

  return {
    access,
    getItem: (key: string) => access((area) => area.getItem(key)) ?? null,
    readJSON: (key: string): unknown =>
      access((area) => JSON.parse(area.getItem(key) ?? "null")) ?? null,
    removeItem: (key: string) => access((area) => area.removeItem(key)),
    setItem: (key: string, value: string) =>
      access((area) => {
        area.setItem(key, value);
        return true;
      }) ?? false,
    writeJSON: (key: string, value: unknown) =>
      access((area) => area.setItem(key, JSON.stringify(value))),
  };
}

export const localStorageBase = browserStorage("localStorage");
export const sessionStorageBase = browserStorage("sessionStorage");

export function versionedStorage<T>(area: typeof localStorageBase, name: string) {
  const adapter: PersistStorage<T> = {
    getItem: (key) => {
      const record = area.readJSON(key);
      if (
        !record ||
        typeof record !== "object" ||
        !("version" in record) ||
        record.version !== storage.version ||
        !("state" in record)
      )
        return null;
      return { state: record.state as T, version: storage.version };
    },
    removeItem: area.removeItem,
    setItem: area.writeJSON,
  };
  return { name, skipHydration: true, storage: adapter, version: storage.version };
}
