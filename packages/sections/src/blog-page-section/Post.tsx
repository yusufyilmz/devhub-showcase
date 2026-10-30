import type { CustomSection, Language } from "@shared/content";

import { ItemContent } from "../shared/presenter";
export function Post({
  item,
  language,
}: {
  item: CustomSection["items"][number];
  language?: Language;
}) {
  return (
    <article>
      <h3>{item.title}</h3>
      <ItemContent item={item} language={language} />
    </article>
  );
}
