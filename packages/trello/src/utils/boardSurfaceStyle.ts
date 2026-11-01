import type { CSSProperties } from "react";

import type { TrelloBoard } from "../types";

export const TRELLO_BOARD_DEFAULT_COLOR = "#0079bf";

export function boardSurfaceStyle(board?: TrelloBoard | null): CSSProperties {
  const backgroundColor = board?.prefs?.backgroundColor || TRELLO_BOARD_DEFAULT_COLOR;
  const backgroundImage = board?.prefs?.backgroundImage;

  return {
    background: backgroundImage ? `url(${backgroundImage}) center/cover` : backgroundColor,
    backgroundColor,
    height: "100%",
    width: "100%",
  };
}
