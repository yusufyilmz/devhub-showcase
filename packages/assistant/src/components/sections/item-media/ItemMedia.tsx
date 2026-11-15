import { getPortfolioCopy, getSocialWork } from "@shared/config";
import { WorkMedia } from "@shared/ui/display";
import { safeLink } from "@shared/utils";

import { presenterStyles } from "../section-presentation/styles";
import type { ItemMediaOptions } from "../section-presentation/types";

export function ItemMedia({ item, video, language }: ItemMediaOptions) {
  const text = getPortfolioCopy(language);
  const work = getSocialWork(item.url);
  return video && safeLink(item.url) && /\.(mp4|webm|ogg)(\?|$)/i.test(item.url) ? (
    <video
      className={presenterStyles.element1}
      controls
      playsInline
      poster={item.imageUrl && safeLink(item.imageUrl) ? item.imageUrl : undefined}
      preload="none"
    >
      <source src={item.url} />
      <track
        default
        kind="captions"
        label="Captions"
        src={item.captionsUrl && safeLink(item.captionsUrl) ? item.captionsUrl : undefined}
      />
    </video>
  ) : (
    <WorkMedia
      imageUrl={item.imageUrl}
      loadLabel={text.loadVideo}
      sourceUrl={work ? item.url : undefined}
      title={item.title}
      unloadLabel={text.unloadVideo}
      youtubeId={video && work?.provider === "youtube" ? work.id : undefined}
    />
  );
}
