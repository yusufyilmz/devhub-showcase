import { describe, expect, it } from "vitest";

import { profile } from "@shared/config";

import { readRecovery, recoveryRetention } from "./storage";

const record = {
  at: 100,
  revision: 3,
  value: { isPublic: false, profile, step: "details", tab: "Profile", username: "owner" },
  version: 1,
};
describe("draft recovery records", () => {
  it("retains incomplete text without changing visibility or the baseline revision", () => {
    const value = { ...record.value, profile: { ...profile, email: "incomplete", title: "" } };
    const result = readRecovery(JSON.stringify({ ...record, value }), 101);
    expect(result?.value.profile.title).toBe("");
    expect(result?.value.profile.email).toBe("incomplete");
    expect(result?.value.isPublic).toBe(false);
    expect(result?.revision).toBe(3);
  });
  it("rejects malformed, expired, future, oversized and structurally invalid records", () => {
    expect(readRecovery("bad", 101)).toBeNull();
    expect(readRecovery(JSON.stringify(record), 101 + recoveryRetention)).toBeNull();
    expect(readRecovery(JSON.stringify(record), 99)).toBeNull();
    expect(readRecovery(" ".repeat(250001), 101)).toBeNull();
    expect(
      readRecovery(
        JSON.stringify({
          ...record,
          value: { ...record.value, profile: { ...profile, experiences: [null] } },
        }),
        101,
      ),
    ).toBeNull();
    expect(
      readRecovery(
        JSON.stringify({
          ...record,
          value: { ...record.value, profile: { ...profile, portfolioType: "invalid" } },
        }),
        101,
      ),
    ).toBeNull();
  });
});
