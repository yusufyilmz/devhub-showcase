// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { NotificationPreferences, type NotificationPreferencesProps } from "./index";

function props(): NotificationPreferencesProps {
  return {
    canInstall: true,
    configured: true,
    enabled: false,
    installed: false,
    liveStatus: "connected",
    onDisable: vi.fn().mockResolvedValue(undefined),
    onEnable: vi.fn().mockResolvedValue(undefined),
    onInstall: vi.fn().mockResolvedValue(undefined),
    onTest: vi.fn().mockResolvedValue(undefined),
    permission: "default",
    requiresHomeScreen: false,
    supported: true,
  };
}
describe("device notification preferences", () => {
  afterEach(cleanup);
  it("requires explicit enable and reports failure without claiming subscription success", async () => {
    const data = props();
    data.onEnable = vi.fn().mockRejectedValue(new Error("Permission blocked"));
    render(<NotificationPreferences {...data} />);
    expect(data.onEnable).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Enable notifications on this device" }));
    await waitFor(() => expect(screen.getByRole("alert").textContent).toBe("Permission blocked"));
    expect(screen.queryByRole("status")).toBeNull();
  });
  it("allows foreground permission independently of background setup", async () => {
    const onAllowForeground = vi.fn().mockResolvedValue(undefined);
    render(
      <NotificationPreferences
        {...props()}
        configured={false}
        onAllowForeground={onAllowForeground}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Allow open-app reminders" }));
    await waitFor(() => expect(onAllowForeground).toHaveBeenCalledTimes(1));
    await waitFor(() =>
      expect(screen.getByRole("status").textContent).toMatch(/Open-app reminders allowed/),
    );
  });
  it("explains iOS installation and blocks subscription until supported", () => {
    render(<NotificationPreferences {...props()} requiresHomeScreen />);
    expect(screen.getByText(/browser’s Share menu/)).toBeTruthy();
    expect(
      (
        screen.getByRole("button", {
          name: "Enable notifications on this device",
        }) as HTMLButtonElement
      ).disabled,
    ).toBe(true);
  });
  it("permits testing and disabling only the subscribed device", async () => {
    const data = props();
    render(<NotificationPreferences {...data} enabled />);
    fireEvent.click(screen.getByRole("button", { name: "Send test notification" }));
    await waitFor(() => expect(data.onTest).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(screen.getByRole("status").textContent).toMatch(/Test sent/));
    fireEvent.click(screen.getByRole("button", { name: "Disable this device" }));
    await waitFor(() => expect(data.onDisable).toHaveBeenCalledTimes(1));
  });
});
