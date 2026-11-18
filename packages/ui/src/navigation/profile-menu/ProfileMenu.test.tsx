// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ProfileMenu } from "./ProfileMenu";

const groups = [
  {
    id: "portfolio",
    items: [{ href: "/portfolio", label: "My portfolio" }],
    label: "Portfolio",
  },
  { id: "empty", items: [], label: "Hidden" },
  {
    id: "billing",
    items: [{ href: "/billing", label: "Plan and billing" }],
  },
];

describe("ProfileMenu", () => {
  afterEach(cleanup);

  it("renders the supplied links and calls sign out", () => {
    const onSignOut = vi.fn();
    render(
      <ProfileMenu
        groups={groups}
        initials="AY"
        signOut={{ onSignOut }}
        subtitle="@ada"
        title="My profile"
      />,
    );

    fireEvent.pointerDown(screen.getByRole("button", { name: "Profile menu" }));

    const portfolio = screen.getByRole("menuitem", { name: "My portfolio" });
    expect(portfolio.getAttribute("href")).toBe("/portfolio");
    expect(screen.getByRole("menuitem", { name: "Plan and billing" }).getAttribute("href")).toBe(
      "/billing",
    );
    expect(screen.queryByText("Hidden")).toBeNull();
    expect(screen.getByText("@ada")).toBeTruthy();

    fireEvent.click(screen.getByRole("menuitem", { name: "Sign out" }));
    expect(onSignOut).toHaveBeenCalledOnce();
  });

  it("disables sign out while busy and shows a failure", () => {
    render(
      <ProfileMenu
        failure="Could not sign out. Try again."
        groups={[]}
        initials="AY"
        signOut={{ busy: true, onSignOut: () => undefined }}
        title="My profile"
      />,
    );

    fireEvent.pointerDown(screen.getByRole("button", { name: "Profile menu" }));
    expect(
      screen.getByRole("menuitem", { name: "Signing out…" }).hasAttribute("data-disabled"),
    ).toBe(true);
    expect(screen.getByRole("alert", { hidden: true }).textContent).toBe(
      "Could not sign out. Try again.",
    );
  });
});
