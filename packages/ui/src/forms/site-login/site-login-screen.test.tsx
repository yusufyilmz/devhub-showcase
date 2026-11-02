// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { SiteLoginScreen } from "./site-login-screen";

describe("SiteLoginScreen", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders shared login chrome and site copy for MyDevStudio", () => {
    render(<SiteLoginScreen site="my-dev-studio" />);
    expect(screen.getByText("↗ MyDevStudio")).toBeTruthy();
    expect(screen.getByRole("heading").textContent).toContain("portfolio studio.");
    expect(screen.getByText("Open studio →")).toBeTruthy();
  });

  it("maps fitness error codes from site copy", () => {
    render(<SiteLoginScreen errorCode="unconfirmed" site="my-fitness-app" />);
    expect(screen.getByRole("alert").textContent).toBe("Confirm your account before continuing.");
  });
});
