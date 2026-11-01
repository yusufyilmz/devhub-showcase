"use client";

import type { CSSProperties, FC } from "react";

import { cn } from "cn";
import { shallow } from "zustand/shallow";

import { Avatar, AvatarFallback } from "@shared/ui/Avatar";
import { Button } from "@shared/ui/button";
import { Flex, FlexCol } from "@shared/ui/flex";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@shared/ui/Select";
import { Typography } from "@shared/ui/typography";

import { trelloActions, trelloSelectors, useTrelloStore } from "../../stores/trelloStore";
import type { TrelloBoard } from "../../types";
import { Heading } from "../ui";

const headerGhostButtonClass =
  "border border-white/30 bg-white/20 text-white hover:bg-white/30 hover:text-white";

interface TrelloBoardHeaderProps {
  className?: string;
  onBoardSelect?: (board: TrelloBoard) => void;
  showBoardSwitcher?: boolean;
  showUserInfo?: boolean;
  style?: CSSProperties;
}

export const TrelloBoardHeader: FC<TrelloBoardHeaderProps> = ({
  className = "",
  style = {},
  onBoardSelect,
  showBoardSwitcher = true,
  showUserInfo = true,
}) => {
  const { boards, currentMember, selectedBoard } = useTrelloStore(
    (state) => ({
      boards: trelloSelectors.boards(state),
      currentMember: trelloSelectors.currentMember(state),
      selectedBoard: trelloSelectors.selectedBoard(state),
    }),
    shallow,
  );

  const selectedBoardId = selectedBoard?.id ?? "";

  return (
    <header
      className={cn(
        "border-white/20 bg-[#026aa7] sticky top-0 z-40 border-b px-4 py-3 text-white",
        className,
      )}
      data-testid="trello-board-header"
      style={style}
    >
      <Flex align="center" justify="between" wrap>
        <Flex align="center" gap="md" wrap>
          <Heading className="m-0 text-lg font-semibold text-white" level={4}>
            Trello
          </Heading>

          {showBoardSwitcher && boards.length > 1 && (
            <Select
              onValueChange={(value) => {
                const board = boards.find((item) => item.id === value);
                if (board) onBoardSelect?.(board);
              }}
              value={selectedBoardId}
            >
              <SelectTrigger
                className="min-w-[10rem] border-white/30 bg-white/20 text-white data-[placeholder]:text-white/70"
                size="sm"
              >
                <SelectValue placeholder="Select board…" />
              </SelectTrigger>
              <SelectContent>
                {boards.map((board) => (
                  <SelectItem key={board.id} value={board.id}>
                    {board.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </Flex>

        <Flex align="center" gap="md" wrap>
          {showUserInfo && currentMember && (
            <Flex align="center" gap="sm">
              <Avatar className="size-8 border border-white/30 bg-white/20">
                <AvatarFallback className="bg-transparent text-sm font-semibold text-white">
                  {currentMember.initials}
                </AvatarFallback>
              </Avatar>
              <FlexCol gap="none">
                <Typography as="span" className="text-white" variant="body2">
                  {currentMember.fullName}
                </Typography>
                <Typography as="span" className="text-white/80" variant="caption">
                  @{currentMember.username}
                </Typography>
              </FlexCol>
            </Flex>
          )}

          <Flex gap="sm" wrap>
            <Button
              className={headerGhostButtonClass}
              onClick={() => void trelloActions.fetchBoards()}
              size="sm"
              title="Refresh boards"
              type="button"
              variant="ghost"
            >
              🔄 Refresh
            </Button>
            <Button
              className={headerGhostButtonClass}
              onClick={() => void trelloActions.healthCheck()}
              size="sm"
              title="Health check"
              type="button"
              variant="ghost"
            >
              ❤️ Status
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </header>
  );
};
