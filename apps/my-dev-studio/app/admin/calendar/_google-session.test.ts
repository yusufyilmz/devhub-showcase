import { describe, expect, it } from "vitest";

import { openGoogleSession, sealGoogleSession } from "./_google-session";

const key = "f".repeat(64);

describe("Google Calendar session", () => {
  it("opens only for the Studio account that connected Google", () => {
    const value = sealGoogleSession(key, "account-a", "connection", "refresh-token", 60);
    expect(value).not.toContain("refresh-token");
    expect(openGoogleSession(key, "account-a", "connection", value)).toBe("refresh-token");
    expect(openGoogleSession(key, "account-b", "connection", value)).toBeUndefined();
    expect(openGoogleSession(key, "account-a", "oauth", value)).toBeUndefined();
  });

  it("rejects expired or altered cookies", () => {
    const value = sealGoogleSession(key, "account-a", "oauth", "verifier", 0);
    expect(openGoogleSession(key, "account-a", "oauth", value)).toBeUndefined();
    const altered = sealGoogleSession(key, "account-a", "oauth", "verifier", 60).split(".");
    altered[2] = "invalid";
    expect(openGoogleSession(key, "account-a", "oauth", altered.join("."))).toBeUndefined();
  });
});
