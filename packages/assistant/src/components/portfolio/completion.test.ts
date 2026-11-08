import { describe, expect, it } from "vitest";

import { profile } from "@shared/config";

import { portfolioCompletion } from "./completion";

describe("portfolio completion guidance", () => {
  it("ignores blank essentials and private projects and recomputes after deleting content", () => {
    const empty = {
      ...profile,
      email: "",
      experiences: [],
      name: " ",
      projects: [{ ...profile.projects[0]!, public: false }],
      skills: { Empty: [" "] },
      summary: " ",
      title: "",
    };
    expect(portfolioCompletion(empty).every((item) => !item.complete)).toBe(true);
    expect(
      portfolioCompletion(profile)
        .filter((item) => item.essential)
        .every((item) => item.complete),
    ).toBe(true);
    expect(
      portfolioCompletion({ ...profile, summary: "" }).find(
        (item) => item.label === "Short introduction",
      )?.complete,
    ).toBe(false);
  });
});
