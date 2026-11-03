import { describe, expect, it, vi } from "vitest";

import { profile } from "@shared/config";
import type { SupabaseDbClient } from "@shared/lib/types";

import { SupabaseProfileRepository } from "./supabase";

describe("private draft saves", () => {
  it("ignores the legacy isPublic input and still guards the saved revision", async () => {
    const eq = vi.fn().mockReturnThis();
    const update = vi.fn().mockReturnThis();
    const client = {
      from: () => ({
        eq,
        maybeSingle: async () => ({
          data: {
            document: profile,
            id: "main",
            is_public: true,
            revision: 3,
            updated_at: "",
            username: "example-owner",
          },
          error: null,
        }),
        select: vi.fn().mockReturnThis(),
        update,
      }),
    } as unknown as SupabaseDbClient;
    const saved = await new SupabaseProfileRepository(client).save(
      profile,
      2,
      false,
      "new-draft-name",
    );
    expect(update.mock.calls[0]?.[0]).toMatchObject({ revision: 3, username: "new-draft-name" });
    expect(update.mock.calls[0]?.[0]).not.toHaveProperty("is_public");
    expect(eq).toHaveBeenCalledWith("revision", 2);
    expect(saved?.isPublic).toBe(true);
  });
});
