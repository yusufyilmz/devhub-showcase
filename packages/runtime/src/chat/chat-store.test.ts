// @vitest-environment jsdom

import { cleanup } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { ChatRole } from "@shared/lib/types";

import { chatStorage } from "../storage/chatStorage";
import { createChatStore } from "./chat-store";

const alex = { id: "alex", name: "Alex Example", revision: 1 };

describe("ChatState", () => {
  afterEach(() => {
    cleanup();
    sessionStorage.clear();
  });
  describe("chat-scoped conversation state", () => {
    it("isolates both portfolio and revision without importing the legacy global history", async () => {
      const first = createChatStore(alex);
      first.getState().addMessage({
        category: "unknown",
        content: "First owner only",
        role: ChatRole.User,
        type: "cv",
      });
      const other = createChatStore({ ...alex, id: "other", name: "Other Owner" });
      await other.persist.rehydrate();
      expect(JSON.stringify(other.getState())).not.toContain("First owner only");
      const next = createChatStore({ ...alex, revision: 2 });
      await next.persist.rehydrate();
      expect(JSON.stringify(next.getState())).not.toContain("First owner only");
      expect(chatStorage.portfolioKey(alex)).not.toBe(
        chatStorage.portfolioKey({ ...alex, revision: 2 }),
      );
      const same = createChatStore(alex);
      await same.persist.rehydrate();
      expect(JSON.stringify(same.getState())).toContain("First owner only");
    });
  });
});
