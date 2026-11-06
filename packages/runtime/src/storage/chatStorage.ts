import { storage } from "@shared/config/storage";

import { sessionStorageBase, versionedStorage } from "./browserStorage";

type ChatScope = { id: string; revision: number };

export type VisitorMessage = { id: string; role: "user" | "assistant"; text: string };

const scopedKey = (kind: "portfolio" | "visitor", { id, revision }: ChatScope) =>
  `${storage.chat}:${kind}:${encodeURIComponent(id)}:${revision}`;
const pendingKey = `${storage.chat}:pending`;

export const chatStorage = {
  persistence: <T>(scope: ChatScope) =>
    versionedStorage<T>(sessionStorageBase, scopedKey("portfolio", scope)),
  portfolioKey: (scope: ChatScope) => scopedKey("portfolio", scope),
  readVisitor(key: string): VisitorMessage[] {
    const messages = sessionStorageBase.readJSON(key);
    if (!Array.isArray(messages)) return [];
    return messages
      .filter(
        (item): item is VisitorMessage =>
          typeof item?.id === "string" &&
          (item.role === "user" || item.role === "assistant") &&
          typeof item.text === "string" &&
          item.text.length <= 12000,
      )
      .slice(-20);
  },
  setPending: (message: string) => sessionStorageBase.setItem(pendingKey, message),
  takePending() {
    const pending = sessionStorageBase.getItem(pendingKey);
    sessionStorageBase.removeItem(pendingKey);
    return pending;
  },
  visitorKey: (scope: ChatScope) => scopedKey("visitor", scope),
  writeVisitor: (key: string, messages: VisitorMessage[]) =>
    sessionStorageBase.writeJSON(key, messages),
};
