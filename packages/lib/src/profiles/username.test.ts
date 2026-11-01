import { describe, expect, it } from "vitest";

import { usernameSchema } from "./username";

describe("Username", () => {
  it("rejects reserved, malformed, and path injection usernames and normalizes names", () => {
    for (const value of [
      "admin",
      "api",
      "reviews",
      "auth",
      "../alice",
      "alice/edit",
      "alice.pdf",
      "-alice",
      "alice--smith",
      "ab",
      "a".repeat(51),
    ])
      expect(usernameSchema.safeParse(value).success).toBe(false);
    expect(usernameSchema.parse(" Alice-Smith ")).toBe("alice-smith");
  });
});
