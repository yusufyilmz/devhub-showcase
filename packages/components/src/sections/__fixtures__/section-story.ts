import {
  type AuthorableSectionType,
  authorableSections,
  type CustomSection,
  getSectionRenderers,
} from "@shared/config";

import type { SectionProps } from "../types";

/** Fictional fixtures shared by the colocated section stories. Never use account data. */
export function sectionStory(
  type: AuthorableSectionType,
  state: "default" | "compact" | "empty" = "default",
): SectionProps {
  const name = authorableSections[type].name;
  const empty = state === "empty";
  const section: CustomSection = {
    id: `custom-story-${type}`,
    items: empty
      ? []
      : [
          {
            id: "first",
            title: "A thoughtful beginning",
            body: "A fictional example with space for the story behind your work.",
            url: "",
            period: "2024 · Present",
          },
          {
            id: "second",
            title: "The next chapter",
            body: "Clear ideas, careful craft and a little room to grow.",
            url: "",
            period: "2022 · 2024",
          },
          {
            id: "third",
            title: "Made with purpose",
            body: "A second perspective on the things that matter.",
            url: "",
          },
        ],
    options: empty
      ? {}
      : {
          columns: state === "compact" ? 1 : 3,
          description: `Explore the ${name.toLocaleLowerCase()} section with fictional content.`,
          ...(type === "contact-form" ? { email: "hello@example.com" } : {}),
          ...(type === "newsletter" ? { actionUrl: "https://example.com/newsletter" } : {}),
          ...(type === "map" ? { latitude: 41.3874, longitude: 2.1686 } : {}),
        },
    renderer: getSectionRenderers(type)[0],
    sectionType: type,
    title: name,
    visible: true,
  };
  return {
    section,
    preview: true,
    anchors: empty
      ? []
      : [
          { id: "introduction", title: "Introduction" },
          { id: "work", title: "Selected work" },
        ],
  };
}
