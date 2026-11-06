import { describe, expect, it, vi } from "vitest";

import type { SupabaseDbClient } from "@shared/lib/types";

import { companionProgressHandlers } from "./progress";

const url = "https://example.test/api/companion-progress";
const user = { id: "verified-owner" };
const request = (data: unknown, origin = "https://example.test") =>
  new Request(url, { body: JSON.stringify(data), headers: { Origin: origin }, method: "POST" });

describe("companion progress", () => {
  function setup(allowed = true) {
    const upsert = vi.fn().mockResolvedValue({ error: null });
    const from = vi.fn().mockReturnValue({ upsert });
    const client = { from } as unknown as SupabaseDbClient;
    const identify = vi.fn().mockResolvedValue({ client, user: allowed ? user : null });
    return {
      from,
      handlers: companionProgressHandlers({
        app: "studio",
        identify,
        sameOrigin: (input) => input.headers.get("origin") === new URL(input.url).origin,
      }),
      identify,
      upsert,
    };
  }
  it("uses the verified owner and deduplicates a retried batch", async () => {
    const { handlers, upsert } = setup();
    const response = await handlers.POST(
      request({ ids: ["visual-order", "visual-order"], user_id: "another-user" }),
    );
    expect(response.status).toBe(204);
    expect(upsert).toHaveBeenCalledWith(
      [{ app: "studio", feature_id: "visual-order", user_id: user.id }],
      { ignoreDuplicates: true, onConflict: "user_id,app,feature_id" },
    );
  });
  it("rejects cross-origin writes and invalid IDs", async () => {
    const { handlers, identify, from } = setup();
    expect(
      (await handlers.POST(request({ ids: ["visual-order"] }, "https://other.test"))).status,
    ).toBe(403);
    expect(identify).not.toHaveBeenCalled();
    expect((await handlers.POST(request({ ids: ["../bad"] }))).status).toBe(400);
    expect(from).not.toHaveBeenCalled();
  });
  it("keeps both read and write unavailable to visitors", async () => {
    const { handlers, from } = setup(false);
    expect((await handlers.GET(new Request(url))).status).toBe(401);
    expect((await handlers.POST(request({ ids: ["visual-order"] }))).status).toBe(401);
    expect(from).not.toHaveBeenCalled();
  });
});
