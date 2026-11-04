import { createHmac } from "node:crypto";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const log = vi.hoisted(() => ({ error: vi.fn(), info: vi.fn(), warn: vi.fn() }));
vi.mock("@shared/utils/logger", () => ({ logger: log }));

import { monitored } from "./operation-monitoring";

const privateText = "private-CV prompt token cookie user@example.test";
describe("operation boundary and delivery", () => {
  const fetcher = vi.fn();
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("fetch", fetcher);
    vi.stubEnv("MONITORING_WEBHOOK_URL", "https://collector.example.test/events");
    vi.stubEnv("MONITORING_WEBHOOK_SECRET", "s".repeat(32));
    fetcher.mockResolvedValue(new Response(null, { status: 202 }));
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });
  it.each(["publication.change", "billing.webhook", "ai.edit"] as const)(
    "correlates a controlled %s failure and delivers only safe context",
    async (operation) => {
      const response = await monitored(operation, async (_request: Request) => {
        throw new Error(privateText);
      })(
        new Request(`https://app.example.test/private-user?secret=${privateText}`, {
          body: privateText,
          headers: { authorization: privateText, cookie: privateText, "X-Request-ID": privateText },
          method: "POST",
        }),
      );
      const result = await response.json();
      const id = response.headers.get("X-Request-ID");
      expect(result.requestId).toBe(id);
      expect(result.error).toContain(id);
      const event = log.error.mock.calls[0]?.[0];
      expect(event).toEqual({
        durationMs: expect.any(Number),
        event: "operation.completed",
        operation,
        outcome: "failure",
        requestId: id,
        status: 500,
      });
      const [url, options] = fetcher.mock.calls[0] ?? [];
      expect(url.toString()).toBe("https://collector.example.test/events");
      expect(JSON.parse(options.body)).toEqual(event);
      expect(options.headers["X-Monitoring-Signature"]).toBe(
        createHmac("sha256", "s".repeat(32)).update(options.body).digest("hex"),
      );
      expect(JSON.stringify([log.error.mock.calls, log.warn.mock.calls, options])).not.toContain(
        privateText,
      );
      expect(options.redirect).toBe("error");
      expect(options.signal).toBeInstanceOf(AbortSignal);
    },
  );
  it("preserves status, safe error details and retry headers on handled failure", async () => {
    const response = await monitored("publication.schedule", () =>
      Response.json(
        { error: "Storage unavailable" },
        { headers: { "Retry-After": "30" }, status: 503 },
      ),
    )();
    expect(response.status).toBe(503);
    expect(response.headers.get("Retry-After")).toBe("30");
    expect((await response.json()).error).toContain("Storage unavailable");
  });
  it.each([200, 400, 403, 409, 429])("does not alert or rewrite a %s result", async (status) => {
    const response = await monitored("ai.edit", () =>
      Response.json({ value: "unchanged" }, { status }),
    )();
    expect(await response.json()).toEqual({ value: "unchanged" });
    expect(fetcher).not.toHaveBeenCalled();
    expect(log.error).not.toHaveBeenCalled();
  });
  it.each(["http://collector.test", "https://user:pass@collector.test"])(
    "rejects unsafe endpoint %s without leaking it",
    async (endpoint) => {
      vi.stubEnv("MONITORING_WEBHOOK_URL", endpoint);
      expect(
        (await monitored("billing.webhook", () => new Response("Retry", { status: 503 }))()).status,
      ).toBe(503);
      expect(fetcher).not.toHaveBeenCalled();
      expect(JSON.stringify(log.warn.mock.calls)).not.toContain(endpoint);
    },
  );
  it("uses logs alone when no collector is configured", async () => {
    vi.stubEnv("MONITORING_WEBHOOK_URL", "");
    await monitored("billing.webhook", () => new Response("Retry", { status: 503 }))();
    expect(log.error).toHaveBeenCalledOnce();
    expect(fetcher).not.toHaveBeenCalled();
  });
  it("isolates collector outage and does not repeat the business operation", async () => {
    fetcher.mockRejectedValue(new Error(privateText));
    const action = vi.fn(() => new Response("Retry", { status: 503 }));
    const response = await monitored("billing.webhook", action)();
    expect(action).toHaveBeenCalledOnce();
    expect(response.status).toBe(503);
    expect(await response.text()).toBe("Retry");
    expect(log.warn).toHaveBeenCalledWith(
      { event: "monitoring.delivery_failed", requestId: response.headers.get("X-Request-ID") },
      expect.any(String),
    );
  });
});
