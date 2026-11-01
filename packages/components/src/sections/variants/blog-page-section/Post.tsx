import type { CustomSection, Language } from "@shared/config";

import { ItemContent } from "../../presenter/presenter";

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
