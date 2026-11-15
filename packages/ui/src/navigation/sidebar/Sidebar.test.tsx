// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { SidebarMenuButton, SidebarProvider, SidebarTrigger } from "./Sidebar";

vi.mock("@shared/runtime/browser", () => ({ useIsMobile: () => false }));

describe("Sidebar", () => {
  afterEach(cleanup);

  it("supports Base UI render and existing asChild links", () => {
    render(
      <SidebarProvider>
        <SidebarMenuButton isActive render={<a href="/portfolio" />} tooltip="Portfolio">
          Portfolio
        </SidebarMenuButton>
        <SidebarMenuButton asChild>
          <a href="/settings">Settings</a>
        </SidebarMenuButton>
      </SidebarProvider>,
    );
    expect(screen.getByRole("link", { name: "Portfolio" }).getAttribute("aria-current")).toBe(
      "page",
    );
    expect(screen.getByRole("link", { name: "Settings" }).getAttribute("href")).toBe("/settings");
  });

  it("toggles uncontrolled state and reports it to the caller", () => {
    const onOpenChange = vi.fn();
    render(
      <SidebarProvider onOpenChange={onOpenChange}>
        <SidebarTrigger />
      </SidebarProvider>,
    );
    const trigger = screen.getByRole("button", { name: "Toggle Sidebar" });
    fireEvent.click(trigger);
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
