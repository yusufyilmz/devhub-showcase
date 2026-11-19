import { describe, expect, it } from "vitest";

import { calendarRange } from "./range";

describe("calendarRange", () => {
  it("covers all six rows of a month that starts on Sunday", () => {
    expect(calendarRange("2026-11-17")).toEqual({ from: "2026-10-26", to: "2026-12-07" });
  });
});
