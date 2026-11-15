import { describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  client: vi.fn(() => ({})),
  push: vi.fn(async () => undefined),
  scan: vi.fn(async () => true),
  secret: "fictional-cron-secret-for-test-only",
}));
vi.mock("../../../../env", () => ({ env: { CRON_SECRET: mocks.secret } }));
vi.mock("../../jobs/_config", () => ({ jobsServiceClient: mocks.client }));
vi.mock("../../jobs/_discovery-worker", () => ({
  runJobDiscovery: mocks.scan,
  sendJobAlerts: mocks.push,
}));

import { GET } from "./route";

const url = "https://example.test/api/cron/jobs";

describe("job discovery schedule endpoint", () => {
  it("rejects an unauthorized call before constructing the worker", async () => {
    expect((await GET(new Request(url))).status).toBe(403);
    expect(mocks.client).not.toHaveBeenCalled();
  });

  it("runs discovery and delivery for an authorized invocation", async () => {
    const response = await GET(
      new Request(url, { headers: { Authorization: `Bearer ${mocks.secret}` } }),
    );
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ discovery: { completed: true } });
    expect(mocks.push).toHaveBeenCalledOnce();
  });

  it("still delivers queued notifications when discovery fails", async () => {
    mocks.scan.mockRejectedValueOnce(new Error("private upstream error"));
    const response = await GET(
      new Request(url, { headers: { Authorization: `Bearer ${mocks.secret}` } }),
    );
    expect(response.status).toBe(503);
    expect(await response.text()).not.toContain("private upstream error");
    expect(mocks.push).toHaveBeenCalled();
  });
});
