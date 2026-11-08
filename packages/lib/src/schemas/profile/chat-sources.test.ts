import { describe, expect, it } from "vitest";

import { profile } from "@shared/config";

import { publicChatSources } from "./chat-sources";

const snapshot = {
  id: "owner",
  isPublic: true,
  profile: { ...profile, sectionSettings: { experience: { visible: false } } },
  revision: 1,
  updatedAt: "",
  username: "owner",
};
describe("published chat sources", () => {
  it("links only visible published sections using the current portfolio identity", () => {
    const sources = publicChatSources(snapshot);
    expect(sources.some((source) => source.href.includes("experience"))).toBe(false);
    expect(sources.every((source) => source.href.startsWith("/owner#"))).toBe(true);
    expect(sources.some((source) => source.href.endsWith("#about-me"))).toBe(true);
    expect(publicChatSources({ ...snapshot, isPublic: false })).toEqual([]);
    expect(
      publicChatSources({ ...snapshot, profile: { ...profile, portfolioType: "designer" } }).some(
        (source) => source.href.endsWith("#work"),
      ),
    ).toBe(true);
  });
});
