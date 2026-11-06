"use client";

import type { CSSProperties } from "react";
import { type DragEvent, type FC, useState } from "react";

import { IconButton } from "@shared/ui/icon-button";
import { Typography } from "@shared/ui/typography";
import { logger } from "@shared/utils/client-logger";

import { trelloActions } from "../../stores/trelloStore";
import type { TrelloCard as TrelloCardType } from "../../types";
import { Card, CardBody, CardHeader, Flex, Heading, Label, Stack } from "../ui";
import { TrelloCardDetailModal } from "./TrelloCardDetailModal";

interface TrelloCardProps {
  card: TrelloCardType;
  className?: string;
  draggable?: boolean;
  onClick?: (card: TrelloCardType) => void;
  onDelete?: (cardId: string) => void;
  onEdit?: (card: TrelloCardType) => void;
  onMove?: (cardId: string, targetListId: string) => void;
  showActions?: boolean;
  style?: CSSProperties;
}

/**
 * ✅ RESPONSIVE TRELLO CARD - PURE UI COMPONENTS PATTERN
 *
 * Shows card title, labels, milestones (checklist progress), and due dates.
 * Responsive width that adapts to the board list container.
 * Content-based height for optimal space usage.
 *
 * Features:
 * - Full width of parent container (responsive)
 * - Content-based height (no fixed dimensions)
 * - Always visible delete button in top right
 * - Labels with overflow indicator
 * - Checklist progress indicators (milestones)
 * - Due date with status colors
 *
 * This demonstrates the pattern you requested:
 * - Uses Card, CardHeader, CardBody instead of raw divs
 * - Uses IconButton instead of raw button elements
 * - Uses Label/Heading/Text instead of raw spans/headings
 * - Uses Flex/Stack instead of raw divs with flexbox
 *
 * Tomorrow you can easily replace with any UI library!
 */
export const TrelloCard: FC<TrelloCardProps> = ({
  card,
  className = "",
  style = {},
  onClick,
  // onEdit,
  onDelete,
  // onMove,
  draggable = false,
  showActions = true,
}) => {
  // ✅ Business Logic - This stays the same regardless of UI library
  const [showCardModal, setShowCardModal] = useState(false); // ✅ Main card detail modal

  // Safety check for card data
  if (!card?.id) {
    logger("TrelloCard").error("TrelloCard: Invalid card data", card);
    return null;
  }

  // ✅ Card editing happens in the modal, not inline

  const handleCardClick = () => {
    setShowCardModal(true);
    onClick?.(card); // ✅ Still call parent onClick if provided
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete card "${card.name}"?`)) return;

    try {
      if (!trelloActions?.deleteCard) {
        logger("TrelloCard").error("TrelloCard: Store actions not available");
        return;
      }
      await trelloActions.deleteCard(card.id);
      onDelete?.(card.id);
    } catch (error) {
      logger("TrelloCard").error("TrelloCard: Failed to delete card", error);
    }
  };

  const handleDragStart = (e: DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData(
      "text/plain",
      JSON.stringify({
        cardId: card.id,
        sourceListId: card.idList,
      }),
    );
  };

  // ============================================================================
  // ✅ PURE UI COMPONENTS USAGE - NO RAW HTML ELEMENTS!
  // ============================================================================

  // ✅ NO INLINE EDITING - Cards open detail modal on click

  // DISPLAY STATE - Using Card structure with Header, Body, Footer
  return (
    <>
      <Card
        className={className}
        draggable={draggable}
        onClick={handleCardClick}
        onDragStart={handleDragStart}
        style={{
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          marginBottom: "8px",
          minHeight: "auto", // ✅ Content-based height
          width: "100%", // ✅ Full width of the list container
          ...style,
        }}
      >
        {/* ✅ CARD HEADER - Title and Actions */}
        <CardHeader style={{ paddingBottom: "8px" }}>
          <Flex align="start" gap="md" justify="between">
            <Heading
              level={4}
              style={{
                color: "#172b4d",
                flex: 1,
                fontSize: "14px",
                fontWeight: "500",
                lineHeight: "1.3",
                margin: 0,
              }}
            >
              {card.name || "Untitled Card"}
            </Heading>

            {showActions && (
              <IconButton
                onClick={(e) => {
                  e?.stopPropagation(); // Prevent card click when deleting
                  handleDelete();
                }}
                style={{
                  fontSize: "12px",
                  opacity: 0.7,
                  padding: "2px",
                }}
                title="Delete card"
                variant="secondary"
              >
                🗑️
              </IconButton>
            )}
          </Flex>
        </CardHeader>

        {/* ✅ CARD BODY - Labels, Milestones, Due Date */}
        <CardBody style={{ paddingTop: 0 }}>
          <Stack gap="8px">
            {/* Labels */}
            {card.labels && card.labels.length > 0 && (
              <Flex gap="sm" wrap>
                {card.labels.slice(0, 4).map((label) => (
                  <Label color={label.color || "#ddd"} key={label.id} small>
                    {label.name}
                  </Label>
                ))}
                {card.labels.length > 4 && (
                  <Label color="#ddd" small>
                    +{card.labels.length - 4}
                  </Label>
                )}
              </Flex>
            )}

            {/* Milestones (Checklist Progress) and Due Date */}
            <Flex align="center" justify="between">
              <Flex align="center" gap="lg">
                {/* Checklist Progress (Milestones) */}
                {card.checklists &&
                  card.checklists.length > 0 &&
                  (() => {
                    const totalItems = card.checklists.reduce(
                      (acc, list) => acc + (list.checkItems?.length || 0),
                      0,
                    );
                    const completedItems = card.checklists.reduce(
                      (acc, list) =>
                        acc +
                        (list.checkItems?.filter((item) => item.state === "complete")?.length || 0),
                      0,
                    );

                    if (totalItems > 0) {
                      return (
                        <Flex align="center" gap="sm">
                          <span style={{ fontSize: "12px" }}>☑️</span>
                          <Typography
                            color={completedItems === totalItems ? "success" : "muted"}
                            style={{ fontSize: "12px" }}
                          >
                            {completedItems}/{totalItems}
                          </Typography>
                        </Flex>
                      );
                    }
                    return null;
                  })()}

                {/* Attachments Count */}
                {card.attachments && card.attachments.length > 0 && (
                  <Flex align="center" gap="sm">
                    <span style={{ fontSize: "12px" }}>📎</span>
                    <Typography color="muted">{card.attachments.length}</Typography>
                  </Flex>
                )}
              </Flex>

              {/* Due Date */}
              {card.due && (
                <Flex align="center" gap="sm">
                  <span style={{ fontSize: "11px" }}>📅</span>
                  <Typography
                    color={
                      card.dueComplete
                        ? "success"
                        : new Date(card.due) < new Date()
                          ? "destructive"
                          : "muted"
                    }
                    style={{ fontWeight: card.dueComplete ? "bold" : "normal" }}
                  >
                    {new Date(card.due).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "short",
                    })}
                  </Typography>
                </Flex>
              )}
            </Flex>
          </Stack>
        </CardBody>
      </Card>

      {/* ✅ CARD DETAIL MODAL - Full editing capabilities */}
      <TrelloCardDetailModal
        card={card}
        isOpen={showCardModal}
        onClose={() => setShowCardModal(false)}
        onDelete={onDelete}
      />
    </>
  );
};

export default TrelloCard;
