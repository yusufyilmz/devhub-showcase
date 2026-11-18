// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";

import { sectionExamples } from "./preview-examples";
import { SectionGallery } from "./section-gallery";

afterEach(cleanup);

it("opens the section gallery and mounts only the active preview", async () => {
  render(<SectionGallery />);
  const [first, second] = sectionExamples;
  const trigger = screen.getByRole("button", { name: "Open section gallery" });
  expect(screen.queryByRole("dialog")).toBeNull();

  fireEvent.click(trigger);
  const dialog = screen.getByRole("dialog");
  expect(
    within(dialog).getByRole("region", { name: `${first?.name} section example` }),
  ).toBeTruthy();
  expect(
    within(dialog)
      .getByRole("navigation", { name: "Gallery thumbnails" })
      .querySelectorAll("button"),
  ).toHaveLength(sectionExamples.length);

  fireEvent.keyDown(dialog, { key: "ArrowRight" });
  expect(
    within(dialog).queryByRole("region", { name: `${first?.name} section example` }),
  ).toBeNull();
  expect(
    within(dialog).getByRole("region", { name: `${second?.name} section example` }),
  ).toBeTruthy();
  fireEvent.keyDown(dialog, { key: "Escape" });
  expect(screen.queryByRole("dialog")).toBeNull();
  await waitFor(() => expect(document.activeElement).toBe(trigger));
});
