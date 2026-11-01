"use client";

import type { CSSProperties, FC, ReactNode } from "react";

import { cn } from "cn";

import type { TrelloBoard } from "../../types";
// ✅ PURE UI COMPONENTS - Framework agnostic!
import { BoardContainer } from "../ui";

interface TrelloBoardBackgroundProps {
  board?: TrelloBoard;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

/**
 * ✅ REFACTORED BOARD BACKGROUND - PURE UI COMPONENTS PATTERN
 *
 * Instead of raw div, uses BoardContainer which can be easily replaced with:
 * - MUI Box
 * - Ant Design Layout
 * - Chakra Container
 * - Any other UI library container
 */
export const TrelloBoardBackground: FC<TrelloBoardBackgroundProps> = ({
  board,
  children,
  className = "",
  style = {},
}) => {
  // ✅ Business Logic - Framework independent
  const backgroundColor = board?.prefs?.backgroundColor || "#0079bf";
  const backgroundImage = board?.prefs?.backgroundImage;

  const backgroundStyle: CSSProperties = {
    backgroundColor,
    backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    ...style,
  };

  // ✅ PURE UI COMPONENT USAGE - NO RAW HTML DIV!
  return (
    <BoardContainer
      className={cn("bg-background", className)}
      data-board-id={board?.id}
      data-testid="trello-board-background"
      style={backgroundStyle}
    >
      {children}
    </BoardContainer>
  );
};

export default TrelloBoardBackground;
