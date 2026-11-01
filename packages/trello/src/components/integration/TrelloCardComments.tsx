"use client";

import type React from "react";
import { type FC, useEffect, useState } from "react";

import { v4 as uuidv4 } from "uuid";

import { Button } from "@shared/ui/button";
import { Typography } from "@shared/ui/typography";
import { logger } from "@shared/utils/client-logger";

import { type CommentReply, commentsStore, useCommentStore } from "../../stores/commentStore";
import type { TrelloCard } from "../../types";
import { Flex, Stack, TextArea } from "../ui";

interface TrelloCardCommentsProps {
  card: TrelloCard;
}

interface TrelloCommentReplyProps {
  commentReply: CommentReply;
  onDelete: (commentReplyId: number | undefined) => void;
  onEdit: (commentReplyId: number | undefined) => void;
  onReply: (commentReplyId: number | undefined) => void;
  uuidOrId: string | number | null;
}

interface AddTrelloCommentReplyProps {
  onCancel?: () => void;
  placeholder?: string;
  replyingTo?: number;
  uuidOrId: string | number | null;
}

/**
 * ✅ ADD commentReply COMPONENT FOR TRELLO CARDS
 * Simplified version of AddCommentReply with Trello UI styling
 */
const AddTrelloCommentReply: FC<AddTrelloCommentReplyProps> = ({
  uuidOrId: _uuidOrId,
  replyingTo,
  onCancel,
  placeholder = "Write a commentReply...",
}) => {
  const [commentReplyText, setCommentReplyText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const comments = useCommentStore((state) => state.comments);
  const handleSubmit = async () => {
    if (!commentReplyText.trim()) return;

    setIsSubmitting(true);
    try {
      commentsStore.setState((state) => ({
        ...state,
        comments: [
          ...state.comments,
          {
            created: new Date(),
            id: uuidv4(),
            text: commentReplyText.trim(),
            updated: new Date(),
            useful: false,
            user: {
              id: "1",
              name: "John Doe",
            },
          },
        ],
      }));
      setCommentReplyText("");
      onCancel?.();
    } catch (error) {
      logger("AddTrelloCommentReply").error("Failed to add comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      handleSubmit();
    }
  };

  return (
    <div style={{ width: "100%" }}>
      <Stack gap="sm" style={{ width: "100%" }}>
        <Flex align="start" gap="sm" style={{ width: "100%" }}>
          <div
            style={{
              alignItems: "center",
              backgroundColor: "#ddd",
              borderRadius: "50%",
              color: "#666",
              display: "flex",
              flexShrink: 0,
              fontSize: "14px",
              fontWeight: "600",
              height: "32px",
              justifyContent: "center",
              width: "32px",
            }}
          >
            {comments?.[0]?.user.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div style={{ flex: 1, minWidth: 0, width: "100%" }}>
            <TextArea
              onChange={(e) => setCommentReplyText(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={placeholder}
              rows={3}
              style={{
                border: "2px solid #ddd",
                borderRadius: "8px",
                boxSizing: "border-box",
                fontSize: "14px",
                minHeight: "80px",
                padding: "8px 12px",
                resize: "vertical",
                width: "100%",
              }}
              value={commentReplyText}
            />
          </div>
        </Flex>

        {commentReplyText.trim() && (
          <Flex gap="sm" justify="end" style={{ width: "100%" }}>
            {onCancel && (
              <Button onClick={onCancel} size="sm" variant="secondary">
                Cancel
              </Button>
            )}
            <Button
              disabled={isSubmitting || !commentReplyText.trim()}
              onClick={handleSubmit}
              size="sm"
              variant="default"
            >
              {isSubmitting ? "Saving..." : replyingTo ? "Reply" : "Save"}
            </Button>
          </Flex>
        )}
      </Stack>
    </div>
  );
};

function formatRelativeTime(dateStr: string | Date) {
  const date = typeof dateStr === "string" ? new Date(dateStr) : dateStr;
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

function CommentReplyEditor({
  editText,
  isUpdating,
  onCancel,
  onChange,
  onSave,
}: {
  editText: string;
  isUpdating: boolean;
  onCancel: () => void;
  onChange: (value: string) => void;
  onSave: () => void;
}) {
  return (
    <Stack gap="sm" style={{ width: "100%" }}>
      <TextArea
        onChange={(event) => onChange(event.target.value)}
        rows={3}
        style={{
          border: "2px solid #ddd",
          borderRadius: "8px",
          boxSizing: "border-box",
          fontSize: "14px",
          padding: "8px 12px",
          width: "100%",
        }}
        value={editText}
      />
      <Flex gap="sm">
        <Button
          disabled={isUpdating || !editText.trim()}
          onClick={onSave}
          size="sm"
          variant="default"
        >
          {isUpdating ? "Saving..." : "Save"}
        </Button>
        <Button onClick={onCancel} size="sm" variant="secondary">
          Cancel
        </Button>
      </Flex>
    </Stack>
  );
}

const TrelloCommentReply: FC<TrelloCommentReplyProps> = ({
  commentReply,
  uuidOrId,
  onReply,
  onEdit,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(commentReply.text);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);

  const handleUpdate = async () => {
    if (!editText.trim()) return;

    setIsUpdating(true);
    try {
      await commentsStore.setState((state) => ({
        ...state,
        comments: state.comments.map((comment) =>
          comment.id === commentReply.id ? { ...comment, text: editText.trim() } : comment,
        ),
      }));
      setIsEditing(false);
    } catch {
      // Handle error silently or show user feedback
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUseful = async () => {
    try {
      if (commentReply.useful) {
        await commentsStore.setState((state) => ({
          ...state,
          comments: state.comments.map((comment) =>
            comment.id === commentReply.id ? { ...comment, useful: false } : comment,
          ),
        }));
      } else {
        await commentsStore.setState((state) => ({
          ...state,
          comments: state.comments.map((comment) =>
            comment.id === commentReply.id ? { ...comment, useful: true } : comment,
          ),
        }));
      }
    } catch {
      // Handle error silently or show user feedback
    }
  };

  return (
    <div style={{ width: "100%" }}>
      <Stack gap="sm" style={{ width: "100%" }}>
        <Flex align="start" gap="sm" style={{ width: "100%" }}>
          <div
            style={{
              alignItems: "center",
              backgroundColor: "#ddd",
              borderRadius: "50%",
              color: "#666",
              display: "flex",
              flexShrink: 0,
              fontSize: "14px",
              fontWeight: "600",
              height: "32px",
              justifyContent: "center",
              width: "32px",
            }}
          >
            {commentReply.user.name?.charAt(0)?.toUpperCase() || "U"}
          </div>

          <div style={{ flex: 1, minWidth: 0, width: "100%" }}>
            <Flex align="center" gap="sm" style={{ marginBottom: "4px", width: "100%" }}>
              <Typography style={{ fontWeight: "600" }}>
                {commentReply.user.name || "Unknown User"}
              </Typography>
              <Typography color="muted">{formatRelativeTime(commentReply.created)}</Typography>
            </Flex>

            {isEditing ? (
              <CommentReplyEditor
                editText={editText}
                isUpdating={isUpdating}
                onCancel={() => {
                  setIsEditing(false);
                  setEditText(commentReply.text);
                }}
                onChange={setEditText}
                onSave={handleUpdate}
              />
            ) : (
              <>
                <Typography
                  style={{
                    lineHeight: "1.4",
                    marginBottom: "8px",
                    overflowWrap: "break-word",
                    width: "100%",
                    wordWrap: "break-word",
                  }}
                >
                  {commentReply.text}
                </Typography>

                <Flex align="center" gap="sm" style={{ flexWrap: "wrap", width: "100%" }}>
                  {!isMycommentReply && (
                    <Button
                      onClick={handleUseful}
                      size="sm"
                      style={{
                        color: commentReply.useful ? "primary" : "muted.foreground",
                        fontWeight: commentReply.useful ? "600" : "400",
                      }}
                      variant="default"
                    >
                      👍 {commentReply.useful ? 1 : 0}
                    </Button>
                  )}

                  <Button
                    onClick={() => setShowReplyForm(!showReplyForm)}
                    size="sm"
                    style={{ color: "muted" }}
                    variant="secondary"
                  >
                    Reply
                  </Button>

                  {isMycommentReply && (
                    <>
                      <Button
                        onClick={() => setIsEditing(true)}
                        size="sm"
                        style={{ color: "muted" }}
                        variant="secondary"
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => onDelete(Number(commentReply.id) || 0)}
                        size="sm"
                        style={{ color: "destructive" }}
                        variant="secondary"
                      >
                        Delete
                      </Button>
                    </>
                  )}
                </Flex>
              </>
            )}
          </div>
        </Flex>

        {showReplyForm && (
          <div style={{ marginLeft: "44px", width: "calc(100% - 44px)" }}>
            <AddTrelloCommentReply
              onCancel={() => setShowReplyForm(false)}
              placeholder={`Reply to ${commentReply.user.name || "Unknown User"}...`}
              replyingTo={Number(commentReply.user.id) || undefined}
              uuidOrId={uuidOrId}
            />
          </div>
        )}

        {/* Show replies if any */}
        {commentReply.replies && commentReply.replies?.length > 0 && (
          <div style={{ marginLeft: "44px", width: "calc(100% - 44px)" }}>
            <Stack gap="md">
              {commentReply.replies?.map((reply) => (
                <TrelloCommentReply
                  commentReply={reply}
                  key={reply.id}
                  onDelete={onDelete}
                  onEdit={onEdit}
                  onReply={onReply}
                  uuidOrId={uuidOrId}
                />
              ))}
            </Stack>
          </div>
        )}
      </Stack>
    </div>
  );
};

export const TrelloCardComments: FC<TrelloCardCommentsProps> = ({ card }) => {
  const [show] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [commentsArr] = useState<CommentReply[]>([]);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [effectiveArticleId, setEffectiveArticleId] = useState<string>("");

  useEffect(() => {
    const initializeCardComments = async () => {
      if (isInitialized) return;
      const finalArticleId = `trello-card-${card.id}`;
      const finalArticleUuid = `trello-${card.id}`;
      setEffectiveArticleId(finalArticleId);

      const commentData = {
        created: new Date(),
        id: finalArticleId,
        text: card.desc || "No description provided",
        updated: new Date(),
        useful: false,
        user: {
          id: "1",
          name: "John Doe",
        },
        uuid_persistent: finalArticleUuid,
      };

      await commentsStore.setState((state) => ({
        ...state,
        comments: [...state.comments, commentData],
      }));

      setIsInitialized(true);
      setLoading(false);
    };

    initializeCardComments();
  }, [card.id, card.desc, isInitialized]);

  useEffect(() => {
    logger("TrelloCardComments").info("📝 comments effect triggered:", {
      isInitialized,
    });
  }, [isInitialized]);

  const totalComments = commentsStore.getState().comments.length || 0;

  if (!isInitialized || loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ width: "100%" }}>
      <Stack gap="md" style={{ width: "100%" }}>
        <Flex align="center" gap="sm" style={{ width: "100%" }}>
          <Typography style={{ fontWeight: "600" }}>💬 Activity</Typography>
          {totalComments > 0 && (
            <Typography color="muted">
              ({totalComments} {totalComments === 1 ? "comment" : "comments"})
            </Typography>
          )}
        </Flex>

        {show && isInitialized && (
          <div style={{ width: "100%" }}>
            <AddTrelloCommentReply uuidOrId={effectiveArticleId} />
          </div>
        )}

        {commentsArr.length > 0 ? (
          <Stack gap="lg" style={{ width: "100%" }}>
            {commentsArr.map((commentReply) => (
              <div key={commentReply.id} style={{ width: "100%" }}>
                <TrelloCommentReply
                  commentReply={commentReply}
                  onDelete={(commentReplyId) => {}}
                  onEdit={(commentReplyId) => {}}
                  onReply={(commentReplyId) => {}}
                  uuidOrId={effectiveArticleId}
                />
              </div>
            ))}
          </Stack>
        ) : (
          <div style={{ padding: "20px 0", textAlign: "center", width: "100%" }}>
            <Typography color="muted" style={{ fontStyle: "italic" }}>
              No comments yet. Be the first to comment!
            </Typography>
          </div>
        )}
      </Stack>
    </div>
  );
};
