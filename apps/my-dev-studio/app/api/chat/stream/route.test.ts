import { beforeEach, describe, expect, it, vi } from "vitest";

const { sameOrigin, access, answer } = vi.hoisted(() => ({
  access: vi.fn(),
  answer: vi.fn(),
  sameOrigin: vi.fn(),
}));
vi.mock("@/features/admin/admin-auth", () => ({ sameOrigin }));
vi.mock("@/features/chat/portfolio-chat", () => ({ requireLegacyChat: access }));
vi.mock("@shared/assistant", () => ({
  PortfolioChatModel: class {
    answer = answer;
  },
}));

import { POST } from "./route";

describe("public chat streaming", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sameOrigin.mockReturnValue(true);
    access.mockResolvedValue({ knowledge: { audience: "public" } });
    answer.mockImplementation(async (_knowledge, _message, _signal, delta) => {
      delta("Hello");
      return "Hello";
    });
  });
  function request(body: unknown) {
    return new Request("https://studio.test/api/chat/stream", {
      body: JSON.stringify(body),
      method: "POST",
    });
  }
  const valid = {
    message: "What does Alex do?",
    sessionId: "a8d311a8-26a2-421d-8129-4577d24fdf4a",
    username: "alex",
  };
  it("rejects cross-origin requests before access or provider work", async () => {
    sameOrigin.mockReturnValue(false);
    expect((await POST(request(valid))).status).toBe(403);
    expect(access).not.toHaveBeenCalled();
    expect(answer).not.toHaveBeenCalled();
  });
  it("emits deltas and a terminal answer after resolving published access", async () => {
    const response = await POST(request(valid));
    const events = (await response.text())
      .trim()
      .split("\n")
      .map((line) => JSON.parse(line));
    expect(access).toHaveBeenCalledWith(valid.username, valid.sessionId);
    expect(events).toEqual([
      { text: "Hello", type: "delta" },
      { answer: "Hello", type: "done" },
    ]);
    expect(response.headers.get("Cache-Control")).toBe("private, no-store");
  });
  it("fails closed when the profile is unavailable", async () => {
    access.mockRejectedValue(new Error("Private"));
    expect((await POST(request(valid))).status).toBe(400);
    expect(answer).not.toHaveBeenCalled();
  });
  it("rejects oversized input before resolving profile data", async () => {
    const response = await POST(request({ ...valid, message: "x".repeat(13000) }));
    expect(response.status).toBe(400);
    expect(access).not.toHaveBeenCalled();
  });
});
