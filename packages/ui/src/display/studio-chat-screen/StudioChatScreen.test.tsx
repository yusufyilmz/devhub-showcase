// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { StudioChatScreen } from "./StudioChatScreen";

vi.mock("../../theme", () => ({ ThemeToggle: () => null }));

const base = {
  busy: false,
  disabled: false,
  message: "",
  messages: [],
  onMessageChange: vi.fn(),
  onReset: vi.fn(),
  onStop: vi.fn(),
  onSubmit: vi.fn(),
};

describe("StudioChatScreen companion", () => {
  afterEach(cleanup);
  it("reacts to waiting, streaming, completion, failure and reset beside the composer", () => {
    Element.prototype.scrollTo = vi.fn();
    const user = { id: 1, role: "user" as const, text: "Tell me about projects" };
    const reply = { id: 2, role: "assistant" as const, text: "Atlas is" };
    const { rerender } = render(<StudioChatScreen {...base} />);
    expect(
      screen.getByRole("img", { name: "Assistant: idle" }).closest(".studio-chat-composer-row"),
    ).not.toBeNull();
    rerender(<StudioChatScreen {...base} busy messages={[user]} />);
    expect(screen.getByRole("img", { name: "Assistant: thinking" })).toBeTruthy();
    rerender(<StudioChatScreen {...base} busy messages={[user, reply]} />);
    expect(screen.getByRole("img", { name: "Assistant: writing" })).toBeTruthy();
    rerender(<StudioChatScreen {...base} messages={[user, reply]} />);
    expect(screen.getByRole("img", { name: "Assistant: happy" })).toBeTruthy();
    rerender(<StudioChatScreen {...base} error="Try again" messages={[user]} />);
    expect(screen.getByRole("img", { name: "Assistant: error" })).toBeTruthy();
    rerender(<StudioChatScreen {...base} visitor={{ href: "/alex", name: "Alex" }} />);
    expect(
      screen
        .getByRole("img", { name: "Assistant: idle" })
        .closest("[data-agent]")
        ?.getAttribute("data-agent"),
    ).toBe("portfolio");
    expect(screen.queryByRole("button", { name: /Move companion/ })).toBeNull();
  });
});
