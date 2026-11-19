import { describe, expect, it } from "vitest";

import { calendarRangeSchema, taskDraftSchema } from "./calendar";

describe("calendar schemas", () => {
  it("rejects impossible dates, reversed ranges, and unknown time zones", () => {
    expect(
      calendarRangeSchema.safeParse({ from: "2026-02-30", timeZone: "UTC", to: "2026-03-04" })
        .success,
    ).toBe(false);
    expect(
      calendarRangeSchema.safeParse({ from: "2026-11-17", timeZone: "UTC", to: "2026-11-16" })
        .success,
    ).toBe(false);
    expect(
      calendarRangeSchema.safeParse({ from: "2026-11-16", timeZone: "Unknown", to: "2026-11-17" })
        .success,
    ).toBe(false);
  });

  it("trims a task title and rejects a blank title", () => {
    const draft = {
      completed: false,
      date: "2026-11-17",
      description: "",
      time: null,
      title: " Review roadmap ",
    };
    expect(taskDraftSchema.parse(draft).title).toBe("Review roadmap");
    expect(taskDraftSchema.safeParse({ ...draft, title: " " }).success).toBe(false);
  });
});
