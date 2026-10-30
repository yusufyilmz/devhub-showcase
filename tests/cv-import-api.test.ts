import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { extractedCv } from "./cv-import-fixture";

const mocks = vi.hoisted(() => ({ extract: vi.fn(), getUser: vi.fn(), limit: vi.fn() }));
vi.mock("@shared/lib/supabase", () => ({
  createServerClient: async () => ({ auth: { getUser: mocks.getUser } }),
}));
vi.mock("@shared/cache", () => ({ allowCvImport: mocks.limit }));
vi.mock("@shared/chat", () => ({
  CvImportModel: class {
    extract = mocks.extract;
  },
}));

import { GET, POST } from "../apps/web/app/api/admin/cv-import/route";

function upload(
  content = "%PDF-1.7\nExample CV",
  name = "cv.pdf",
  origin = "https://studio.example",
) {
  const body = new FormData();
  body.set("cv", new File([content], name));
  return new Request("https://studio.example/api/admin/cv-import", {
    body,
    headers: { origin },
    method: "POST",
  });
}
beforeEach(() => {
  vi.resetAllMocks();
  vi.stubEnv("OPENAI_API_KEY", "test-placeholder");
  vi.stubEnv("REDIS_URL", "https://redis.example");
  vi.stubEnv("REDIS_TOKEN", "test-placeholder");
  mocks.getUser.mockResolvedValue({
    data: { user: { email_confirmed_at: "today", id: "confirmed-owner" } },
    error: null,
  });
  mocks.limit.mockResolvedValue(true);
  mocks.extract.mockResolvedValue(extractedCv);
});
afterEach(() => vi.unstubAllEnvs());
describe("private CV processing endpoint", () => {
  it("requires a confirmed identity and same origin before processing", async () => {
    expect((await POST(upload(undefined, undefined, "https://elsewhere.example"))).status).toBe(
      403,
    );
    mocks.getUser.mockResolvedValue({ data: { user: null }, error: null });
    expect((await POST(upload())).status).toBe(403);
    expect((await GET()).status).toBe(403);
    expect(mocks.extract).not.toHaveBeenCalled();
  });
  it("returns review data without saving, using the verified identity for its quota", async () => {
    const response = await POST(upload());
    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toContain("no-store");
    expect(await response.json()).toEqual(extractedCv);
    expect(mocks.limit).toHaveBeenCalledWith("confirmed-owner");
    expect(mocks.extract).toHaveBeenCalledOnce();
  });
  it("fails closed on quota/config/storage outages and validates uploads before paid calls", async () => {
    expect((await POST(upload("not a pdf"))).status).toBe(400);
    expect(mocks.limit).not.toHaveBeenCalled();
    mocks.limit.mockResolvedValue(false);
    expect((await POST(upload())).status).toBe(429);
    mocks.limit.mockRejectedValue(new Error("Redis down"));
    expect((await POST(upload())).status).toBe(503);
    vi.stubEnv("OPENAI_API_KEY", "");
    expect((await GET()).status).toBe(200);
    expect(await (await GET()).json()).toEqual({ enabled: false });
    expect((await POST(upload())).status).toBe(503);
    expect(mocks.extract).not.toHaveBeenCalled();
  });
  it("rejects chunked oversized bodies without trusting Content-Length", async () => {
    const request = new Request("https://studio.example/api/admin/cv-import", {
      body: new Uint8Array(3 * 1024 * 1024 + 65537),
      headers: {
        "Content-Type": "multipart/form-data; boundary=x",
        origin: "https://studio.example",
      },
      method: "POST",
    });
    expect((await POST(request)).status).toBe(413);
    expect(mocks.extract).not.toHaveBeenCalled();
  });
});
