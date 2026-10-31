// @vitest-environment jsdom
import { expect, it, vi } from "vitest";

import {
  grantedGoogleCategories,
  requestGoogleProfileConsent,
} from "../packages/auth/src/google-consent";

it("requests only chosen read scopes and handles partial or denied consent", () => {
  let respond:
    | ((value: { access_token?: string; scope?: string; error?: string }) => void)
    | undefined;
  const request = vi.fn();
  const init = vi.fn((options) => {
    respond = options.callback;
    return { requestAccessToken: request };
  });
  const token = vi.fn();
  const failed = vi.fn();
  requestGoogleProfileConsent(
    { initTokenClient: init },
    {
      categories: ["basic", "phone"],
      clientId: "sample.apps.googleusercontent.com",
      onError: failed,
      onToken: token,
    },
  );
  expect(init.mock.calls[0]?.[0].scope).not.toMatch(/gmail|contacts|birthday|organization/);
  expect(init.mock.calls[0]?.[0].include_granted_scopes).toBe(false);
  expect(request).toHaveBeenCalledWith({ prompt: "consent" });
  respond?.({ access_token: "ephemeral", scope: "openid email profile" });
  expect(token).toHaveBeenCalledWith("ephemeral", ["basic"]);
  respond?.({ error: "access_denied" });
  expect(failed).toHaveBeenCalledOnce();
  expect(grantedGoogleCategories(["birthday"], "email profile")).toEqual([]);
});
