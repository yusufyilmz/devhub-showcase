import type { AuthorableSectionType } from "@shared/config";
import { createSectionExample, type SectionProps } from "@shared/ui/sections";

export function sectionStory(
  type: AuthorableSectionType,
  state: "default" | "compact" | "empty" = "default",
): SectionProps {
  return createSectionExample(
    type,
    state,
    (file) =>
      new URL(`./examples/${file}.svg`, globalThis.location?.href ?? "http://localhost:6006/").href,
  );
}
