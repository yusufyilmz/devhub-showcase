import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  importer: vi.fn(async () => ({ imported: 1, duplicates: 0, summary: "Found a role." })),
  workspace: vi.fn(async () => ({ user: { id: "signed-in" } })),
}));

vi.mock("@/services/admin/get-auth", () => ({
  requireWorkspace: mocks.workspace,
  sameOrigin: (request: Request) => request.headers.get("origin") === "https://studio.test",
}));

vi.mock("@/services/jobs/import-chatgpt", () => ({ importChatgptResearch: mocks.importer }));

import { ProfileAccessError } from "@shared/lib/profile";

import { POST } from "./route";

const example = JSON.stringify({
  schemaVersion: 1,
  report: {
    generatedAt: "2026-11-19T19:00:00Z",
    source: "chatgpt_automation",
    automationTitle: "Job research",
    summary: "One result.",
  },
  jobs: [{ title: "Engineer", company: "Example", originalUrl: "https://example.com/jobs/1" }],
});

function request(body = example, origin = "https://studio.test") {
  return new Request("https://studio.test/api/jobs/import-chatgpt", {
    body,
    headers: { origin, "content-type": "application/json" },
    method: "POST",
  });
}

describe("ChatGPT job import API", () => {
  beforeEach(() => vi.clearAllMocks());

  it("rejects cross-origin before reading the workspace", async () => {
    expect((await POST(request(example, "https://attacker.test"))).status).toBe(403);
    expect(mocks.workspace).not.toHaveBeenCalled();
  });

  it("requires a signed-in workspace", async () => {
    mocks.workspace.mockRejectedValueOnce(new ProfileAccessError());
    expect((await POST(request())).status).toBe(403);
    expect(mocks.importer).not.toHaveBeenCalled();
  });

  it("rejects oversized reports", async () => {
    expect((await POST(request("x".repeat(20_001)))).status).toBe(413);
    expect(mocks.importer).not.toHaveBeenCalled();
  });

  it("rejects malformed JSON", async () => {
    expect((await POST(request("{broken"))).status).toBe(400);
  });

  it("previews without saving when requested", async () => {
    const previewRequest = new Request(
      "https://studio.test/api/jobs/import-chatgpt?preview=1",
      {
        body: example,
        headers: { origin: "https://studio.test" },
        method: "POST",
      },
    );
    expect((await POST(previewRequest)).status).toBe(200);
    expect(mocks.importer).toHaveBeenCalledWith(
      { user: { id: "signed-in" } },
      JSON.parse(example),
      true,
    );
  });

  it("delegates report persistence with the confirmed workspace", async () => {
    const response = await POST(request());
    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("private, no-store");
    expect(mocks.importer).toHaveBeenCalledWith(
      { user: { id: "signed-in" } },
      JSON.parse(example),
      false,
    );
  });
});
