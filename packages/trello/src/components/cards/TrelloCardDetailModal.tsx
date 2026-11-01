"use client";

import { type FC, type ReactNode, useEffect, useRef, useState } from "react";

import { cn } from "cn";

import { Button } from "@shared/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@shared/ui/dialog";
import { Flex, FlexCol } from "@shared/ui/flex";
import { IconButton } from "@shared/ui/icon-button";
import { Separator } from "@shared/ui/seperator";
import { TextField } from "@shared/ui/text-field";
import { Textarea } from "@shared/ui/textarea";
import { Typography } from "@shared/ui/typography";
import { logger } from "@shared/utils/client-logger";

import { trelloActions } from "../../stores/trelloStore";
import type { TrelloCard as TrelloCardType } from "../../types";
import { TrelloCardComments } from "../integration";
import { Heading, Label, MarkdownRenderer, Flex as TrelloFlex } from "../ui";

interface TrelloCardDetailModalProps {
  card: TrelloCardType;
  isOpen: boolean;
  onClose: () => void;
  onDelete?: (cardId: string) => void;
}

function SidebarAction({
  children,
  className,
  onClick,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <Button
      className={cn("h-8 w-full justify-start px-2 font-normal", className)}
      onClick={onClick}
      size="sm"
      type="button"
      variant="ghost"
    >
      {children}
    </Button>
  );
}

function SectionTitle({ icon, title }: { icon: string; title: string }) {
  return (
    <Flex align="center" className="mb-3" gap="sm">
      <span aria-hidden className="text-base">
        {icon}
      </span>
      <Typography as="h3" className="text-base font-semibold" variant="subtitle1">
        {title}
      </Typography>
    </Flex>
  );
}

function CardDetailHeader({
  card,
  editName,
  handleCancelTitle,
  handleSaveTitle,
  handleToggleComplete,
  isCompleted,
  isEditingTitle,
  isSaving,
  requestClose,
  setEditName,
  setIsEditingTitle,
}: {
  card: TrelloCardType;
  editName: string;
  handleCancelTitle: () => void;
  handleSaveTitle: () => void;
  handleToggleComplete: () => void;
  isCompleted: boolean;
  isEditingTitle: boolean;
  isSaving: boolean;
  requestClose: () => void;
  setEditName: (value: string) => void;
  setIsEditingTitle: (value: boolean) => void;
}) {
  return (
    <div className="border-border border-b px-6 py-4">
      <Flex align="start" gap="md" justify="between">
        <Flex align="start" className="min-w-0 flex-1" gap="sm">
          <IconButton
            aria-label={isCompleted ? "Mark incomplete" : "Mark complete"}
            className={cn(
              "mt-0.5 shrink-0 text-lg",
              isCompleted ? "text-success hover:bg-success/10" : "text-muted-foreground",
            )}
            onClick={handleToggleComplete}
            size="sm"
            type="button"
            variant="ghost"
          >
            {isCompleted ? "✅" : "⭕"}
          </IconButton>

          <div className="min-w-0 flex-1">
            {isEditingTitle ? (
              <TextField
                autoFocus
                className="text-2xl font-semibold"
                disabled={isSaving}
                fullWidth
                onBlur={handleSaveTitle}
                onChange={(event) => setEditName(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    handleSaveTitle();
                  }
                  if (event.key === "Escape") handleCancelTitle();
                }}
                placeholder="Card title..."
                value={editName}
              />
            ) : (
              <button
                className="hover:bg-muted/60 w-full rounded-md px-2 py-1.5 text-left transition-colors"
                onClick={() => {
                  setEditName(card.name || "");
                  setIsEditingTitle(true);
                }}
                title="Click to edit title"
                type="button"
              >
                <Heading className="text-2xl leading-snug" level={2} style={{ margin: 0 }}>
                  {card.name || "Untitled Card"}
                </Heading>
              </button>
            )}

            <Typography className="mt-1 pl-2" color="muted" variant="caption">
              in list <strong className="text-foreground">To Do</strong>
            </Typography>
          </div>
        </Flex>

        <Flex align="center" className="shrink-0" gap="xs">
          <IconButton
            aria-label="Share"
            onClick={() => logger("TrelloCardDetailModal").info("Share clicked")}
            size="sm"
            type="button"
            variant="ghost"
          >
            📤
          </IconButton>
          <IconButton aria-label="Cover" size="sm" type="button" variant="ghost">
            🖼️
          </IconButton>
          <IconButton aria-label="More actions" size="sm" type="button" variant="ghost">
            ⋯
          </IconButton>
          <IconButton
            aria-label="Close"
            onClick={requestClose}
            size="sm"
            type="button"
            variant="ghost"
          >
            ✕
          </IconButton>
        </Flex>
      </Flex>
    </div>
  );
}

