import { afterEach, describe, expect, it, vi } from "vitest";

import { profile, projectPublicProfile } from "@shared/config";

import { readPublicProfileByUsername, readPublishedProfile } from "./published-profile";

describe("published snapshot reads", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });
  it("reads independently redacted outputs without querying private source rows", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://fixture.example");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "fixture-key");
    const source = { ...profile, cvFields: { phone: false }, websiteFields: { email: false } };
    const fetcher = vi.fn(async (input: RequestInfo | URL) => {
      const url = new URL(String(input));
      const surface = url.pathname.endsWith("portfolio_public_cvs") ? "cv" : "website";
      expect(["/rest/v1/portfolio_publications", "/rest/v1/portfolio_public_cvs"]).toContain(
        url.pathname,
      );
      return new Response(
        JSON.stringify({
          document: projectPublicProfile(source, surface),
          id: "main",
          revision: 7,
          updated_at: "2026-11-03T00:00:00Z",
          username: "example-owner",
        }),
      );
    });
    vi.stubGlobal("fetch", fetcher);
    const website = await readPublicProfileByUsername("example-owner");
    const cv = await readPublicProfileByUsername("example-owner", "cv");
    expect(website?.profile.email).toBe("");
    expect(cv?.profile.email).toBe(source.email);
    expect(cv?.profile.phone).toBe("");
    expect(website?.revision).toBe(7);
    expect(fetcher).toHaveBeenCalledTimes(2);
  });
  it("does not replace missing publication or storage failures with bundled personal data", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://fixture.example");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "fixture-key");
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(new Response("null"))
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ message: "unavailable" }), { status: 400 }),
      );
    vi.stubGlobal("fetch", fetcher);
    await expect(readPublishedProfile()).rejects.toThrow();
    await expect(readPublishedProfile()).rejects.toThrow();
  });
});
