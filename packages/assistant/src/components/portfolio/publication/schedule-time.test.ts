import { describe, expect, it } from "vitest";

import { scheduledInstant } from "./schedule-time";

describe("scheduled publication time", () => {
  it("rejects invalid/normalized calendar dates and shows the exact instant for a valid local time", () => {
    expect(scheduledInstant("")).toBeNull();
    expect(scheduledInstant("2027-02-30T12:00")).toBeNull();
    expect(scheduledInstant("2027-01-01T12:00Z")).toBeNull();
    expect(scheduledInstant("2027-01-01T12:00")).toBe(new Date(2027, 0, 1, 12, 0).toISOString());
  });
});
