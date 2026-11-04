// @vitest-environment jsdom

import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ action: vi.fn(), view: vi.fn() }));
vi.mock("../../app/actions", () => ({ handlePremiumChatAction: mocks.action }));
vi.mock("@shared/assistant/chat", () => ({
  PremiumWidget: (props: unknown) => {
    mocks.view(props);
    return null;
  },
}));

import { PremiumWidget } from "./premium-widget";

describe("paid chat action envelope", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });
  function callback() {
    render(<PremiumWidget id="portfolio" name="Example" revision={1} username="test-owner" />);
    return mocks.view.mock.calls[0]?.[0].handleSendMessage;
  }
  it("passes all four action arguments and returns only the answer on success", async () => {
    mocks.action.mockResolvedValue({ answer: "Public answer" });
    expect(await callback()("test-owner", "Question", "session-id", "attempt-id")).toBe(
      "Public answer",
    );
    expect(mocks.action).toHaveBeenCalledWith("test-owner", "Question", "session-id", "attempt-id");
  });
  it("keeps monitored failures in the error path rather than adding an assistant answer", async () => {
    mocks.action.mockResolvedValue({
      error: "Chat unavailable. Reference: 11111111-1111-4111-8111-111111111111",
    });
    await expect(callback()("test-owner", "Question", "session-id", "attempt-id")).rejects.toThrow(
      "Reference:",
    );
  });
});
