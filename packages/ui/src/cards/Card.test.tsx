// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { Card } from "./Card";

describe("Card semantic composition", () => {
  afterEach(cleanup);
  it("keeps empty type equivalent to the original surface and does not leak type to the DOM", () => {
    render(
      <Card aria-label="Plain card" type="">
        Body
      </Card>,
    );
    const card = screen.getByLabelText("Plain card");
    expect(card.dataset.slot).toBe("card");
    expect(card.hasAttribute("type")).toBe(false);
  });
  it("routes reveal cards to the interactive reveal component without recursive card rendering", () => {
    render(
      <Card brief="Overview" heading={<h3>Project</h3>} title="Project" type="reveal">
        Details
      </Card>,
    );
    const toggle = screen.getByRole("button", { name: "Show details for Project" });
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    fireEvent.click(toggle);
    expect(toggle.getAttribute("aria-expanded")).toBe("true");
    expect(document.querySelectorAll('[data-slot="card"]')).toHaveLength(1);
  });
  it("routes appearance, variant and content options to the existing components", () => {
    const { rerender } = render(
      <Card appearance="muted" aria-label="Appearance" type="appearance">
        Body
      </Card>,
    );
    expect(screen.getByLabelText("Appearance").className).toContain("bg-gradient");
    rerender(
      <Card aria-label="Variant" type="variants" variant="glass">
        Body
      </Card>,
    );
    expect(screen.getByLabelText("Variant").className).toContain("backdrop-blur");
    rerender(<Card description="A content card" title="Story" type="content" />);
    expect(screen.getByText("Story")).toBeTruthy();
    expect(screen.getByText("A content card")).toBeTruthy();
  });
  it("supports composed hover triggers and motion types without adding extra interactive wrappers", () => {
    const { rerender } = render(
      <Card trigger={<a href="/project">Project preview</a>} type="hover">
        More details
      </Card>,
    );
    expect(screen.getByRole("link", { name: "Project preview" }).getAttribute("data-slot")).toBe(
      "hover-card-trigger",
    );
    rerender(
      <Card asChild type="tilt">
        <article aria-label="Tilt card">Project</article>
      </Card>,
    );
    expect(screen.getByRole("article").dataset.cardType).toBe("tilt");
    rerender(
      <Card aria-label="Animated" type="animated">
        Project
      </Card>,
    );
    expect(screen.getByLabelText("Animated").dataset.cardType).toBe("animated");
  });
  it("preserves article semantics and forwards its accessible name", () => {
    render(
      <Card asChild interaction="lift" layout="plain" surface="portfolio">
        <article aria-label="Selected project">
          <a href="/demo">Project</a>
        </article>
      </Card>,
    );
    const article = screen.getByRole("article", { name: "Selected project" });
    expect(article.dataset.slot).toBe("card");
    expect(article.parentElement?.querySelectorAll("article")).toHaveLength(1);
    expect(screen.queryByRole("button")).toBeNull();
  });
});
