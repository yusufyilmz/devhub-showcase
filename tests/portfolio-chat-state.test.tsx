// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { ChatRole } from "../packages/lib/src/types/chat/roles";
import {
  createPortfolioChatStore,
  PortfolioChatProvider,
  portfolioChatStorageKey,
  useAddMessage,
  useChatMessages,
} from "../packages/ui/src/stores/chat-store";

afterEach(() => {
  cleanup();
  sessionStorage.clear();
});
const alex = { id: "alex", name: "Alex Example", revision: 1 };
function Conversation() {
  const messages = useChatMessages("cv");
  const add = useAddMessage();
  return (
    <>
      <button
        onClick={() =>
          add({
            category: "unknown",
            content: "A visitor question",
            role: ChatRole.User,
            type: "cv",
          })
        }
        type="button"
      >
        Ask
      </button>
      <div data-testid="messages">
        {messages.map((item) => (
          <p key={item.content}>{item.content}</p>
        ))}
      </div>
    </>
  );
}
describe("portfolio-scoped conversation state", () => {
  it("isolates both portfolio and revision without importing the legacy global history", async () => {
    const first = createPortfolioChatStore(alex);
    first.getState().addMessage({
      category: "unknown",
      content: "First owner only",
      role: ChatRole.User,
      type: "cv",
    });
    const other = createPortfolioChatStore({ ...alex, id: "other", name: "Other Owner" });
    await other.persist.rehydrate();
    expect(JSON.stringify(other.getState())).not.toContain("First owner only");
    const next = createPortfolioChatStore({ ...alex, revision: 2 });
    await next.persist.rehydrate();
    expect(JSON.stringify(next.getState())).not.toContain("First owner only");
    expect(portfolioChatStorageKey(alex)).not.toBe(
      portfolioChatStorageKey({ ...alex, revision: 2 }),
    );
    const same = createPortfolioChatStore(alex);
    await same.persist.rehydrate();
    expect(JSON.stringify(same.getState())).toContain("First owner only");
  });
  it("resets the provider when navigating to another portfolio", () => {
    const view = render(
      <PortfolioChatProvider identity={alex}>
        <Conversation />
      </PortfolioChatProvider>,
    );
    fireEvent.click(screen.getByText("Ask"));
    expect(screen.getByTestId("messages").textContent).toContain("A visitor question");
    view.rerender(
      <PortfolioChatProvider identity={{ ...alex, id: "other", name: "Other Owner" }}>
        <Conversation />
      </PortfolioChatProvider>,
    );
    expect(screen.getByTestId("messages").textContent).not.toContain("A visitor question");
    expect(screen.getByTestId("messages").textContent).toContain("Other Owner");
  });
});
