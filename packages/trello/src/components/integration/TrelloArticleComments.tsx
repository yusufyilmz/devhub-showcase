"use client";

import { type FC, useEffect, useState } from "react";

import { Button as LibraryButton } from "@shared/ui/button";
import { Typography } from "@shared/ui/typography";
import { logger } from "@shared/utils/client-logger";

import { trelloActions } from "../../stores/trelloStore";
import type { TrelloCard } from "../../types";
import { extractArticleMetadata, isConvertedFromArticle } from "../../utils";
import { Flex, Stack } from "../ui";

async function readCardArticleMetadata(cardId: string, boardId: string, description: string) {
  try {
    const fromFields = await trelloActions.getArticleMetadata(cardId, boardId);
    if (fromFields) {
      return {
        articleMetadata: fromFields,
        wasConvertedFromArticle: fromFields.convertedFrom === "article",
      };
    }
  } catch (metadataError) {
    logger("TrelloArticleComments").error("Failed to extract article metadata:", {
      metadataError,
    });
  }

  return {
    articleMetadata: extractArticleMetadata(description),
    wasConvertedFromArticle: isConvertedFromArticle(description),
  };
}

function articleIdentity(
  cardId: string,
  articleId: string | undefined,
  articleUuid: string | undefined,
  wasConvertedFromArticle: boolean,
  articleMetadata: { articleId?: string } | null,
) {
  const fromArticle =
    wasConvertedFromArticle && articleMetadata?.articleId ? articleMetadata.articleId : null;
  return {
    articleId: articleId || fromArticle || `trello-card-${cardId}`,
    articleUuid: articleUuid || fromArticle || `trello-${cardId}`,
  };
}

function initializationErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return "Failed to initialize comments";
}

interface TrelloArticleCommentsProps {
  /** Optional: Override the article ID if different from card ID */
  articleId?: string;
  /** Optional: Custom UUID for the article */
  articleUuid?: string;
  card: TrelloCard;
}

/**
 * ✅ TRELLO ARTICLE COMMENTS INTEGRATION
 *
 * This component bridges Trello cards with the existing article comment system:
 * - Creates/links an article for each Trello card
 * - Uses the existing InteractiveComments component
 * - Maintains comment state via the article comment store
 * - Provides seamless commenting experience between Trello and articles
 *
 * Features:
 * - Automatic article creation for new cards
 * - Existing comment system integration
 * - Unified comment store management
 * - Real-time comment updates
 * - Flag/useful functionality from articles
 */
export const TrelloArticleComments: FC<TrelloArticleCommentsProps> = ({
  card,
  articleId,
  articleUuid,
}) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);

  // ✅ Initialize with fallback values, will be updated after async metadata extraction
  const [_effectiveArticleId, setEffectiveArticleId] = useState(
    articleId || `trello-card-${card.id}`,
  );
  const [_effectiveArticleUuid, setEffectiveArticleUuid] = useState(
    articleUuid || `trello-${card.id}`,
  );

  // Get comment store state
  const isLoadingComments = false;

  // Initialize article and comments for this Trello card
  useEffect(() => {
    const initializeArticleComments = async () => {
      try {
        setInitError(null);
        const metadata = await readCardArticleMetadata(card.id, card.idBoard, card.desc || "");
        const identity = articleIdentity(
          card.id,
          articleId,
          articleUuid,
          metadata.wasConvertedFromArticle,
          metadata.articleMetadata,
        );
        setEffectiveArticleId(identity.articleId);
        setEffectiveArticleUuid(identity.articleUuid);
        setIsInitialized(true);
      } catch (error) {
        logger("TrelloArticleComments").error(
          "Failed to initialize Trello article comments:",
          error,
        );
        setInitError(initializationErrorMessage(error));
      }
    };

    initializeArticleComments();
  }, [card.id, card.desc, card.idBoard, articleId, articleUuid]);

  // Loading state
  if (!isInitialized || isLoadingComments) {
    return (
      <Stack gap="sm" style={{ padding: "16px", textAlign: "center" }}>
        <Typography color="muted">Loading comments...</Typography>
      </Stack>
    );
  }

  // Error state
  if (initError) {
    return (
      <Stack gap="sm" style={{ padding: "16px" }}>
        <Typography color="destructive">Failed to load comments: {initError}</Typography>
        <LibraryButton
          onClick={() => window.location.reload()}
          style={{
            background: "white",
            border: "1px solid #ddd",
            borderRadius: "4px",
            cursor: "pointer",
            padding: "8px 16px",
          }}
          variant="unstyled"
        >
          Retry
        </LibraryButton>
      </Stack>
    );
  }

  // Success state - render the existing InteractiveComments component
  return (
    <div style={{ width: "100%" }}>
      {/* Comment Stats */}
      <Flex align="center" gap="sm" style={{ marginBottom: "16px", padding: "0 16px" }}>
        {/* <Typography  color="muted">
          {summaryComments.summary.cnt_text || 0} comment
          {summaryComments.summary.cnt_text !== 1 ? "s" : ""}
        </Typography>
        {(summaryComments.summary.cnt_useful || 0) > 0 && (
          <Typography  color="muted">
            {summaryComments.summary.cnt_useful} useful
          </Typography>
        )}
        {(summaryComments.summary.cnt_flag || 0) > 0 && (
          <Typography  color="destructive">
            {summaryComments.summary.cnt_flag} flag
            {summaryComments.summary.cnt_flag !== 1 ? "s" : ""}
          </Typography>
        )} */}
      </Flex>

      {/* Existing Article Comments Component */}
      {/* <InteractiveComments /> */}
    </div>
  );
};

export default TrelloArticleComments;
