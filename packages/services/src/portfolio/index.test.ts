import { describe, expect, it } from "vitest";

import { getPortfolioResources } from ".";

describe("getPortfolioResources", () => {
  it("links a personal project to its live app and GitHub source", () => {
    const project = getPortfolioResources().projects.find((item) => item.id === "fitness-os");
    if (!project) throw new Error("Missing Fitness OS project");
    expect(project.link).toBe("https://my-fitness-app.vercel.app");
    expect(project.sourceUrl).toBe("https://github.com/yusufyilmz/my-fitness-app");
  });
});
