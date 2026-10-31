import { afterEach, expect, it, vi } from "vitest";

import { readGoogleProfile } from "../apps/web/lib/google-profile-import";

afterEach(() => vi.unstubAllGlobals());
it("calls only people/me with selected profile fields and excludes unrequested Google data", async () => {
  const fetchMock = vi.fn().mockResolvedValue(
    Response.json({
      birthdays: [{ date: { day: 1, month: 1, year: 1990 } }],
      names: [{ displayName: "Alex Morgan" }],
      phoneNumbers: [{ value: "PRIVATE_PHONE" }],
    }),
  );
  vi.stubGlobal("fetch", fetchMock);
  const result = await readGoogleProfile("sample-token", ["basic"], new AbortController().signal);
  expect(result.suggestions).toEqual([{ field: "name", value: "Alex Morgan" }]);
  const call = fetchMock.mock.calls[0];
  if (!call) throw new Error("Missing People API request");
  const [url, options] = call;
  expect(String(url)).toBe(
    "https://people.googleapis.com/v1/people/me?personFields=names%2CemailAddresses&sources=READ_SOURCE_TYPE_PROFILE",
  );
  expect(options).toMatchObject({
    cache: "no-store",
    headers: { Authorization: "Bearer sample-token" },
    redirect: "error",
  });
  expect(String(url)).not.toContain("sample-token");
});
it("bounds Google responses and makes no retries on denied/expired access", async () => {
  const fetchMock = vi
    .fn()
    .mockResolvedValue(Response.json({ error: "private upstream" }, { status: 403 }));
  vi.stubGlobal("fetch", fetchMock);
  await expect(
    readGoogleProfile("sample-token", ["basic"], new AbortController().signal),
  ).rejects.toThrow("unavailable");
  expect(fetchMock).toHaveBeenCalledTimes(1);
  fetchMock.mockResolvedValue(Response.json({ names: [{ displayName: "x".repeat(70000) }] }));
  await expect(
    readGoogleProfile("sample-token", ["basic"], new AbortController().signal),
  ).rejects.toThrow("Too large");
});
