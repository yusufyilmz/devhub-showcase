import { ItemContent } from "../presenter";
import type { PostOptions } from "./types";

export function Post({ item, language }: PostOptions) {
  return (
    <article>
      <h3>{item.title}</h3>
      <ItemContent item={item} language={language} />
    </article>
  );
}
