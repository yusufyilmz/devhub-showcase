import { afterEach, describe, expect, it, vi } from "vitest";

import { portfolioIcon } from "../apps/web/lib/portfolio-branding";
import { portfolioMetadata } from "../apps/web/lib/portfolio-metadata";
import { getProfileStructuredData } from "../apps/web/lib/profile-structured-data";
import { portfolioUrl, siteUrl } from "../apps/web/lib/site-url";
import { getNameInitials, profile } from "../packages/content/src";
import { listPublishedPortfolioLinks } from "../packages/lib/src/services/published-profile";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});
describe("portfolio identity and discovery", () => {
  it("creates Unicode initials and escapes user content in icons", () => {
    expect(getNameInitials("  Yusuf Yılmaz ")).toBe("YY");
    expect(getNameInitials("İpek Öztürk")).toBe("İÖ");
    expect(getNameInitials("李 明")).toBe("李明");
    expect(getNameInitials("Prince")).toBe("P");
    expect(getNameInitials("")).toBe("?");
    const icon = portfolioIcon({
      ...profile,
      name: '<script>alert("x")</script>',
    });
    expect(icon).not.toContain("<script>");
    expect(icon).toContain("&lt;script&gt;");
  });
  it("uses the platform URL regardless of an external personal website", () => {
    const person = {
      ...profile,
      name: "Example Owner",
      website: "https://external.example",
    };
    const metadata = portfolioMetadata(person, "example-owner");
    expect(metadata.alternates?.canonical).toBe(`${siteUrl}/example-owner`);
    expect(metadata.openGraph).toMatchObject({
      images: [{ url: `${portfolioUrl("example-owner")}/share.png` }],
      url: portfolioUrl("example-owner"),
    });
    expect(metadata.icons).toMatchObject({
      shortcut: `${portfolioUrl("example-owner")}/icon.svg`,
    });
    expect(metadata.twitter).toMatchObject({ card: "summary_large_image" });
    const structured = getProfileStructuredData(person, portfolioUrl("example-owner"));
    expect(structured).toMatchObject({
      sameAs: expect.arrayContaining([person.website]),
      url: portfolioUrl("example-owner"),
    });
    expect(getProfileStructuredData()).toMatchObject({ "@type": "WebSite" });
  });
  it("paginates anonymous discovery using publication filters and URL columns only", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://fixture.example");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "fixture-public-key");
    const first = Array.from({ length: 1000 }, (_, index) => ({
      updated_at: "2026-10-30T00:00:00Z",
      username: `person-${index}`,
    }));
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(new Response(JSON.stringify(first)))
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify([
            { updated_at: "2026-10-30T00:00:00Z", username: "final-person" },
            { updated_at: "", username: "admin" },
          ]),
        ),
      );
    vi.stubGlobal("fetch", fetcher);
    const links = await listPublishedPortfolioLinks();
    expect(links).toHaveLength(1001);
    expect(links.at(-1)?.username).toBe("final-person");
    const urls = fetcher.mock.calls.map(([input]) => new URL(String(input)));
    expect(urls[0]?.searchParams.get("select")).toBe("username,updated_at");
    expect(urls[0]?.searchParams.get("is_public")).toBe("eq.true");
    expect(urls[1]?.searchParams.get("offset")).toBe("1000");
    expect(fetcher.mock.calls[0]?.[1]).toMatchObject({ cache: "no-store" });
    expect(new Headers(fetcher.mock.calls[0]?.[1]?.headers).get("authorization")).toBe(
      "Bearer fixture-public-key",
    );
  });
  it("does not fall back to seed personal data when discovery is unconfigured", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "");
    expect(await listPublishedPortfolioLinks()).toEqual([]);
  });
  it("fails a discovery outage rather than caching an incomplete sitemap", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://fixture.example");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "fixture-public-key");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ message: "unavailable" }), {
          status: 400,
        }),
      ),
    );
    await expect(listPublishedPortfolioLinks()).rejects.toThrow();
  });
});
