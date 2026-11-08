// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { profile } from "@shared/config";
import { RevealCard } from "@shared/ui/cards";

import { SummarySection } from "./summary-section";

describe("PortfolioUi", () => {
  afterEach(cleanup);
  it("renders the current professional title in the existing hero layout", () => {
    render(<SummarySection />);
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(`${profile.name}.`);
    expect(screen.getByRole("heading", { level: 2 }).textContent).toBe(profile.title);
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
