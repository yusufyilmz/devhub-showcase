// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { themeOptions } from "@shared/config/theme";

import { HomePage } from "./home-page";

describe("HomePage", () => {
  beforeEach(() =>
    vi.stubGlobal(
      "ResizeObserver",
      class {
        observe() {}
        disconnect() {}
      },
    ),
  );
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });
  const guest = {
    href: "/login",
    label: "Create your portfolio",
    signedIn: false,
  };
  it("introduces the platform and gives visitors working creation and public example links", () => {
    render(<HomePage action={guest} exampleHref="/yusufyilmz" />);
    expect(screen.getByRole("heading", { level: 1 }).textContent).toContain("Your work.");
    for (const link of screen.getAllByRole("link", {
      name: /Create your portfolio/,
    }))
      expect(link.getAttribute("href")).toBe("/login");
    expect(screen.getByRole("link", { name: /See a real portfolio/ }).getAttribute("href")).toBe(
      "/yusufyilmz",
    );
    expect(screen.getByText("Illustrative preview")).toBeTruthy();
    expect(screen.getByRole("main").id).toBe("home-content");
    expect(
      screen.getByRole("link", { name: "Sign in to use Studio assistant" }).getAttribute("href"),
    ).toBe("/login");
    const palettes = screen.getByRole("list", { name: "Available color palettes" });
    expect(
      within(palettes)
        .getAllByRole("listitem")
        .map((item) => item.querySelector("b")?.textContent),
    ).toEqual(themeOptions.brand);
  });
  it("routes an authenticated owner to their own editor and uses the published example without a local profile", () => {
    render(
      <HomePage
        action={{
          href: "/alice/edit",
          label: "Open your studio",
          signedIn: true,
        }}
        exampleHref={null}
      />,
    );
    expect(screen.getByRole("link", { name: /My studio/ }).getAttribute("href")).toBe(
      "/alice/edit",
    );
    expect(screen.getByRole("link", { name: "Open Studio assistant" }).getAttribute("href")).toBe(
      "/admin/chat",
    );
    for (const link of screen.getAllByRole("link", { name: /Open your studio/ }))
      expect(link.getAttribute("href")).toBe("/alice/edit");
    expect(screen.getByRole("link", { name: /See a real portfolio/ }).getAttribute("href")).toBe(
      "https://mydevstudio.vercel.app/yusufyilmz",
    );
  });

  it("reveals answers and explains publishing and PDF contact visibility", () => {
    render(<HomePage action={guest} exampleHref={null} />);
    const toggle = screen.getByRole("button", {
      name: "Show details for Is my portfolio public as soon as I sign up?",
    });
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    fireEvent.click(toggle);
    expect(toggle.getAttribute("aria-expanded")).toBe("true");
    const answer = document.getElementById(toggle.getAttribute("aria-controls") ?? "");
    expect(answer?.getAttribute("aria-hidden")).toBe("false");
    expect(answer?.textContent).toContain("Your portfolio starts private");
    expect(screen.getByText(/Your portfolio starts private/)).toBeTruthy();
    expect(screen.getByText(/PDF contact settings affect the PDF only/)).toBeTruthy();
  });
});