function CardDescriptionSection({
  card,
  descInputRef,
  editDesc,
  handleCancelDesc,
  handleSaveDescription,
  isEditingDesc,
  isSaving,
  setEditDesc,
  setIsEditingDesc,
}: {
  card: TrelloCardType;
  descInputRef: React.RefObject<HTMLTextAreaElement | null>;
  editDesc: string;
  handleCancelDesc: () => void;
  handleSaveDescription: () => void;
  isEditingDesc: boolean;
  isSaving: boolean;
  setEditDesc: (value: string) => void;
  setIsEditingDesc: (value: boolean) => void;
}) {
  return (
    <section>
      <Flex align="center" className="mb-1" justify="between">
        <SectionTitle icon="📄" title="Description" />
        {!isEditingDesc && (
          <Button
            onClick={() => {
              setEditDesc(card.desc || "");
              setIsEditingDesc(true);
            }}
            size="sm"
            type="button"
            variant="ghost"
          >
            Edit
          </Button>
        )}
      </Flex>

      {isEditingDesc ? (
        <FlexCol gap="sm">
          <Textarea
            className="min-h-40"
            disabled={isSaving}
            onChange={(event) => setEditDesc(event.target.value)}
            placeholder="Add a more detailed description..."
            ref={descInputRef}
            rows={8}
            value={editDesc}
          />
          <Flex gap="sm">
            <Button disabled={isSaving} onClick={handleSaveDescription} size="sm" type="button">
              {isSaving ? "Saving..." : "Save"}
            </Button>
            <Button
              disabled={isSaving}
              onClick={handleCancelDesc}
              size="sm"
              type="button"
              variant="ghost"
            >
              Cancel
            </Button>
          </Flex>
        </FlexCol>
      ) : (
        <button
          className={cn(
            "border-border bg-muted/40 hover:border-primary/30 hover:bg-muted w-full rounded-lg border-2 border-transparent p-4 text-left transition-all",
            !card.desc && "flex min-h-20 items-center justify-center",
          )}
          onClick={() => {
            setEditDesc(card.desc || "");
            setIsEditingDesc(true);
          }}
          type="button"
        >
          {card.desc ? (
            <MarkdownRenderer markdown={card.desc} />
          ) : (
            <Typography className="italic" color="muted" variant="body2">
              Add a more detailed description...
            </Typography>
          )}
        </button>
      )}
    </section>
  );
}

/**
 * Full card detail and editing surface (title, description, comments, actions).
 */
