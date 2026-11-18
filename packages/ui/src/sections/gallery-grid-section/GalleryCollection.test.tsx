// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import type { CustomSection } from "@shared/config/sections";

import { GalleryCollection } from "./GalleryCollection";

const section: CustomSection = {
  id: "custom-gallery",
  items: [
    {
      body: "First body",
      id: "first",
      imageUrl: "/examples/orbit-brand.svg",
      title: "Orbit",
      url: "",
    },
    {
      body: "Second body",
      id: "second",
      imageUrl: "/examples/atlas-interface.svg",
      title: "Atelier",
      url: "",
    },
  ],
  renderer: "gallery",
  title: "Work",
  visible: true,
} as const;

describe("GalleryCollection", () => {
  afterEach(cleanup);

  it("opens the clicked image", async () => {
    render(<GalleryCollection section={section} size="md" />);
    fireEvent.click(screen.getByRole("button", { name: "View Atelier" }));
    const dialog = await screen.findByRole("dialog");
    expect(dialog.textContent).toContain("Atelier");
    expect(dialog.textContent).toContain("2 / 2");
  });
});
