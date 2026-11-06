import { type ChatIdentity, chatStorageKey } from "@shared/runtime/chat";

export type VisitorMessage = { id: string; role: "user" | "assistant"; text: string };

export function visitorHistoryKey(identity: ChatIdentity) {
  return `mydevstudio:premium-chat:v1:${encodeURIComponent(identity.id)}:${identity.revision}`;
}

export function loadVisitorHistory(identity: ChatIdentity): VisitorMessage[] {
  try {
    const stored = sessionStorage.getItem(visitorHistoryKey(identity));
    const previous =
      stored === null
        ? JSON.parse(sessionStorage.getItem(chatStorageKey(identity)) ?? "null")?.state
            ?.chatMessages
        : JSON.parse(stored);
    if (!Array.isArray(previous)) return [];
    const messages: VisitorMessage[] = [];
    for (const item of previous) {
      const text = item?.text ?? item?.content;
      if (
        (item?.role === "user" || item?.role === "assistant") &&
        typeof text === "string" &&
        text.length <= 12000
      )
        messages.push({ id: crypto.randomUUID(), role: item.role, text });
    }
    return messages.slice(-20);
  } catch {
    return [];
  }
}
