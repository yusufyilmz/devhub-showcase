"use client";

import type { CSSProperties } from "react";
import { type FC, useState } from "react";

import { shallow } from "zustand/shallow";

import { Button } from "@shared/ui/button";
import { Typography } from "@shared/ui/typography";
import { logger } from "@shared/utils/client-logger";

import { trelloActions, trelloSelectors, useTrelloStore } from "../../stores/trelloStore";
import type { TrelloCard as TrelloCardType, TrelloList as TrelloListType } from "../../types";
import { Flex, Heading, Input, ListContainer, Panel, Stack } from "../ui";
import { TrelloCard } from "./TrelloCard";

interface TrelloListProps {
  className?: string;
  list: TrelloListType;
  onCardAdd?: (listId: string, cardName: string, cardDesc?: string) => void;
  onCardClick?: (cardId: string) => void;
  onCardDelete?: (cardId: string) => void;
  onCardEdit?: (card: TrelloCardType) => void;
  onListUpdate?: (listId: string, updates: Partial<TrelloListType>) => void;
  showActions?: boolean;
  style?: CSSProperties;
}

const COLUMN_WIDTH = 270;
/**
 * ✅ REFACTORED TRELLO LIST - PURE UI COMPONENTS PATTERN
 *
 * Demonstrates how to build a list component using:
 * - ListContainer instead of raw div
 * - Panel for sections
 * - Heading for title
 * - Button for actions
 * - Input for adding cards
 * - Stack for vertical layout
 *
 * Easy to migrate to any UI library!
 */
export const TrelloList: FC<TrelloListProps> = ({
  list,
  className = "",
  style = {},
  onListUpdate,
  onCardAdd,
  onCardClick,
  onCardEdit,
  onCardDelete,
  showActions = true,
}) => {
  // ✅ Business Logic - Framework independent
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCardName, setNewCardName] = useState("");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitle, setEditTitle] = useState(list.name);

  // Get cards for this list using the store
  const { cards, loading } = useTrelloStore(
    (state) => ({
      cards: trelloSelectors.cardsByList(list.id)(state),
      loading: trelloSelectors.loading(state),
    }),
    shallow,
  );

  const handleAddCard = async () => {
    if (!newCardName.trim()) return;

    try {
      await trelloActions.createCard(list.id, {
        name: newCardName.trim(),
      });
      setNewCardName("");
      setIsAddingCard(false);
      onCardAdd?.(list.id, newCardName.trim());
    } catch (error) {
      logger("TrelloList").error("Failed to add card:", { error });
    }
  };

  const handleSaveTitle = async () => {
    if (editTitle.trim() !== list.name) {
      await trelloActions.updateListApi(list.id, { name: editTitle.trim() });
      onListUpdate?.(list.id, { name: editTitle.trim() });
    }
    setIsEditingTitle(false);
  };

  const handleCancelTitle = () => {
    setEditTitle(list.name);
    setIsEditingTitle(false);
  };

  const sortedCards = cards.sort((a, b) => a.pos - b.pos);

  // ============================================================================
  // ✅ PURE UI COMPONENTS USAGE - NO RAW HTML DIVS!
  // ============================================================================

  return (
    <ListContainer
      className={className}
      style={{
        flexShrink: 0, // ✅ Maintain width in flex container
        maxWidth: `${COLUMN_WIDTH}px`, // ✅ Prevent growing
        minWidth: `${COLUMN_WIDTH}px`, // ✅ Prevent shrinking
        width: `${COLUMN_WIDTH}px`, // ✅ Fixed width like real Trello
        ...style,
      }}
    >
      {/* ✅ LIST HEADER - Using Panel + Flex instead of raw divs */}
      <Panel style={{ marginBottom: "8px", padding: "8px" }}>
        <Flex align="center" justify="between">
          {isEditingTitle ? (
            <Flex gap="sm" style={{ flex: 1 }}>
              <Input
                autoFocus
                onChange={(e) => setEditTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSaveTitle();
                  if (e.key === "Escape") handleCancelTitle();
                }}
                style={{ flex: 1 }}
                value={editTitle}
              />
              <Button onClick={handleSaveTitle} size="sm" variant="default">
                ✓
              </Button>
              <Button onClick={handleCancelTitle} size="sm" variant="secondary">
                ✕
              </Button>
            </Flex>
          ) : (
            <>
              <Heading
                level={5}
                onClick={() => setIsEditingTitle(true)}
                style={{ cursor: "pointer", margin: 0 }}
              >
                {list.name}
              </Heading>

              <Typography color="muted">{sortedCards.length}</Typography>
            </>
          )}
        </Flex>
      </Panel>

      {/* ✅ CARDS CONTAINER - Using Stack for vertical layout */}
      <Stack
        gap="sm"
        style={{
          flex: 1,
          // padding: '0 8px 16px 8px',  // ✅ Add padding to cards container
          maxHeight: "calc(100vh - 200px)", // ✅ Limit height to prevent page scroll
          overflow: "auto",
        }}
      >
        {loading.cards ? (
          <Panel style={{ padding: "16px", textAlign: "center" }}>
            <Typography color="muted">Loading cards...</Typography>
          </Panel>
        ) : (
          <>
            {/* Render Cards */}
            {sortedCards.map((card) => (
              <TrelloCard
                card={card}
                key={card.id}
                onClick={() => onCardClick?.(card.id)}
                onDelete={onCardDelete}
                onEdit={onCardEdit}
                showActions={showActions}
              />
            ))}

            {/* Empty State */}
            {sortedCards.length === 0 && (
              <Panel style={{ padding: "16px", textAlign: "center" }}>
                <Typography color="muted">No cards in this list</Typography>
              </Panel>
            )}
          </>
        )}
      </Stack>

      {/* ✅ ADD CARD SECTION - Using Panel + Stack */}
      <Panel style={{ marginTop: "8px", padding: "8px" }}>
        {isAddingCard ? (
          <Stack gap="sm">
            <Input
              autoFocus
              onChange={(e) => setNewCardName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddCard();
                if (e.key === "Escape") {
                  setIsAddingCard(false);
                  setNewCardName("");
                }
              }}
              placeholder="Enter card title..."
              value={newCardName}
            />

            <Flex gap="sm">
              <Button
                disabled={!newCardName.trim()}
                onClick={handleAddCard}
                size="sm"
                variant="default"
              >
                Add Card
              </Button>

              <Button
                onClick={() => {
                  setIsAddingCard(false);
                  setNewCardName("");
                }}
                size="sm"
                variant="secondary"
              >
                Cancel
              </Button>
            </Flex>
          </Stack>
        ) : (
          <Button
            onClick={() => setIsAddingCard(true)}
            style={{ justifyContent: "flex-start", width: "100%" }}
            variant="secondary"
          >
            + Add a card
          </Button>
        )}
      </Panel>
    </ListContainer>
  );
};

export default TrelloList;
