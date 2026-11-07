// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { LoginPanel } from "./login-panel";

describe("LoginPanel", () => {
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });
  it("configures the same login panel for a fitness app without portfolio endpoints", () => {
    render(
      <LoginPanel
        description="Keep your training in sync"
        googleAction="/fitness/google"
        sessionEndpoint="/fitness/session"
        successPath="/fitness/dashboard"
        title="Fitness account"
      />,
    );
    expect(screen.getByRole("heading").textContent).toBe("Fitness account");
    expect(
      screen
        .getByRole("button", { name: "Continue with Google" })
        .closest("form")
        ?.getAttribute("action"),
    ).toBe("/fitness/google");
    const password = screen.getByLabelText("Password");
    expect(password.getAttribute("autoComplete")).toBe("current-password");
    fireEvent.click(screen.getByRole("button", { name: "Show password" }));
    expect(password.getAttribute("type")).toBe("text");
    fireEvent.click(screen.getByRole("button", { name: "Hide password" }));
    expect(password.getAttribute("type")).toBe("password");
  });
  it("submits password credentials to the configured app and retains an accessible error", async () => {
    const fetcher = vi.fn().mockResolvedValue({
      json: async () => ({ error: "Check your fitness account" }),
      ok: false,
    });
    vi.stubGlobal("fetch", fetcher);
    render(
      <LoginPanel
        description="Sign in"
        googleAction="/fitness/google"
        sessionEndpoint="/fitness/session"
        successPath="/fitness"
        title="Fitness"
      />,
    );
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "synthetic" },
    });
    fireEvent.submit(screen.getByLabelText("Password").closest("form") as HTMLFormElement);
    expect((await screen.findByRole("alert")).textContent).toBe("Check your fitness account");
    expect(fetcher.mock.calls[0]?.[0]).toBe("/fitness/session");
  });
});
