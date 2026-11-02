import { describe, expect, it } from "vitest";

import { profile } from "@shared/config";

import { getPortfolioResources } from ".";

describe("getPortfolioResources", () => {
  it("preserves a public project cover when adapting the profile for engineer cards", () => {
    const result = getPortfolioResources({
      ...profile,
      projects: [
        { ...profile.projects[0]!, coverImage: "/examples/atlas-interface.svg", public: true },
      ],
    });
    expect(result.projects[0]?.imageUrl).toBe("/examples/atlas-interface.svg");
  });
  it("links a personal project to its live app and GitHub source", () => {
    const project = getPortfolioResources().projects.find((item) => item.id === "fitness-os");
    if (!project) throw new Error("Missing Fitness OS project");
    expect(project.link).toBe("https://my-fitness-app.vercel.app");
    expect(project.sourceUrl).toBe("https://github.com/yusufyilmz/my-fitness-app");
  });
});
