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
  await page.getByRole("link", { name: "Portfolio assistant" }).click();
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
