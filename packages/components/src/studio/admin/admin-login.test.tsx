// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { AdminLogin } from "./admin-login";

describe("AdminLogin", () => {
  afterEach(cleanup);
  it("offers Google sign in independently of the password form and shows callback errors", () => {
    render(<AdminLogin initialError="Choose your owner account." />);
    const button = screen.getByRole("button", { name: "Continue with Google" });
    expect(button.closest("form")?.getAttribute("method")).toBe("post");
    expect(button.closest("form")?.getAttribute("action")).toBe("/api/admin/google");
    expect(button.closest("form")?.contains(screen.getByLabelText("Password"))).toBe(false);
    expect(screen.getByRole("alert").textContent).toBe("Choose your owner account.");
  });
});
