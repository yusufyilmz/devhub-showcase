import type { ComponentProps } from "react";

import { RevealCard as SharedRevealCard } from "@shared/components/cards";
import { getPortfolioCopy, type Language } from "@shared/content";
export function RevealCard({
  language = "en",
  ...props
}: ComponentProps<typeof SharedRevealCard> & { language?: Language }) {
  const text = getPortfolioCopy(language);
  const labels = {
    fullDetails: text.fullDetails,
    hideDetails: text.hideDetails,
    hoverDetails: text.hoverDetails,
    keyboardDetails: text.keyboardDetails,
    showDetails: text.showDetails,
    tapClose: text.tapClose,
    tapDetails: text.tapDetails,
  };
  return <SharedRevealCard {...props} labels={labels} />;
}
