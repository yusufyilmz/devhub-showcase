import { expect, test } from "@playwright/test";

test("protected publication gates pages, CV and generated assets and revokes old grants", async ({
  page,
  context,
  browser,
}, info) => {
  const n = info.project.name.startsWith("mobile") ? 1 : 0;
  const username = `${n ? "mobile" : "desktop"}-protected-owner`;
  const id = `92929292-9292-4292-8292-92929292929${n}`;
  const profileId = `91919191-9191-4191-8191-91919191919${n}`;
  const exp = Math.floor(Date.now() / 1000) + 3600;
  const token = [
    "fixture",
    Buffer.from(JSON.stringify({ exp, sub: id })).toString("base64url"),
    "signature",
  ].join(".");
  await context.addCookies([
    {
      name: "sb-127-auth-token",
      sameSite: "Lax",
      url: "http://localhost:3100",
      value: `base64-${Buffer.from(JSON.stringify({ access_token: token, expires_at: exp, expires_in: 3600, refresh_token: "fixture-refresh", token_type: "bearer", user: { email: "protected@example.test", id } })).toString("base64url")}`,
    },
  ]);
  const visitor = await browser.newContext();
  try {
    await page.goto(`/${username}/edit`);
    await page.getByRole("button", { exact: true, name: "Review publication" }).click();
    await page.getByLabel("Publication password").fill("fictional-portfolio-password");
    await page.getByRole("button", { exact: true, name: "Confirm publication" }).click();
    await expect(page.getByText(/Published revision/)).toBeVisible();
    const lockedPaths = [
      `/${username}/cv.pdf`,
      `/p/${profileId}/cv.pdf`,
      `/${username}/icon.svg`,
      `/${username}/share.png`,
    ];
    for (const path of lockedPaths)
      expect((await visitor.request.get(`http://localhost:3100${path}`)).status()).toBe(404);
    const preview = await visitor.request.get(`http://localhost:3100/${username}`);
    expect(preview.url()).toContain("/access");
    expect(await preview.text()).not.toContain("Protected Fictional Owner");
    const tab = await visitor.newPage();
    await tab.goto(`http://localhost:3100/${username}`);
    await expect(tab.getByRole("heading", { name: "This portfolio is protected" })).toBeVisible();
    await tab
      .locator(".portfolio-password-gate")
      .screenshot({ path: `/tmp/password-gate-${n ? "mobile" : "desktop"}.png` });
    const anonymous = await visitor.request.get(
      `http://127.0.0.1:3101/rest/v1/portfolio_publications?id=eq.${profileId}`,
    );
    expect(await anonymous.json()).toBeNull();
    await tab.getByLabel("Portfolio password").fill("wrong-password");
    await tab.getByRole("button", { name: "Unlock portfolio" }).click();
    await expect(tab.locator(".portfolio-password-gate").getByRole("alert")).toContainText(
      "Could not unlock",
    );
    await tab.getByLabel("Portfolio password").fill("fictional-portfolio-password");
    await tab.getByRole("button", { name: "Unlock portfolio" }).click();
    await expect(tab).toHaveURL(`http://localhost:3100/${username}`);
    await expect(
      tab.getByRole("heading", { name: /Protected Fictional Owner/ }).first(),
    ).toBeVisible();
    for (const path of lockedPaths) {
      const response = await visitor.request.get(`http://localhost:3100${path}`);
      expect(response.status()).toBe(200);
      expect(response.headers()["cache-control"]).toContain("no-store");
    }
    await page.getByRole("button", { exact: true, name: "Review publication" }).click();
    await page.getByRole("button", { exact: true, name: "Confirm publication" }).click();
    await expect(
      page.getByRole("button", { exact: true, name: "Review publication" }),
    ).toBeVisible();
    expect((await visitor.request.get(`http://localhost:3100/${username}/cv.pdf`)).status()).toBe(
      404,
    );
    await tab.reload();
    await expect(tab).toHaveURL(`http://localhost:3100/${username}/access`);
  } finally {
    await visitor.close();
  }
});
