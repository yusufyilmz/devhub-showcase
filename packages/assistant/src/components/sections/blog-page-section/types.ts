import type { CustomSection, Language } from "@shared/config";

export type PostOptions = {
  item: CustomSection["items"][number];
  language?: Language;
};
