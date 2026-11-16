// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { sectionExamples } from "./preview-examples";
import { SectionCatalog } from "./section-catalog";

describe("Section catalog", () => {
  afterEach(cleanup);

  it("lists every example and mounts only the selected renderer", () => {
    render(<SectionCatalog />);
    const selector = screen.getByRole("combobox", { name: "Section example" });
    expect(within(selector).getAllByRole("option")).toHaveLength(sectionExamples.length);
    expect(screen.getByRole("region", { name: "Services section example" })).toBeTruthy();
    expect(screen.queryByRole("region", { name: "Gallery Grid section example" })).toBeNull();
    fireEvent.change(selector, { target: { value: "gallery-grid" } });
    expect(screen.getByRole("region", { name: "Gallery Grid section example" })).toBeTruthy();
    expect(screen.queryByRole("region", { name: "Services section example" })).toBeNull();
  });

  it("filters by name, description and category, and can clear filters", () => {
    render(<SectionCatalog />);
    const search = screen.getByRole("searchbox", { name: "Find a section" });
    fireEvent.change(search, { target: { value: "  ViSuAl GrId " } });
    expect(screen.getByRole("option", { name: "Gallery Grid" })).toBeTruthy();
    expect(screen.queryByRole("option", { name: "Contact Form" })).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Connect" }));
    expect(screen.getByText("No sections match your search.")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Clear filters" }));
    expect(screen.getAllByRole("option")).toHaveLength(sectionExamples.length);
    expect(screen.getByRole("button", { name: "All" }).getAttribute("aria-pressed")).toBe("true");
  });
});
