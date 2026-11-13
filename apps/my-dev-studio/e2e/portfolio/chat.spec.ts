import { expect, test } from "@playwright/test";

test("public portfolio chat opens a full page and keeps history in the tab", async ({
  page,
}, info) => {
  const question = "What projects are featured?";
  const answer = "The portfolio lists the featured projects in Selected work.";
  await page.route("**/api/chat/stream", async (route) => {
    expect(route.request().postDataJSON()).toMatchObject({
      message: question,
      username: "yusufyilmz",
    });
    await route.fulfill({
      body: [
        JSON.stringify({ text: answer, type: "delta" }),
        JSON.stringify({ answer, type: "done" }),
        "",
      ].join("\n"),
      contentType: "application/x-ndjson",
    });
  });
  await page.goto("/yusufyilmz");
  const companion = page.getByRole("link", { exact: true, name: "Portfolio assistant" });
  const position = page.locator(".agent-companion[data-agent=portfolio]");
  await expect(position).toHaveAttribute("data-side", "left");
  const avatar = await companion.boundingBox();
  if (!avatar) throw new Error("The portfolio companion is outside the viewport");
  const y = avatar.y + avatar.height / 2;
  await page.mouse.move(avatar.x + avatar.width / 2, y);
  await page.mouse.down();
  await page.mouse.move((page.viewportSize()?.width ?? 390) - 40, y - 120, { steps: 12 });
  await page.mouse.up();
  await expect(position).toHaveAttribute("data-side", "right");
  await expect(page).toHaveURL(/\/yusufyilmz$/);
  const moved = await companion.boundingBox();
  expect(moved?.y).toBeLessThan(avatar.y - 75);
  const resize = page.getByRole("button", { name: "Resize companion" });
  const handle = await resize.boundingBox();
  if (!handle) throw new Error("The resize handle is outside the viewport");
  await page.mouse.move(handle.x + handle.width / 2, handle.y + handle.height / 2);
  await page.mouse.down();
  await page.mouse.move(handle.x + handle.width / 2, handle.y - 12, { steps: 8 });
  await page.mouse.up();
  const resized = await companion.boundingBox();
  expect(resized?.width).toBeGreaterThan(avatar.width + 20);
  await page.reload();
  await expect.poll(async () => (await companion.boundingBox())?.width).toBe(resized?.width);
  await expect.poll(async () => (await companion.boundingBox())?.y).toBeCloseTo(resized?.y ?? 0, 0);
  await expect(position).toHaveAttribute("data-side", "right");
  await page.getByRole("button", { name: "Move companion to the left" }).press("Enter");
  await expect(position).toHaveAttribute("data-side", "left");
  await companion.click();
  await expect(page).toHaveURL(/\/yusufyilmz\/chat$/);
  const screen = page.getByRole("region", { name: "Portfolio assistant conversation" });
  const welcome = screen.getByRole("heading", { name: /What would you like to know about/ });
  await expect(welcome).toBeVisible();
  const sources = screen.getByRole("navigation", { name: "Published portfolio sources" });
  await expect(sources.getByRole("link").first()).toHaveAttribute("href", /^\/yusufyilmz#/);
  await expect(screen.getByRole("button", { name: "Send message" })).toBeInViewport({ ratio: 1 });

  await page.screenshot({ path: info.outputPath("portfolio-chat-welcome.png") });
  await screen.getByRole("button", { name: question }).click();
  await expect(screen.getByRole("textbox")).toHaveValue(question);
  await screen.getByRole("button", { name: "Send message" }).click();
  await expect(screen.getByRole("log")).toContainText(answer);
  await page.reload();
  await expect(screen.getByRole("log")).toContainText(question);
  await expect(screen.getByRole("log")).toContainText(answer);
  expect(
    await page.evaluate(() =>
      Object.keys(localStorage).some((key) => key.startsWith("mydevstudio:premium-chat:")),
    ),
  ).toBe(false);
  if (info.project.name.startsWith("mobile"))
    await screen.getByText("Workspace", { exact: true }).click();
  await page.getByRole("button", { name: "New chat" }).click();
  await expect(welcome).toBeVisible();
  await page.getByRole("link", { name: "Back to portfolio" }).click();
  await expect(page).toHaveURL(/\/yusufyilmz$/);
});
