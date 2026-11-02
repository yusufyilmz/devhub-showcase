import type { PageSection } from "./types";

export function discoverPageSections(): PageSection[] {
  return Array.from(
    document.querySelectorAll<HTMLElement>("main section, main [data-page-section]"),
  )
    .filter((node) => {
      const heading = node.querySelector("h1, h2");
      const parent = node.parentElement?.closest("section, [data-page-section]");
      const nested =
        parent &&
        parent.querySelector("h1, h2")?.closest("section, [data-page-section]") === parent;
      return (
        !nested &&
        node.getClientRects().length > 0 &&
        !node.closest("[hidden], [aria-hidden='true']") &&
        heading?.closest("section, [data-page-section]") === node
      );
    })
    .map((node, index) => {
      if (!node.id) {
        let id = `page-section-${index + 1}`;
        while (document.getElementById(id)) id += "-nav";
        node.id = id;
      }
      return {
        description: Array.from(node.querySelectorAll("p:not(.eyebrow)"))
          .find(
            (paragraph) =>
              paragraph.closest("section, [data-page-section]") === node &&
              paragraph.textContent !== paragraph.textContent?.toUpperCase(),
          )
          ?.textContent?.trim()
          .slice(0, 160),
        id: node.id,
        title: node.querySelector("h1, h2")?.textContent?.trim() || "Section",
      };
    });
}

export function currentPageSection(sections: PageSection[]): string {
  const visible = sections.filter(({ id }) => document.getElementById(id)?.getClientRects().length);
  if (
    window.scrollY > 0 &&
    window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 8
  )
    return visible.at(-1)?.id ?? "";
  return (
    visible
      .filter(
        ({ id }) =>
          (document.getElementById(id)?.getBoundingClientRect().top ?? Number.POSITIVE_INFINITY) <=
          window.innerHeight * 0.35,
      )
      .at(-1)?.id ??
    visible[0]?.id ??
    ""
  );
}
