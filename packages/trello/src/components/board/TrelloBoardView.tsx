"use client";

import { type FC, useCallback, useEffect, useState } from "react";

import { Button } from "@shared/ui/button";
import { Card } from "@shared/ui/card";
import { Flex } from "@shared/ui/flex";
import { IconButton } from "@shared/ui/icon-button";
import { Input } from "@shared/ui/input";
import { Typography } from "@shared/ui/typography";

import type { BoardService } from "../../services/BoardService";
import type { TrelloBoard, TrelloCard, TrelloList } from "../../types";

interface TrelloBoardViewProps {
  board: TrelloBoard;
  onBack: () => void;
  trelloService: BoardService;
}

interface TrelloCardComponentProps {
  card: TrelloCard;
  onCardClick: (card: TrelloCard) => void;
  onCardDelete: (cardId: string) => void;
  onCardEdit: (card: TrelloCard) => void;
}

interface TrelloListComponentProps {
  cards: TrelloCard[];
  list: TrelloList;
  onAddCard: (listId: string, cardName: string) => void;
  onCardClick: (card: TrelloCard) => void;
  onCardDelete: (cardId: string) => void;
  onCardEdit: (card: TrelloCard) => void;
  trelloService: BoardService;
}

const TrelloCardComponent: FC<TrelloCardComponentProps> = ({
  card,
  onCardClick,
  onCardEdit,
  onCardDelete,
}) => {
  const [showActions, setShowActions] = useState(false);

  return (
    <Card
      onClick={() => onCardClick(card)}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      style={{
        backgroundColor: "var(--neutral-50)",
        border: "1px solid var(--neutral-200)",
        borderRadius: "var(--radius-s)",
        cursor: "pointer",
        marginBottom: "var(--space-s)",
        padding: "var(--space-s)",
        position: "relative",
        transition: "all 0.2s ease",
      }}
    >
      <Flex direction="column" gap="xs">
        <Flex gap="none" horizontal="between" vertical="start">
          <Typography style={{ flex: 1, fontWeight: 500 }} variant="small">
            {card.name}
          </Typography>
          {showActions && (
            <Flex gap="xs">
              <IconButton
                aria-label="Edit card"
                onClick={(e: any) => {
                  e.stopPropagation();
                  onCardEdit(card);
                }}
                size="sm"
                variant="ghost"
              >
                ✏️
              </IconButton>
              <IconButton
                aria-label="Delete card"
                onClick={(e: any) => {
                  e.stopPropagation();
                  onCardDelete(card.id);
                }}
                size="sm"
                variant="ghost"
              >
                🗑️
              </IconButton>
            </Flex>
          )}
        </Flex>

        {card.desc && (
          <Typography style={{ color: "var(--neutral-600)" }} variant="caption">
            {card.desc.length > 100 ? `${card.desc.substring(0, 100)}...` : card.desc}
          </Typography>
        )}

        {card.due && (
          <Typography
            style={{
              color: new Date(card.due) < new Date() ? "var(--danger-600)" : "var(--neutral-500)",
              fontSize: "0.7rem",
            }}
            variant="caption"
          >
            Due: {new Date(card.due).toLocaleDateString()}
          </Typography>
        )}

        {card.labels && card.labels.length > 0 && (
          <Flex gap="xs" wrap>
            {card.labels.slice(0, 3).map((label) => (
              <div
                key={label.id}
                style={{
                  backgroundColor: label.color || "var(--neutral-300)",
                  borderRadius: "3px",
                  color: "white",
                  fontSize: "0.6rem",
                  fontWeight: 500,
                  padding: "2px 6px",
                }}
              >
                {label.name || label.color}
              </div>
            ))}
            {card.labels.length > 3 && (
              <Typography style={{ color: "var(--neutral-500)" }} variant="caption">
                +{card.labels.length - 3} more
              </Typography>
            )}
          </Flex>
        )}
      </Flex>
    </Card>
  );
};

