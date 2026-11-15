import { expect, test } from "@playwright/test";

import { seedWorkspace } from "@shared/lib/db/seed";

test.describe("Fitness OS notifications", () => {
  test.beforeEach(async ({ page }) => {
    const state = seedWorkspace();
    state.settings.reminders = false;
    await page.route("**/api/state**", (route) =>
      route.fulfill({ json: { canEdit: true, revision: 0, state, workspaceId: "fixture-user" } }),
    );
    await page.route("**/api/notifications", (route) =>
      route.fulfill({ json: { configured: false, publicKey: null, revision: 0 } }),
    );
  });
  test("shows truthful setup state and install guidance in private and demo views", async ({
    page,
  }, testInfo) => {
    await page.goto("/?view=More");
    const panel = page.getByRole("region", { name: "Device notifications" });
    await expect(panel).toBeVisible();
    await panel.screenshot({ path: `/tmp/fitness-notifications-${testInfo.project.name}.png` });
    await expect(panel.getByText(/Background delivery is not set up yet/)).toBeVisible();
    await expect(
      panel.getByRole("button", { name: "Enable notifications on this device" }),
    ).toBeDisabled();
    await page.evaluate(() => {
      const event = Object.assign(new Event("beforeinstallprompt", { cancelable: true }), {
        prompt: async () => undefined,
        userChoice: Promise.resolve({ outcome: "dismissed" }),
      });
      window.dispatchEvent(event);
    });
    await expect(panel.getByRole("button", { name: "Install app" })).toBeVisible();
    await panel.getByRole("button", { name: "Install app" }).click();
    await expect(panel.getByRole("status")).toHaveText("Installation prompt opened.");
    await page.goto("/preview?view=More");
    await expect(
      page.getByRole("button", { name: "Enable notifications on this device" }),
    ).toBeDisabled();
    await expect(page.getByText(/This device is not subscribed/)).toBeVisible();
  });
  test("runs the real worker, acknowledges permission results and caches only a public offline fallback", async ({
    page,
    context,
  }) => {
    await context.grantPermissions(["notifications"]);
    await page.goto("/preview");
    await expect(page.getByRole("button", { name: "More" })).toBeVisible();
    const worker = await page.evaluate(async () => {
      const registration = await navigator.serviceWorker.ready;
      const message = {
        body: "Fictional test",
        id: "browser-fixture",
        title: "Fixture reminder",
        url: "https://evil.test/",
      };
      const display = () =>
        new Promise((resolve) => {
          const channel = new MessageChannel();
          channel.port1.onmessage = (event) => {
            channel.port1.close();
            resolve(event.data.ok);
          };
          registration.active!.postMessage({ message, type: "show-notification" }, [channel.port2]);
        });
      const first = await display();
      const duplicate = await display();
      const displayed = await registration.getNotifications({ tag: "browser-fixture" });
      const keys = await caches.keys();
      const cached = await Promise.all(
        keys.map(async (key) =>
          (await (await caches.open(key)).keys()).map((request) => new URL(request.url).pathname),
        ),
      );
      const safe = displayed.every(
        (notification) => notification.data.url === `${location.origin}/`,
      );
      displayed.forEach((notification) => notification.close());
      return {
        cached: cached.flat(),
        displayed: displayed.length,
        duplicate,
        first,
        permission: Notification.permission,
        safe,
      };
    });
    // The test environment can deny notifications despite browser permission grants.
    // Verify the worker truthfully reports that failure; successful display is
    // also covered by the worker unit fixture and requires a real device check.
    const allowed = worker.permission === "granted";
    expect(worker.first).toBe(allowed);
    expect(worker.duplicate).toBe(allowed);
    if (allowed) expect(worker.displayed).toBe(1);
    expect(worker.safe).toBe(true);
    expect(worker.cached).toEqual(["/offline.html"]);
    await page.reload();
    await context.setOffline(true);
    await page.goto("/preview?offline-check=1");
    await expect(page.getByRole("heading", { name: "You’re offline" })).toBeVisible();
    await expect(page.getByText(/Reconnect to open your workspace/)).toBeVisible();
    await context.setOffline(false);
  });
});
