import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  importer: vi.fn(async () => ({ duplicates: 0, imported: 1, summary: "Found a role." })),
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
  jobs: [{ company: "Example", originalUrl: "https://example.com/jobs/1", title: "Engineer" }],
  report: {
    automationTitle: "Job research",
    generatedAt: "2026-11-19T19:00:00Z",
    source: "chatgpt_automation",
    summary: "One result.",
  },
  schemaVersion: 1,
});

function request(body = example, origin = "https://studio.test", preview = false) {
  return new Request(
    `https://studio.test/api/jobs/import-chatgpt${preview ? "?preview=1" : ""}`,
    {
      body,
      headers: { origin },
      method: "POST",
    },
  );
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
    expect((await POST(request(example, "https://studio.test", true))).status).toBe(200);
    expect(mocks.importer).toHaveBeenCalledWith(
      { user: { id: "signed-in" } },
      JSON.parse(example),
      true,
    );
  });

  it("delegates persistence with the confirmed workspace", async () => {
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
