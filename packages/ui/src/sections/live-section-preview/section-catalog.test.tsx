// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { sectionExamples } from "./preview-examples";
import { SectionCatalog } from "./section-catalog";

describe("Section catalog", () => {
  afterEach(cleanup);

  it("renders a visual card for every example and mounts only the selected renderer", () => {
    render(<SectionCatalog />);
    const list = screen.getByRole("list", { name: "Available section types" });
    expect(within(list).getAllByRole("listitem")).toHaveLength(sectionExamples.length);
    expect(list.querySelectorAll("[data-preview-kind]")).toHaveLength(sectionExamples.length);
    expect(screen.queryByRole("region", { name: "Services section example" })).toBeNull();
    fireEvent.click(within(list).getByRole("button", { name: /^Services$/ }));
    expect(screen.getByRole("region", { name: "Services section example" })).toBeTruthy();
    const gallery = within(list).getByRole("button", { name: /^Gallery Grid$/ });
    fireEvent.click(gallery);
    expect(screen.getByRole("region", { name: "Gallery Grid section example" })).toBeTruthy();
    expect(screen.queryByRole("region", { name: "Services section example" })).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Close preview" }));
    expect(screen.queryByRole("region", { name: "Gallery Grid section example" })).toBeNull();
    expect(document.activeElement).toBe(gallery);
  });

  it("switches the selected example between block layouts", () => {
    const { container } = render(<SectionCatalog />);
    fireEvent.change(screen.getByRole("searchbox", { name: "Find a section" }), {
      target: { value: "FAQ" },
    });
    fireEvent.click(screen.getByRole("button", { name: /^FAQ$/ }));
    const centered = screen.getByRole("button", { name: "Centered questions" });
    fireEvent.click(centered);
    expect(centered.getAttribute("aria-pressed")).toBe("true");
    expect(container.querySelector('[data-section-layout="faq-stacked"]')).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Default" }));
    expect(container.querySelector('[data-section-layout="faq-stacked"]')).toBeNull();
  });

  it("keeps the original show-all control and filters by name, description and category", () => {
    render(<SectionCatalog />);
    const list = screen.getByRole("list", { name: "Available section types" });
    const expand = screen.getByRole("button", { name: /Show all section types/ });
    expect(list.getAttribute("data-expanded")).toBe("false");
    fireEvent.click(expand);
    expect(expand.getAttribute("aria-expanded")).toBe("true");
    const search = screen.getByRole("searchbox", { name: "Find a section" });
    fireEvent.change(search, { target: { value: "  ViSuAl GrId " } });
    expect(screen.getByRole("button", { name: "Gallery Grid" })).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Contact Form" })).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Connect" }));
    expect(screen.getByText("No sections match your search.")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Clear filters" }));
    expect(within(list).getAllByRole("listitem")).toHaveLength(sectionExamples.length);
    expect(screen.getByRole("button", { name: "All" }).getAttribute("aria-pressed")).toBe("true");
  });
});
