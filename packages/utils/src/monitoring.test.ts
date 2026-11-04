import { describe, expect, it, vi } from "vitest";

import { startOperation } from "./monitoring";

describe("safe operation events", () => {
  it("generates independent IDs, monotonic duration and a single terminal event", async () => {
    const sink = vi.fn();
    const span = startOperation("publication.change", sink);
    expect(span.requestId).not.toBe(startOperation("publication.change", sink).requestId);
    await span.finish(503);
    await span.finish(200);
    expect(sink).toHaveBeenCalledTimes(1);
    expect(sink.mock.calls[0]?.[0]).toEqual({
      durationMs: expect.any(Number),
      event: "operation.completed",
      operation: "publication.change",
      outcome: "failure",
      requestId: span.requestId,
      status: 503,
    });
    expect(sink.mock.calls[0]?.[0].durationMs).toBeGreaterThanOrEqual(0);
  });
  it.each([
    [200, false, "success"],
    [403, false, "rejected"],
    [429, false, "rejected"],
    [503, true, "cancelled"],
  ] as const)(
    "classifies %s without treating client cancellation as an outage",
    async (status, cancelled, outcome) => {
      const sink = vi.fn();
      await startOperation("ai.edit", sink).finish(status, cancelled);
      expect(sink).toHaveBeenCalledWith(expect.objectContaining({ outcome }));
    },
  );
  it("isolates collector failure", async () => {
    await expect(
      startOperation("billing.webhook", () => {
        throw new Error("private provider failure");
      }).finish(503),
    ).resolves.toBeUndefined();
  });
});