const TrelloListComponent: FC<TrelloListComponentProps> = ({
  list,
  cards,
  onCardClick,
  onCardEdit,
  onCardDelete,
  onAddCard,
}) => {
  const [showAddCard, setShowAddCard] = useState(false);
  const [newCardName, setNewCardName] = useState("");
  const [isAddingCard, setIsAddingCard] = useState(false);

  const handleAddCard = async () => {
    if (!newCardName.trim()) return;

    setIsAddingCard(true);
    try {
      await onAddCard(list.id, newCardName.trim());
      setNewCardName("");
      setShowAddCard(false);
    } finally {
      setIsAddingCard(false);
    }
  };

  const handleKeyPress = (e: any) => {
    if (e.key === "Enter") {
      handleAddCard();
    } else if (e.key === "Escape") {
      setShowAddCard(false);
      setNewCardName("");
    }
  };

  return (
    <Card
      style={{
        backgroundColor: "var(--neutral-100)",
        border: "1px solid var(--neutral-200)",
        borderRadius: "var(--radius-m)",
        display: "flex",
        flexDirection: "column",
        height: "fit-content",
        maxHeight: "70vh",
        maxWidth: "280px",
        minWidth: "280px",
        padding: "var(--space-m)",
      }}
    >
      {/* List Header */}
      <Flex
        gap="none"
        horizontal="between"
        style={{ marginBottom: "var(--space-m)" }}
        vertical="center"
      >
        <Typography as="h3" style={{ fontWeight: 600 }} variant="h5">
          {list.name}
        </Typography>
        <Typography
          style={{
            backgroundColor: "var(--neutral-200)",
            borderRadius: "10px",
            color: "var(--neutral-500)",
            padding: "2px 6px",
          }}
          variant="caption"
        >
          {cards.length}
        </Typography>
      </Flex>

      {/* Cards Container */}
      <div
        style={{
          flex: 1,
          marginBottom: "var(--space-s)",
          minHeight: "100px",
          overflowY: "auto",
        }}
      >
        {cards.map((card) => (
          <TrelloCardComponent
            card={card}
            key={card.id}
            onCardClick={onCardClick}
            onCardDelete={onCardDelete}
            onCardEdit={onCardEdit}
          />
        ))}
      </div>

      {/* Add Card Section */}
      {showAddCard ? (
        <Flex direction="column" gap="sm">
          <Input
            autoFocus
            id={`add-card-${list.id}`}
            onChange={(e: any) => setNewCardName(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Enter card title..."
            style={{ fontSize: "0.875rem" }}
            value={newCardName}
          />
          <Flex gap="sm">
            <Button
              disabled={!newCardName.trim() || isAddingCard}
              onClick={handleAddCard}
              size="sm"
              variant="default"
            >
              {isAddingCard ? "Adding..." : "Add Card"}
            </Button>
            <Button
              onClick={() => {
                setShowAddCard(false);
                setNewCardName("");
              }}
              size="sm"
              variant="secondary"
            >
              Cancel
            </Button>
          </Flex>
        </Flex>
      ) : (
        <Button
          onClick={() => setShowAddCard(true)}
          size="sm"
          style={{
            color: "var(--neutral-600)",
            justifyContent: "flex-start",
            padding: "var(--space-s)",
          }}
          variant="ghost"
        >
          + Add a card
        </Button>
      )}
    </Card>
  );
};

export const TrelloBoardView: FC<TrelloBoardViewProps> = ({ trelloService, board, onBack }) => {
  const [lists, setLists] = useState<TrelloList[]>([]);
  const [cards, setCards] = useState<TrelloCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, showError] = useState<string | null>(null);
  const [_selectedCard, setSelectedCard] = useState<TrelloCard | null>(null);

  // Load board data
  const loadBoardData = useCallback(async () => {
    setLoading(true);
    showError(null);

    try {
      // Load lists
      const listsResponse = await trelloService.getListsOnBoard(board.id);
      if (listsResponse.success && listsResponse.data) {
        setLists(listsResponse.data);
      }

      // Load cards
      const cardsResponse = await trelloService.getCardsOnBoard(board.id);
      if (cardsResponse.success && cardsResponse.data) {
        setCards(cardsResponse.data);
      }
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to load board data");
    } finally {
      setLoading(false);
    }
  }, [trelloService, board.id]);

  // Initialize board data
  useEffect(() => {
    loadBoardData();
  }, [loadBoardData]);

  const handleCardClick = (card: TrelloCard) => {
    setSelectedCard(card);
    // TODO: Open card detail modal
  };

  const handleCardEdit = (_card: TrelloCard) => {
    // TODO: Open card edit modal
    // TODO: Open card edit modal
  };

  const handleCardDelete = async (cardId: string) => {
    try {
      const response = await trelloService.deleteCard(cardId);
      if (response.success) {
        setCards((prev) => prev.filter((card) => card.id !== cardId));
      }
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to delete card");
    }
  };

  const handleAddCard = async (listId: string, cardName: string) => {
    try {
      const response = await trelloService.createCard(listId, {
        desc: "",
        name: cardName,
      });

      if (response.success && response.data) {
        setCards((prev) => [...prev, response.data as TrelloCard]);
      }
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to add card");
    }
  };

  const getCardsForList = (listId: string) => {
    return cards.filter((card) => card.idList === listId);
  };

  if (loading) {
    return (
      <Flex gap="none" horizontal="center" style={{ minHeight: "400px" }} vertical="center">
        <Typography variant="body2">Loading board...</Typography>
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex
        direction="column"
        gap="md"
        horizontal="center"
        style={{ minHeight: "400px" }}
        vertical="center"
      >
        <Typography style={{ color: "var(--danger-600)" }} variant="body2">
          Error: {error}
        </Typography>
        <Button onClick={loadBoardData} variant="secondary">
          Try Again
        </Button>
      </Flex>
    );
  }

  return (
    <Flex direction="column" gap="lg" style={{ height: "100vh", padding: "var(--space-l)" }}>
      {/* Board Header */}
      <Flex gap="none" horizontal="between" vertical="center">
        <Flex gap="md" vertical="center">
          <IconButton aria-label="Go back" onClick={onBack} variant="ghost">
            ←
          </IconButton>
          <Typography as="h1" variant="h1">
            {board.name}
          </Typography>
          {board.desc && (
            <Typography style={{ color: "var(--neutral-600)" }} variant="body2">
              {board.desc}
            </Typography>
          )}
        </Flex>

        <Flex gap="sm">
          <Button onClick={loadBoardData} size="sm" variant="secondary">
            Refresh
          </Button>
          <Button
            onClick={() => window.open(board.url, "_blank", "noopener,noreferrer")}
            size="sm"
            variant="ghost"
          >
            Open in Trello
          </Button>
        </Flex>
      </Flex>

      {/* Board Lists */}
      <div
        style={{
          flex: 1,
          overflowX: "auto",
          overflowY: "hidden",
          paddingBottom: "var(--space-m)",
        }}
      >
        <Flex gap="lg" style={{ height: "100%", minWidth: "fit-content" }}>
          {lists.map((list) => (
            <TrelloListComponent
              cards={getCardsForList(list.id)}
              key={list.id}
              list={list}
              onAddCard={handleAddCard}
              onCardClick={handleCardClick}
              onCardDelete={handleCardDelete}
              onCardEdit={handleCardEdit}
              trelloService={trelloService}
            />
          ))}

          {lists.length === 0 && (
            <Flex
              direction="column"
              gap="md"
              horizontal="center"
              style={{
                border: "2px dashed var(--neutral-300)",
                borderRadius: "var(--radius-m)",
                minHeight: "200px",
                minWidth: "300px",
                padding: "var(--space-xl)",
              }}
              vertical="center"
            >
              <Typography style={{ color: "var(--neutral-500)" }} variant="body2">
                No lists found in this board
              </Typography>
              <Button
                onClick={() => window.open(board.url, "_blank", "noopener,noreferrer")}
                size="sm"
                variant="default"
              >
                Add Lists in Trello
              </Button>
            </Flex>
          )}
        </Flex>
      </div>
    </Flex>
  );
};
