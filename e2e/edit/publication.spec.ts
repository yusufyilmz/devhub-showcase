import { expect, test } from "@playwright/test";

import { confirmPublication } from "../support/publication";

test("private saves, explicit snapshots, independent fields, rename and withdrawal", async ({
  page,
  context,
  browser,
}, info) => {
  const mobile = info.project.name.startsWith("mobile");
  const index = mobile ? 1 : 0;
  const id = `52525252-5252-4252-8252-52525252525${index}`;
  const profileId = `51515151-5151-4151-8151-51515151515${index}`;
  const username = `${mobile ? "mobile" : "desktop"}-publication-owner`;
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
      value: `base64-${Buffer.from(JSON.stringify({ access_token: token, expires_at: exp, expires_in: 3600, refresh_token: "fixture-refresh", token_type: "bearer", user: { email: `publication${index}@example.test`, id } })).toString("base64url")}`,
    },
  ]);
  const visitor = await browser.newContext();
  const publicPage = await visitor.newPage();
  await page.goto(`/${username}/edit`);
  await page.getByRole("button", { exact: true, name: "Field visibility" }).click();
  await page.getByRole("checkbox", { name: "Include email on website" }).uncheck();
  await page.getByRole("checkbox", { name: "Include phone on cv" }).uncheck();
  await expect(
    page.getByRole("button", { exact: true, name: "Review publication" }),
  ).toBeDisabled();
  await page.getByRole("button", { exact: true, name: "Save changes" }).click();
  await expect(page.locator(".editor-success")).toContainText("Saved privately");
  expect((await visitor.request.get(`http://localhost:3100/${username}`)).status()).toBe(404);
  await confirmPublication(page);
  await publicPage.goto(`/${username}`);
  await expect(publicPage.getByRole("heading", { level: 1 })).toContainText("Publication Owner");
  const web = await (
    await visitor.request.get(
      `http://127.0.0.1:3101/rest/v1/portfolio_publications?id=eq.${profileId}`,
    )
  ).json();
  const cv = await (
    await visitor.request.get(
      `http://127.0.0.1:3101/rest/v1/portfolio_public_cvs?id=eq.${profileId}`,
    )
  ).json();
  expect(web.document.email).toBe("");
  expect(cv.document.email).toBe(`publication${index}@example.test`);
  expect(cv.document.phone).toBe("");
  expect((await visitor.request.get(`http://localhost:3100/${username}/cv.pdf`)).status()).toBe(
    200,
  );
  await page.getByRole("combobox", { name: "Portfolio discovery" }).selectOption("unlisted");
  await page.getByRole("button", { exact: true, name: "Save changes" }).click();
  await expect(page.locator(".editor-success")).toContainText("Saved privately");
  const locationTag = `<loc>http://localhost:3100/${username}</loc>`;
  expect(await (await visitor.request.get("http://localhost:3100/sitemap.xml")).text()).toContain(
    locationTag,
  );
  await confirmPublication(page);
  expect(
    await (await visitor.request.get("http://localhost:3100/sitemap.xml")).text(),
  ).not.toContain(locationTag);
  await publicPage.reload();
  await expect(publicPage.getByRole("heading", { level: 1 })).toContainText("Publication Owner");
  await expect(publicPage.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  const unlistedCv = await visitor.request.get(`http://localhost:3100/${username}/cv.pdf`);
  expect(unlistedCv.status()).toBe(200);
  expect(unlistedCv.headers()["x-robots-tag"]).toContain("noindex");
  await page.getByRole("button", { exact: true, name: "Profile" }).click();
  await page.getByRole("textbox", { exact: true, name: "Full name" }).fill("Private next revision");
  await page.getByLabel("Username", { exact: true }).fill(`${username}-renamed`);
  await page.getByRole("button", { exact: true, name: "Save changes" }).click();
  await expect(page.locator(".editor-success")).toContainText("Saved privately");
  await publicPage.reload();
  await expect(publicPage.getByRole("heading", { level: 1 })).toContainText("Publication Owner");
  expect((await visitor.request.get(`http://localhost:3100/${username}-renamed`)).status()).toBe(
    404,
  );
  const stale = await page.request.post("/api/publication", {
    data: { publish: true, revision: web.revision },
    headers: { origin: "http://localhost:3100" },
  });
  expect(stale.status()).toBe(409);
  await expect(page.getByRole("link", { name: "Open published portfolio ↗" })).toHaveAttribute(
    "href",
    `/${username}`,
  );
  await confirmPublication(page);
  const oldLink = await visitor.request.get(`http://localhost:3100/${username}`, {
    maxRedirects: 0,
  });
  expect(oldLink.status()).toBe(308);

  await publicPage.goto(`/${username}-renamed`);
  await expect(publicPage.getByRole("heading", { level: 1 })).toContainText(
    "Private next revision",
  );
  const finalUsername = `${username}-final`;
  await page.getByLabel("Username", { exact: true }).fill(finalUsername);
  await page.getByRole("button", { exact: true, name: "Save changes" }).click();
  await expect(page.locator(".editor-success")).toContainText("Saved privately");
  await confirmPublication(page);
  for (const alias of [username, `${username}-renamed`]) {
    for (const suffix of ["", "/cv.pdf", "/icon.svg", "/share.png"]) {
      const redirect = await visitor.request.get(`http://localhost:3100/${alias}${suffix}`, {
        maxRedirects: 0,
      });
      expect(redirect.status()).toBe(308);
      const location = redirect.headers().location;
      if (!location) throw new Error("Alias redirect is missing its destination");
      expect(new URL(location, "http://localhost:3100").pathname).toBe(
        `/${finalUsername}${suffix}`,
      );
    }
  }
  await page.getByRole("button", { exact: true, name: "Withdraw public website and CV" }).click();
  await expect(page.getByText("Your saved draft is private until you publish it.")).toBeVisible();
  expect((await visitor.request.get(`http://localhost:3100/${username}-renamed`)).status()).toBe(
    404,
  );
  expect(
    (await visitor.request.get(`http://localhost:3100/${username}-renamed/cv.pdf`)).status(),
  ).toBe(404);
  const unauthorized = await visitor.request.post("http://localhost:3100/api/publication", {
    data: { publish: true, revision: 3 },
    headers: { origin: "http://localhost:3100" },
  });
  expect(unauthorized.status()).toBe(403);
  await page.screenshot({ fullPage: true, path: info.outputPath("publication-controls.png") });
  await visitor.close();
});
