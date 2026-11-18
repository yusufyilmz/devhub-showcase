"use client";

import type { CSSProperties } from "react";
import { type DragEvent, type FC, useState } from "react";

import { Button } from "@shared/ui/button";
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
  onOpen?: () => void;
  showActions?: boolean;
  style?: CSSProperties;
}

function hasCardDetails(card: TrelloCardType) {
  return Boolean(
    card.labels?.length || card.checklists?.length || card.due || card.attachments?.length,
  );
}

function ChecklistProgress({ checklists }: Pick<TrelloCardType, "checklists">) {
  const items = checklists?.flatMap((list) => list.checkItems ?? []) ?? [];
  if (!items.length) return null;
  const completed = items.filter((item) => item.state === "complete").length;
  return (
    <Typography
      className="text-xs tabular-nums"
      color={completed === items.length ? "success" : "muted"}
    >
      {completed}/{items.length} complete
    </Typography>
  );
}

function DueDate({ date, complete }: { date: string; complete: boolean }) {
  const due = new Date(date);
  return (
    <Typography
      className="text-xs tabular-nums"
      color={complete ? "success" : due < new Date() ? "destructive" : "muted"}
    >
      <time dateTime={date}>
        {due.toLocaleDateString("en-US", { day: "numeric", month: "short" })}
      </time>
    </Typography>
  );
}

export const TrelloCard: FC<TrelloCardProps> = ({
  card,
  className = "",
  style = {},
  onClick,
  // onEdit,
  onDelete,
  onOpen,
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
    if (onOpen) {
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("application/x-mydevstudio-trello-card", card.id);
    }
    e.dataTransfer.setData(
      "text/plain",
      JSON.stringify({
        cardId: card.id,
        sourceListId: card.idList,
      }),
    );
  };
  const cardTitle = card.name || "Untitled Card";

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
        onClick={onOpen ? undefined : handleCardClick}
        onDragStart={handleDragStart}
        style={{
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",

          minHeight: "auto", // ✅ Content-based height
          padding: 0,
          width: "100%", // ✅ Full width of the list container
          ...style,
        }}
      >
        {/* ✅ CARD HEADER - Title and Actions */}
        <CardHeader className="p-3" style={{ marginBottom: 0 }}>
          <Flex align="start" gap="md" justify="between">
            <Heading
              level={4}
              style={{
                color: "var(--card-foreground)",
                flex: 1,
                fontSize: "14px",
                fontWeight: "500",
                lineHeight: "1.3",
                margin: 0,
              }}
            >
              {onOpen ? (
                <Button
                  className="w-full rounded-sm wrap-anywhere text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  onClick={onOpen}
                  type="button"
                  variant="unstyled"
                >
                  {cardTitle}
                </Button>
              ) : (
                cardTitle
              )}
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
        {(showActions || hasCardDetails(card)) && (
          <CardBody className="px-3 pt-0 pb-3">
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
                  <ChecklistProgress checklists={card.checklists} />

                  {/* Attachments Count */}
                  {card.attachments && card.attachments.length > 0 && (
                    <Flex align="center" gap="sm">
                      <span style={{ fontSize: "12px" }}>📎</span>
                      <Typography color="muted">{card.attachments.length}</Typography>
                    </Flex>
                  )}
                </Flex>

                {card.due && <DueDate complete={card.dueComplete} date={card.due} />}
              </Flex>
            </Stack>
          </CardBody>
        )}
      </Card>

      {/* ✅ CARD DETAIL MODAL - Full editing capabilities */}
      {!onOpen && (
        <TrelloCardDetailModal
          card={card}
          isOpen={showCardModal}
          onClose={() => setShowCardModal(false)}
          onDelete={onDelete}
        />
      )}
    </>
  );
};

export default TrelloCard;