export const TrelloCardDetailModal: FC<TrelloCardDetailModalProps> = ({
  card,
  isOpen,
  onClose,
  onDelete,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [editName, setEditName] = useState(card.name || "");
  const [editDesc, setEditDesc] = useState(card.desc || "");
  const [isSaving, setIsSaving] = useState(false);
  const [showActivity, setShowActivity] = useState(true);
  const [isCompleted, setIsCompleted] = useState(card.dueComplete || false);
  const descInputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setEditName(card.name || "");
    setEditDesc(card.desc || "");
    setIsCompleted(card.dueComplete || false);
  }, [card.name, card.desc, card.dueComplete]);

  useEffect(() => {
    if (isEditingDesc) descInputRef.current?.focus();
  }, [isEditingDesc]);

  const handleSaveTitle = async () => {
    if (!editName.trim()) {
      setEditName(card.name || "");
      setIsEditingTitle(false);
      return;
    }

    if (editName.trim() === card.name) {
      setIsEditingTitle(false);
      return;
    }

    setIsSaving(true);
    try {
      if (!trelloActions?.updateCardApi) {
        logger("TrelloCardDetailModal").error("Store actions not available");
        return;
      }

      await trelloActions.updateCardApi(card.id, { name: editName.trim() });
      setIsEditingTitle(false);
    } catch (error) {
      logger("TrelloCardDetailModal").error("Failed to save card title", { error });
      setEditName(card.name || "");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveDescription = async () => {
    if (editDesc.trim() === card.desc) {
      setIsEditingDesc(false);
      return;
    }

    setIsSaving(true);
    try {
      if (!trelloActions?.updateCardApi) {
        logger("TrelloCardDetailModal").error("Store actions not available");
        return;
      }

      await trelloActions.updateCardApi(card.id, { desc: editDesc.trim() });
      setIsEditingDesc(false);
    } catch (error) {
      logger("TrelloCardDetailModal").error("Failed to save card description", { error });
      setEditDesc(card.desc || "");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelTitle = () => {
    setEditName(card.name || "");
    setIsEditingTitle(false);
  };

  const handleCancelDesc = () => {
    setEditDesc(card.desc || "");
    setIsEditingDesc(false);
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete card "${card.name}"?`)) return;

    try {
      if (!trelloActions?.deleteCard) {
        logger("TrelloCardDetailModal").error("Store actions not available");
        return;
      }

      await trelloActions.deleteCard(card.id);
      onDelete?.(card.id);
      onClose();
    } catch (error) {
      logger("TrelloCardDetailModal").error("Failed to delete card", { error });
    }
  };

  const handleToggleComplete = async () => {
    try {
      if (!trelloActions?.updateCardApi) {
        logger("TrelloCardDetailModal").error("Store actions not available");
        return;
      }

      await trelloActions.updateCardApi(card.id, { dueComplete: !isCompleted });
      setIsCompleted(!isCompleted);
    } catch (error) {
      logger("TrelloCardDetailModal").error("Failed to toggle completion", error);
    }
  };

  const requestClose = () => {
    if (isEditingTitle || isEditingDesc) return;
    onClose();
  };

  return (
    <Dialog onOpenChange={(open) => !open && requestClose()} open={isOpen}>
      <DialogContent
        className="flex max-h-[90vh] w-full max-w-[900px] flex-col gap-0 overflow-hidden p-0 sm:max-w-[900px]"
        onEscapeKeyDown={(event) => {
          if (isEditingTitle || isEditingDesc) event.preventDefault();
        }}
        onPointerDownOutside={(event) => {
          if (isEditingTitle || isEditingDesc) event.preventDefault();
        }}
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">{card.name || "Card details"}</DialogTitle>
        <DialogDescription className="sr-only">
          View and edit card title, description, and activity.
        </DialogDescription>

        <CardDetailHeader
          card={card}
          editName={editName}
          handleCancelTitle={handleCancelTitle}
          handleSaveTitle={handleSaveTitle}
          handleToggleComplete={handleToggleComplete}
          isCompleted={isCompleted}
          isEditingTitle={isEditingTitle}
          isSaving={isSaving}
          requestClose={requestClose}
          setEditName={setEditName}
          setIsEditingTitle={setIsEditingTitle}
        />

        {/* Body */}
        <div className="flex min-h-0 flex-1 flex-col md:flex-row">
          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
            <FlexCol gap="lg">
              {card.labels && card.labels.length > 0 && (
                <section>
                  <SectionTitle icon="🏷️" title="Labels" />
                  <TrelloFlex gap="xs" wrap>
                    {card.labels.map((label) => (
                      <Label color={label.color || "#ddd"} key={label.id}>
                        {label.name || "Label"}
                      </Label>
                    ))}
                    <IconButton
                      aria-label="Add a label"
                      className="text-sm"
                      size="sm"
                      type="button"
                      variant="ghost"
                    >
                      ➕
                    </IconButton>
                  </TrelloFlex>
                </section>
              )}

              <CardDescriptionSection
                card={card}
                descInputRef={descInputRef}
                editDesc={editDesc}
                handleCancelDesc={handleCancelDesc}
                handleSaveDescription={handleSaveDescription}
                isEditingDesc={isEditingDesc}
                isSaving={isSaving}
                setEditDesc={setEditDesc}
                setIsEditingDesc={setIsEditingDesc}
              />

              <section>
                <Flex align="center" className="mb-1" justify="between">
                  <SectionTitle icon="💬" title="Comments and Activity" />
                  <Button
                    onClick={() => setShowActivity((value) => !value)}
                    size="sm"
                    type="button"
                    variant="ghost"
                  >
                    {showActivity ? "Hide details" : "Show details"}
                  </Button>
                </Flex>

                {showActivity && <TrelloCardComments card={card} />}
              </section>
            </FlexCol>
          </div>

          <Separator className="md:hidden" orientation="horizontal" />
          <Separator className="hidden md:block" orientation="vertical" />

          {/* Sidebar */}
          <aside className="bg-muted/30 shrink-0 px-4 py-5 md:w-56">
            <FlexCol gap="lg">
              <div>
                <Typography
                  className="mb-3 text-xs font-semibold tracking-wide uppercase"
                  color="muted"
                  variant="caption"
                >
                  Add to Card
                </Typography>
                <FlexCol gap="xs">
                  <SidebarAction>👥 Members</SidebarAction>
                  <SidebarAction>🏷️ Labels</SidebarAction>
                  <SidebarAction>☑️ Checklist</SidebarAction>
                  <SidebarAction>📅 Dates</SidebarAction>
                  <SidebarAction>📎 Attachment</SidebarAction>
                  <SidebarAction>🖼️ Cover</SidebarAction>
                </FlexCol>
              </div>

              <div>
                <Typography
                  className="mb-3 text-xs font-semibold tracking-wide uppercase"
                  color="muted"
                  variant="caption"
                >
                  Actions
                </Typography>
                <FlexCol gap="xs">
                  <SidebarAction>📋 Copy</SidebarAction>
                  <SidebarAction>📦 Archive</SidebarAction>
                  <SidebarAction
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={handleDelete}
                  >
                    🗑️ Delete
                  </SidebarAction>
                </FlexCol>
              </div>
            </FlexCol>
          </aside>
        </div>
      </DialogContent>
    </Dialog>
  );
};
