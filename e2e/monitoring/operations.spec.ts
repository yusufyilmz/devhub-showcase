import { expect, test } from "@playwright/test";

import { urls } from "@shared/config/urls";

test("safe billing failure exposes a fresh server reference without echoing request secrets", async ({
  request,
}) => {
  const secret = "fictional-private-payload";
  const response = await request.post(urls.next.billing.webhook(), {
    data: secret,
    headers: { "X-Request-ID": secret },
  });
  expect(response.status()).toBe(503);
  expect(response.headers()["x-request-id"]).toMatch(/^[0-9a-f-]{36}$/);
  expect(await response.text()).not.toContain(secret);
});
