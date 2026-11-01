// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { ProjectItem, SummarySection } from "@shared/components/sections";
import { profile } from "@shared/config";
import { getPortfolioResources } from "@shared/lib/portfolio";
import { RevealCard } from "@shared/ui/reveal-card";

describe("PortfolioUi", () => {
  afterEach(cleanup);
  it("renders the current professional title in the existing hero layout", () => {
    render(<SummarySection />);
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(`${profile.name}.`);
    expect(screen.getByRole("heading", { level: 2 }).textContent).toBe(profile.title);
  });
  it("links a personal project to its live app and GitHub source", () => {
    const project = getPortfolioResources().projects.find((item) => item.id === "fitness-os");
    if (!project) throw new Error("Missing Fitness OS project");
    render(<ProjectItem project={project} />);
    fireEvent.click(screen.getByRole("button", { name: `Show details for ${project.title}` }));
    expect(screen.getByRole("link", { name: "Visit project" }).getAttribute("href")).toBe(
      "https://my-fitness-app.vercel.app",
    );
    expect(screen.getByRole("link", { name: "Source on GitHub" }).getAttribute("href")).toBe(
      "https://github.com/yusufyilmz/my-fitness-app",
    );
  });

  it("previews on hover, closes on leave, and supports touch, focus and Escape", () => {
    render(
      <RevealCard brief="Brief summary" heading={<h3>Example</h3>} title="Example">
        <a href="https://example.com">Full details link</a>
      </RevealCard>,
    );
    const card = screen.getByRole("article");
    const toggle = screen.getByRole("button");
    expect(screen.queryByRole("link")).toBeNull();
    fireEvent.pointerEnter(card, { pointerType: "mouse" });
    expect(toggle.getAttribute("aria-expanded")).toBe("true");
    fireEvent.pointerLeave(card, { pointerType: "mouse" });
    expect(screen.queryByRole("link")).toBeNull();
    fireEvent.click(toggle);
    expect(screen.getByRole("link")).toBeTruthy();
    fireEvent.pointerLeave(card);
    expect(screen.getByRole("link")).toBeTruthy();
    fireEvent.click(toggle);
    expect(screen.queryByRole("link")).toBeNull();
    fireEvent.focus(toggle);
    expect(screen.getByRole("link")).toBeTruthy();
    fireEvent.keyDown(toggle, { key: "Escape" });
    expect(screen.queryByRole("link")).toBeNull();
  });
});
