import { afterEach, describe, expect, it, vi } from "vitest";

import { streamPortfolioAnswer } from "./portfolio-stream";

function response(parts: string[]) {
  return new Response(
    new ReadableStream({
      start(controller) {
        for (const part of parts) controller.enqueue(new TextEncoder().encode(part));
        controller.close();
      },
    }),
  );
}
describe("shared portfolio streaming client", () => {
  afterEach(() => vi.unstubAllGlobals());
  it("keeps split events together and delivers deltas and the completed answer", async () => {
    const request = vi.fn(async () =>
      response(['{"type":"delta","text":"Hel', 'lo"}\n{"type":"done","answer":"Hello"}\n']),
    );
    vi.stubGlobal("fetch", request);
    const delta = vi.fn();
    await expect(
      streamPortfolioAnswer("fictional-owner", "fixture-session", "Question", delta),
    ).resolves.toBe("Hello");
    expect(delta).toHaveBeenCalledWith("Hello");
    expect(request).toHaveBeenCalledWith(
      "/api/chat/stream",
      expect.objectContaining({
        body: JSON.stringify({
          message: "Question",
          sessionId: "fixture-session",
          username: "fictional-owner",
        }),
        method: "POST",
      }),
    );
  });
  it("rejects an interrupted answer instead of presenting partial text as complete", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => response(['{"type":"delta","text":"Partial"}\n'])),
    );
    await expect(streamPortfolioAnswer("fixture", "session", "Question", vi.fn())).rejects.toThrow(
      "interrupted",
    );
  });
  it("rejects server failures and preserves caller cancellation", async () => {
    const controller = new AbortController();
    const request = vi.fn(async (_url: string, options?: RequestInit) => {
      controller.abort();
      expect(options?.signal?.aborted).toBe(true);
      return new Response(null, { status: 503 });
    });
    vi.stubGlobal("fetch", request);
    await expect(
      streamPortfolioAnswer("fixture", "session", "Question", vi.fn(), controller.signal),
    ).rejects.toThrow("unavailable");
  });
});
