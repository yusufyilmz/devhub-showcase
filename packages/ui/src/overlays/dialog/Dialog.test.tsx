// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { Dialog, DialogContent, DialogTitle } from "./Dialog";

describe("Dialog", () => {
  afterEach(cleanup);

  it.each([
    ["sm", "sm:max-w-sm"],
    ["md", "sm:max-w-lg"],
    ["lg", "sm:max-w-4xl"],
  ] as const)("applies the %s width", (size, widthClass) => {
    render(
      <Dialog open>
        <DialogContent size={size}>
          <DialogTitle>Review your changes</DialogTitle>
        </DialogContent>
      </Dialog>,
    );

    const dialog = screen.getByRole("dialog");
    expect(dialog.getAttribute("data-size")).toBe(size);
    expect(dialog.className).toContain(widthClass);
  });

  it("keeps the default width when size is omitted", () => {
    render(
      <Dialog open>
        <DialogContent>
          <DialogTitle>Review your changes</DialogTitle>
        </DialogContent>
      </Dialog>,
    );

    const dialog = screen.getByRole("dialog");
    expect(dialog.hasAttribute("data-size")).toBe(false);
    expect(dialog.className).toContain("sm:max-w-lg");
    expect(dialog.className).not.toContain("sm:max-w-sm");
    expect(dialog.className).not.toContain("sm:max-w-4xl");
  });
});
