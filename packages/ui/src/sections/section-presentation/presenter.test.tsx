// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { AboutSection } from "../about-section/AboutSection";
import { CareersSection } from "../careers-section/CareersSection";
import { TextSection } from "../text-section/TextSection";
import { WorkExperienceSection } from "../work-experience-section/WorkExperienceSection";

const item = {
  body: "A paragraph that stays in the section.",
  id: "note",
  title: "Note",
  url: "",
};

describe("Intro section spacing", () => {
  afterEach(() => {
    cleanup();
  });

  it("keeps text content in a composed frame without an outer margin", () => {
    render(
      <TextSection
        section={{
          id: "custom-text",
          items: [item],
          options: { description: "A short introduction." },
          renderer: "text",
          title: "Notes",
          visible: true,
        }}
      />,
    );

    const frame = document.getElementById("custom-text");
    expect(frame?.getAttribute("data-section-context")).toBe("composed");
    expect(frame?.getAttribute("data-section-width")).toBe("reading");
    expect(frame?.className.includes("my-0")).toBe(true);
    expect(frame?.className.includes("py-14")).toBe(false);
    expect(screen.getByRole("heading", { level: 2, name: "Notes" })).toBeTruthy();
    expect(screen.getByText("A paragraph that stays in the section.")).toBeTruthy();
    expect(screen.getByText("A short introduction.").tagName).toBe("P");
  });

  it("hides an empty text section", () => {
    const { container } = render(
      <TextSection
        section={{
          id: "custom-empty",
          items: [],
          renderer: "text",
          title: "Empty",
          visible: true,
        }}
      />,
    );
    expect(container.childElementCount).toBe(0);
  });

  it("keeps the editorial about story beside its heading", () => {
    render(
      <AboutSection
        section={{
          id: "custom-about",
          items: [item, { ...item, body: "A second fact.", id: "fact", title: "Fact" }],
          options: { description: "Studio notes.", layout: "about-editorial" },
          renderer: "cards",
          title: "About",
          visible: true,
        }}
      />,
    );

    const frame = document.getElementById("custom-about");
    expect(frame?.getAttribute("data-section-layout")).toBe("about-editorial");
    expect(frame?.className.includes("py-xl")).toBe(false);
    expect(screen.getByRole("heading", { level: 2, name: "About" })).toBeTruthy();
    expect(screen.getByRole("heading", { level: 3, name: "Note" })).toBeTruthy();
    expect(screen.getByText("A second fact.")).toBeTruthy();
  });

  it("keeps a work timeline in the composed frame", () => {
    render(
      <WorkExperienceSection
        section={{
          id: "custom-work",
          items: [item],
          options: { description: "Recent roles." },
          renderer: "timeline",
          title: "Experience",
          visible: true,
        }}
      />,
    );
    const frame = document.getElementById("custom-work");
    expect(frame?.getAttribute("data-section-context")).toBe("composed");
    expect(frame?.className.includes("py-14")).toBe(false);
    expect(screen.getByRole("heading", { name: "Experience" })).toBeTruthy();
    expect(screen.getByText("A paragraph that stays in the section.")).toBeTruthy();
  });

  it("keeps career openings expandable without outer section padding", () => {
    render(
      <CareersSection
        section={{
          id: "custom-roles",
          items: [item, { ...item, id: "second", title: "Second role" }],
          options: { description: "Open roles.", layout: "careers-openings" },
          renderer: "list",
          title: "Careers",
          visible: true,
        }}
      />,
    );
    const frame = document.getElementById("custom-roles");
    expect(frame?.getAttribute("data-section-layout")).toBe("careers-openings");
    expect(frame?.className.includes("py-xl")).toBe(false);
    expect(screen.getByText("Note").closest("summary")).toBeTruthy();
    expect(screen.getByText("Second role").closest("summary")).toBeTruthy();
  });
});
