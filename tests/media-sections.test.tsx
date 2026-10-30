// @vitest-environment jsdom
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, expect, it, vi } from "vitest";
import { ProfileEditor } from "../apps/web/features/admin/profile-editor";
import { CustomPortfolioSection } from "../apps/web/features/portfolio/custom-portfolio-section";
import { HeroSurface } from "../packages/components/src/hero-surface";
import { WorkMedia } from "../packages/components/src/work-media";
import {
  type CustomSection,
  getSocialWork,
  sectionCompositions,
} from "../packages/content/src";
import { profile } from "../packages/content/src/profile";
import { profileSchema } from "../packages/lib/src/domain/profile";

const hero = {
  kind: "image" as const,
  url: "https://example.com/cover.jpg",
  position: "center" as const,
  overlay: "strong" as const,
};
const section: CustomSection = {
  id: "custom-aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
  title: "Films",
  composition: "youtube",
  renderer: "cards",
  visible: true,
  items: [
    {
      id: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
      title: "A film",
      body: "My work",
      url: "https://youtu.be/M7lc1UVf-VE",
      imageUrl: "https://example.com/cover.jpg",
    },
  ],
};
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});
it("parses only supported public work URLs and rejects spoofed hosts and unsupported sources", () => {
  for (const url of [
    "https://youtu.be/M7lc1UVf-VE",
    "https://www.youtube.com/watch?v=M7lc1UVf-VE",
    "https://youtube.com/shorts/M7lc1UVf-VE",
  ])
    expect(getSocialWork(url)).toEqual({
      provider: "youtube",
      id: "M7lc1UVf-VE",
    });
  expect(
    getSocialWork("https://www.instagram.com/reel/ABC_123/throw"),
  ).toBeNull();
  expect(getSocialWork("https://www.instagram.com/p/ABC_123/")).toMatchObject({
    provider: "instagram",
  });
  expect(getSocialWork("https://www.pinterest.com/pin/123456/")).toMatchObject({
    provider: "pinterest",
  });
  for (const url of [
    "javascript:alert(1)",
    "https://youtube.com.evil.test/watch?v=M7lc1UVf-VE",
    "https://evil.test/?v=M7lc1UVf-VE",
    "https://user:pass@youtube.com/watch?v=M7lc1UVf-VE",
    "http://youtube.com/watch?v=M7lc1UVf-VE",
    "https://instagram.com/some-user/",
  ])
    expect(getSocialWork(url)).toBeNull();
});
it("preserves legacy profiles and round trips media while rejecting unsafe and incompatible input", () => {
  expect(profileSchema.parse(profile).hero).toBeUndefined();
  const saved = profileSchema.parse(
    JSON.parse(JSON.stringify({ ...profile, hero, customSections: [section] })),
  );
  expect(saved.hero).toEqual(hero);
  expect(saved.customSections).toEqual([section]);
  for (const invalid of [
    { ...profile, hero: { ...hero, url: "javascript:alert(1)" } },
    { ...profile, customSections: [{ ...section, composition: "instagram" }] },
    {
      ...profile,
      customSections: [
        {
          ...section,
          items: [{ ...section.items[0], imageUrl: "data:text/html,test" }],
        },
      ],
    },
  ])
    expect(profileSchema.safeParse(invalid).success).toBe(false);
});
it("loads a canonical YouTube iframe only on request and can unload it", () => {
  const view = render(<WorkMedia title="A film" youtubeId="M7lc1UVf-VE" />);
  expect(view.container.querySelector("iframe")).toBeNull();
  expect(view.container.querySelector("img")).toBeNull();
  fireEvent.click(
    screen.getByRole("button", { name: "Load YouTube video: A film" }),
  );
  expect(view.container.querySelector("iframe")?.src).toBe(
    "https://www.youtube-nocookie.com/embed/M7lc1UVf-VE",
  );
  expect(
    view.container.querySelector("iframe")?.getAttribute("referrerpolicy"),
  ).toBe("strict-origin-when-cross-origin");
  fireEvent.click(screen.getByRole("button", { name: "Unload video" }));
  expect(view.container.querySelector("iframe")).toBeNull();
});
it("keeps plain hero output unchanged and uses decorative images without remote server processing", () => {
  expect(
    renderToStaticMarkup(
      <HeroSurface>
        <h1>My story</h1>
      </HeroSurface>,
    ),
  ).toBe("<h1>My story</h1>");
  const output = renderToStaticMarkup(
    <HeroSurface media={hero}>
      <h1>My story</h1>
    </HeroSurface>,
  );
  expect(output).toContain("hero-surface");
  expect(output).toContain('alt=""');
  expect(output).not.toContain("iframe");
});
it("pauses hero autoplay for reduced motion and supports explicit playback controls", async () => {
  let reduced = true;
  let listener: (() => void) | undefined;
  vi.stubGlobal("matchMedia", () => ({
    get matches() {
      return reduced;
    },
    addEventListener: (_type: string, callback: () => void) => {
      listener = callback;
    },
    removeEventListener: vi.fn(),
  }));
  const play = vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue();
  const pause = vi
    .spyOn(HTMLMediaElement.prototype, "pause")
    .mockImplementation(() => {});
  const view = render(
    <HeroSurface
      media={{ ...hero, kind: "video", url: "https://example.com/film.mp4" }}
    >
      <h1>Story</h1>
    </HeroSurface>,
  );
  expect(play).not.toHaveBeenCalled();
  expect(pause).toHaveBeenCalled();
  fireEvent.click(
    screen.getByRole("button", { name: "Play background video" }),
  );
  expect(play).toHaveBeenCalledTimes(1);
  const node = view.container.querySelector("video");
  if (!node) throw new Error("Expected video");
  vi.spyOn(node, "paused", "get").mockReturnValue(false);
  fireEvent.play(node);
  fireEvent.click(
    screen.getByRole("button", { name: "Pause background video" }),
  );
  expect(pause).toHaveBeenCalledTimes(2);
  reduced = false;
  listener?.();
  await waitFor(() => expect(play).toHaveBeenCalledTimes(2));
});
it("renders every composition and keeps Instagram/Pinterest cards free of embedded scripts", () => {
  for (const [composition, preset] of Object.entries(sectionCompositions)) {
    const html = renderToStaticMarkup(
      <CustomPortfolioSection
        section={{
          ...section,
          composition: composition as CustomSection["composition"],
          renderer: preset.renderer,
        }}
        language="tr"
      />,
    );
    expect(html).toContain("My work");
    expect(html).not.toContain("<iframe");
    expect(html).not.toContain("<script");
  }
});
it("saves a YouTube starter and hero background through the normal profile editor", async () => {
  const initial = {
    username: "example-owner",
    profile: profileSchema.parse(profile),
    revision: 1,
    updatedAt: "2026-10-30",
  };
  let saved = initial;
  const fetcher = vi.fn(async (_url, options) => {
    saved = {
      ...initial,
      profile: profileSchema.parse(JSON.parse(options.body).profile),
      revision: 2,
    };
    return { ok: true, json: async () => saved };
  });
  vi.stubGlobal("fetch", fetcher);
  render(<ProfileEditor initial={initial} />);
  fireEvent.click(screen.getByRole("button", { name: "Custom sections" }));
  fireEvent.change(screen.getByLabelText(/Section starter/), {
    target: { value: "youtube" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Add custom section" }));
  fireEvent.click(screen.getByRole("button", { name: "+ Add section items" }));
  fireEvent.change(screen.getByLabelText(/^Item link/), {
    target: { value: "https://youtu.be/M7lc1UVf-VE" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Appearance" }));
  fireEvent.click(screen.getByLabelText("Use hero background"));
  fireEvent.change(screen.getByLabelText(/^Background media URL/), {
    target: { value: hero.url },
  });
  fireEvent.click(screen.getByRole("button", { name: "Save changes" }));
  await waitFor(() => expect(saved.revision).toBe(2));
  expect(saved.profile.hero?.url).toBe(hero.url);
  expect(saved.profile.customSections?.[0]?.composition).toBe("youtube");
});
