import type { AuthorableSectionType, CustomSection } from "@shared/config";

import type { SectionProps } from "../types";

export type ItemMediaOptions = {
  item: CustomSection["items"][number];
  video: boolean;
  language?: SectionProps["language"];
};

export type ItemContentOptions = {
  item: CustomSection["items"][number];
  quote?: boolean;
  hideLink?: boolean;
  video?: boolean;
  language?: SectionProps["language"];
};

export type CollectionViewOptions = SectionProps & { type: AuthorableSectionType };

export type SpecialViewOptions = SectionProps & { type: AuthorableSectionType };

export type SectionPresentationOptions = SectionProps & { type: AuthorableSectionType };
