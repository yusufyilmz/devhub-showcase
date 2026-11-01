// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { authorableSectionTypes } from "@shared/config";

import { SectionCatalog } from "./section-catalog";

describe("Section catalog", () => {
  afterEach(cleanup);
  it("lists every registered type and filters names without case sensitivity", () => {
    render(<SectionCatalog />);
    const list = screen.getByRole("list", { name: "Available section types" });
    expect(within(list).getAllByRole("listitem")).toHaveLength(authorableSectionTypes.length);
    fireEvent.change(screen.getByRole("searchbox", { name: "Find a section" }), {
      target: { value: "  YOUTUBE " },
    });
    expect(within(list).getAllByRole("listitem")).toHaveLength(1);
    expect(within(list).getByRole("heading", { name: "YouTube" })).toBeTruthy();
  });
  it("combines category and search filters and restores results from an empty search", () => {
    render(<SectionCatalog />);
    fireEvent.click(screen.getByRole("button", { name: "Connect" }));
    const list = screen.getByRole("list", { name: "Available section types" });
    expect(within(list).getByRole("heading", { name: "Contact Form" })).toBeTruthy();
    expect(within(list).queryByRole("heading", { name: "Gallery Grid" })).toBeNull();
    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "no matching section" } });
    expect(screen.getByText("No sections match your search.")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Clear filters" }));
    expect(within(list).getAllByRole("listitem")).toHaveLength(authorableSectionTypes.length);
    expect(screen.getByRole("button", { name: "All" }).getAttribute("aria-pressed")).toBe("true");
  });
});
