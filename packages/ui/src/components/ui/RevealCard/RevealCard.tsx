import { RevealCard as SharedRevealCard } from "@shared/components/cards";
import { getPortfolioCopy, type Language } from "@shared/content";
import type { ComponentProps } from "react";
export function RevealCard({
  language = "en",
  ...props
}: ComponentProps<typeof SharedRevealCard> & { language?: Language }) {
  const text = getPortfolioCopy(language);
  const labels = {
    showDetails: text.showDetails,
    hideDetails: text.hideDetails,
    fullDetails: text.fullDetails,
    hoverDetails: text.hoverDetails,
    tapDetails: text.tapDetails,
    tapClose: text.tapClose,
    keyboardDetails: text.keyboardDetails,
  };
  return <SharedRevealCard {...props} labels={labels} />;
}
