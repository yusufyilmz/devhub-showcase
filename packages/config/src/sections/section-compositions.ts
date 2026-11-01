export const sectionCompositions = {
  cta: {
    name: "Call to action",
    renderer: "cards",
    title: "Let’s work together",
  },
  custom: { name: "Custom", renderer: "list", title: "New section" },
  faq: {
    name: "FAQs",
    renderer: "accordion",
    title: "Frequently asked questions",
  },
  instagram: {
    name: "Instagram work",
    renderer: "cards",
    title: "Instagram work",
  },
  pinterest: {
    name: "Pinterest work",
    renderer: "cards",
    title: "Pinterest work",
  },
  services: { name: "Services", renderer: "cards", title: "Services" },
  statistics: {
    name: "Statistics",
    renderer: "cards",
    title: "By the numbers",
  },
  testimonials: {
    name: "Testimonials",
    renderer: "cards",
    title: "What people say",
  },
  youtube: {
    name: "YouTube work",
    renderer: "cards",
    title: "Films and videos",
  },
} as const;
export type SectionComposition = keyof typeof sectionCompositions;
export const sectionCompositionIds = [
  "custom",
  "services",
  "testimonials",
  "faq",
  "statistics",
  "cta",
  "youtube",
  "instagram",
  "pinterest",
] as const;
export function getSocialWork(url: string) {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:" || parsed.username || parsed.password) return null;
    const host = parsed.hostname.toLowerCase();
    let video: string | null = null;
    if (host === "youtu.be") video = parsed.pathname.split("/")[1] ?? null;
    if (["youtube.com", "www.youtube.com", "m.youtube.com"].includes(host))
      video =
        parsed.pathname === "/watch"
          ? parsed.searchParams.get("v")
          : (/^\/(shorts|embed|live)\/([^/]+)\/?$/.exec(parsed.pathname)?.[2] ?? null);
    if (video && /^[a-zA-Z0-9_-]{11}$/.test(video))
      return { id: video, provider: "youtube" as const };
    if (
      ["instagram.com", "www.instagram.com"].includes(host) &&
      /^\/(p|reel|tv)\/[a-zA-Z0-9_-]+\/?$/.test(parsed.pathname)
    )
      return { id: parsed.pathname, provider: "instagram" as const };
    if (
      ["pinterest.com", "www.pinterest.com"].includes(host) &&
      /^\/pin\/[0-9]+\/?$/.test(parsed.pathname)
    )
      return { id: parsed.pathname, provider: "pinterest" as const };
  } catch {
    /* Invalid drafts are never embedded. */
  }
  return null;
}
