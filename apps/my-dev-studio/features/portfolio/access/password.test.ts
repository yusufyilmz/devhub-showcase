import { describe, expect, it } from "vitest";

import {
  hashPortfolioPassword,
  issuePortfolioGrant,
  verifyPortfolioGrant,
  verifyPortfolioPassword,
} from "./password";

const key = "fixture-server-key-with-enough-entropy";
const version = "11111111-1111-4111-8111-111111111111";
describe("portfolio passwords and browser grants", () => {
  it("salts password digests and verifies without storing plaintext", async () => {
    const password = "fictional-long-portfolio-passphrase";
    const first = await hashPortfolioPassword(password);
    const second = await hashPortfolioPassword(password);
    expect(first).not.toBe(second);
    expect(first).not.toContain(password);
    expect(await verifyPortfolioPassword(password, first)).toBe(true);
    expect(await verifyPortfolioPassword("incorrect password", first)).toBe(false);
    expect(await verifyPortfolioPassword(password, "untrusted-format")).toBe(false);
  });
  it("binds one-hour grants to the portfolio, publication version, expiry and server key", () => {
    const now = Date.parse("2026-11-04T12:00:00Z");
    const token = issuePortfolioGrant("portfolio-a", version, key, now);
    expect(verifyPortfolioGrant("portfolio-a", token, key, now)).toBe(version);
    expect(verifyPortfolioGrant("portfolio-b", token, key, now)).toBeNull();
    expect(verifyPortfolioGrant("portfolio-a", token, "another-server-key", now)).toBeNull();
    expect(verifyPortfolioGrant("portfolio-a", `${token}x`, key, now)).toBeNull();
    expect(verifyPortfolioGrant("portfolio-a", token, key, now + 3600_000)).toBeNull();
    expect(
      verifyPortfolioGrant(
        "portfolio-a",
        token.replace(version, "22222222-2222-4222-8222-222222222222"),
        key,
        now,
      ),
    ).toBeNull();
  });
});
