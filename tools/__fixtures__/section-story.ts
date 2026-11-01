import {
  type AuthorableSectionType,
  authorableSections,
  getSectionRenderers,
} from "../../packages/config/src/sections/authorable-sections";
import type { CustomSection } from "../../packages/config/src/sections/custom-sections";
import type { SectionProps } from "../../packages/ui/src/sections/types";

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
            body: "A fictional example with space for the story behind your work.",
            id: "first",
            period: "2024 · Present",
            title: "A thoughtful beginning",
            url: "",
          },
          {
            body: "Clear ideas, careful craft and a little room to grow.",
            id: "second",
            period: "2022 · 2024",
            title: "The next chapter",
            url: "",
          },
          {
            body: "A second perspective on the things that matter.",
            id: "third",
            title: "Made with purpose",
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
    anchors: empty
      ? []
      : [
          { id: "introduction", title: "Introduction" },
          { id: "work", title: "Selected work" },
        ],
    preview: true,
    section,
  };
}
