// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { IconButton, IconButtonWithLink } from "./IconButton";

describe("IconButton", () => {
  afterEach(cleanup);
  it("defaults to a non-submitting action and forwards its label and palette", () => {
    const click = vi.fn();
    render(
      <form>
        <IconButton aria-label="Open menu" onClick={click} surface="portfolio" variant="outline">
          <svg aria-hidden="true" />
        </IconButton>
      </form>,
    );
    const button = screen.getByRole("button", { name: "Open menu" });
    expect(button.getAttribute("type")).toBe("button");
    expect(button.dataset.surface).toBe("portfolio");
    fireEvent.click(button);
    expect(click).toHaveBeenCalledOnce();
  });
  it("renders an icon link as one accessible target", () => {
    render(
      <IconButtonWithLink href="https://example.test" label="LinkedIn">
        <svg aria-hidden="true" />
      </IconButtonWithLink>,
    );
    const link = screen.getByRole("link", { name: "LinkedIn" });
    expect(link.getAttribute("href")).toBe("https://example.test");
    expect(link.getAttribute("rel")).toBe("noopener noreferrer");
    expect(screen.queryByRole("button")).toBeNull();
  });
});
