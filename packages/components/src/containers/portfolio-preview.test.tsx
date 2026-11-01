// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { PortfolioPreview } from "./portfolio-preview";

describe("PortfolioPreview", () => {
  afterEach(() => {
    cleanup();
  });
  it("switches the example between portfolio and PDF with labelled tabs and keyboard navigation", () => {
    render(<PortfolioPreview />);
    const portfolio = screen.getByRole("tab", { name: "Portfolio" });
    const cv = screen.getByRole("tab", { name: "CV" });
    expect(portfolio.getAttribute("aria-selected")).toBe("true");
    fireEvent.keyDown(portfolio, { key: "ArrowRight" });
    expect(cv.getAttribute("aria-selected")).toBe("true");
    expect(document.activeElement).toBe(cv);
    expect(screen.getByRole("tabpanel").getAttribute("aria-labelledby")).toBe(cv.id);
    expect(screen.getByText("YOUR DOWNLOADABLE CV")).toBeTruthy();
    fireEvent.keyDown(cv, { key: "Home" });
    expect(portfolio.getAttribute("aria-selected")).toBe("true");
    expect(document.activeElement).toBe(portfolio);
    fireEvent.click(screen.getByRole("button", { name: /Preview your CV/ }));
    expect(cv.getAttribute("aria-selected")).toBe("true");
    expect(document.activeElement).toBe(cv);
  });
  it("previews accent choices without navigation or modifying a portfolio", () => {
    const { container } = render(<PortfolioPreview />);
    const violet = screen.getByRole("button", { name: "Preview in violet" });
    fireEvent.click(violet);
    expect(violet.getAttribute("aria-pressed")).toBe("true");
    expect(
      screen.getByRole("button", { name: "Preview in cyan" }).getAttribute("aria-pressed"),
    ).toBe("false");
    expect(
      container.querySelector("[data-preview-accent]")?.getAttribute("data-preview-accent"),
    ).toBe("violet");
  });
});
