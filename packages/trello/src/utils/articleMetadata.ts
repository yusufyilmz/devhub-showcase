/**
 * ✅ ARTICLE METADATA UTILITIES
 *
 * Utilities for handling article metadata in Trello cards.
 * Simple approach: store metadata in card descriptions and parse from there.
 */

export interface CardMetadata {
  articleId: string;
  articleLink?: string;
  articleName: string;
  convertedDate: string;
  convertedFrom: "article" | "trello";
}

// For backwards compatibility
export type ArticleMetadata = CardMetadata;

/**
 * ✅ Extract card metadata from Trello card description
 */
export function extractCardMetadata(cardDescription: string): CardMetadata | null {
  if (!cardDescription) return null;

  // Look for the metadata comment block
  const metadataMatch = cardDescription.match(/<!-- ARTICLE_METADATA\n([\s\S]*?)\n-->/);

  if (!metadataMatch) return null;

  const metadataBlock = metadataMatch[1];
  const metadata: Partial<CardMetadata> = {};

  // Parse each metadata line
  const lines = metadataBlock?.split("\n") || [];
  for (const line of lines) {
    const [key, ...valueParts] = line.split(": ");
    const value = valueParts.join(": ").trim();

    switch (key?.trim()) {
      case "ARTICLE_ID":
        metadata.articleId = value;
        break;
      case "ARTICLE_NAME":
        metadata.articleName = value;
        break;
      case "ARTICLE_LINK":
        metadata.articleLink = value === "no-link" ? "" : value;
        break;
      case "CONVERTED_FROM":
        metadata.convertedFrom = value as "article" | "trello";
        break;
      case "CONVERTED_DATE":
        metadata.convertedDate = value;
        break;
    }
  }

  // Validate required fields
  if (!metadata.articleId || !metadata.articleName || !metadata.convertedFrom) {
    return null;
  }

  return metadata as CardMetadata;
}

// For backwards compatibility
export const extractArticleMetadata = extractCardMetadata;

/**
 * ✅ Check if a Trello card was converted from an article
 */
export function isConvertedFromArticle(cardDescription: string): boolean {
  const metadata = extractCardMetadata(cardDescription);
  return metadata?.convertedFrom === "article";
}

/**
 * Get article ID from Trello card description for comment linking
 */
export function getArticleIdFromCard(cardDescription: string): string | null {
  const metadata = extractCardMetadata(cardDescription);
  return metadata?.articleId || null;
}

/**
 * Get article name from Trello card description
 */
export function getArticleNameFromCard(cardDescription: string): string | null {
  const metadata = extractCardMetadata(cardDescription);
  return metadata?.articleName || null;
}

/**
 * Get article link from Trello card description
 */
export function getArticleLinkFromCard(cardDescription: string): string | null {
  const metadata = extractCardMetadata(cardDescription);
  return metadata?.articleLink || null;
}

/**
 * Create card metadata comment block for embedding in card descriptions
 */
export function createCardMetadataBlock(metadata: CardMetadata): string {
  return [
    "<!-- ARTICLE_METADATA",
    `ARTICLE_ID: ${metadata.articleId}`,
    `ARTICLE_NAME: ${metadata.articleName}`,
    `ARTICLE_LINK: ${metadata.articleLink || "no-link"}`,
    `CONVERTED_FROM: ${metadata.convertedFrom}`,
    `CONVERTED_DATE: ${metadata.convertedDate}`,
    "-->",
  ].join("\n");
}

// For backwards compatibility
export const createArticleMetadataBlock = createCardMetadataBlock;

/**
 * Remove card metadata from card description (for display purposes)
 */
export function removeCardMetadata(cardDescription: string): string {
  return cardDescription.replace(/<!-- ARTICLE_METADATA\n[\s\S]*?\n-->\n\n?/, "");
}

// For backwards compatibility
export const removeArticleMetadata = removeCardMetadata;

/**
 * Update card metadata in existing card description
 */
export function updateCardMetadata(
  cardDescription: string,
  newMetadata: Partial<CardMetadata>,
): string {
  const existingMetadata = extractCardMetadata(cardDescription);

  if (!existingMetadata) {
    // No existing metadata, can't update
    return cardDescription;
  }

  const updatedMetadata = { ...existingMetadata, ...newMetadata };
  const cleanDescription = removeCardMetadata(cardDescription);
  const newMetadataBlock = createCardMetadataBlock(updatedMetadata);

  return `${newMetadataBlock}\n\n${cleanDescription}`;
}

// For backwards compatibility
export const updateArticleMetadata = updateCardMetadata;

/**
 * ✅ Helper function to create card metadata when creating cards from articles
 */
export function createCardMetadataFromArticle({
  articleId,
  articleName,
  articleLink,
}: {
  articleId: string;
  articleName: string;
  articleLink?: string;
}): CardMetadata {
  return {
    articleId,
    articleLink,
    articleName,
    convertedDate: new Date().toISOString(),
    convertedFrom: "article",
  };
}

/**
 * ✅ Helper function to add card metadata to a card description
 */
export function addCardMetadataToDescription(description: string, metadata: CardMetadata): string {
  const metadataBlock = createCardMetadataBlock(metadata);
  return description ? `${metadataBlock}\n\n${description}` : metadataBlock;
}

// ===============================================
// ✅ EXAMPLE USAGE:
// ===============================================
//
// // 1. When creating a card from an article:
// const cardMetadata = createCardMetadataFromArticle({
//   articleId: '12345678-90ab-cdef-1234-567890abcdef',
//   articleName: 'User Authentication Issues',
//   articleLink: 'user-auth-issues'
// })
//
// const cardDescription = addCardMetadataToDescription(
//   'Original card description here...',
//   cardMetadata
// )
//
// // 2. When reading a card to extract article info for comment linking:
// const isFromArticle = isConvertedFromArticle(cardDescription)
// const articleId = getArticleIdFromCard(cardDescription)        // For comment linking!
// const articleName = getArticleNameFromCard(cardDescription)
// const articleLink = getArticleLinkFromCard(cardDescription)
//
// // 3. The metadata will look like this in the card description:
// //
// // <!-- ARTICLE_METADATA
// // ARTICLE_ID: 12345678-90ab-cdef-1234-567890abcdef
// // ARTICLE_NAME: User Authentication Issues
// // ARTICLE_LINK: user-auth-issues
// // CONVERTED_FROM: article
// // CONVERTED_DATE: 2025-09-11T15:30:00.000Z
// // -->
// //
// // Original card description here...
