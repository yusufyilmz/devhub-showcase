# Trello Custom Fields Implementation

This document explains how we've implemented Trello custom fields for article metadata storage, replacing the previous description-based approach with a cleaner, more structured solution.

## 🎯 **Overview**

Based on the [Trello Cards API documentation](https://developer.atlassian.com/cloud/trello/rest/api-group-cards/#api-cards-idcard-customfield-idcustomfield-item-put), we've implemented a comprehensive custom fields system that:

- **Stores article metadata** as structured custom fields instead of embedded HTML comments
- **Maintains backwards compatibility** with existing description-based metadata
- **Provides hybrid extraction** that tries custom fields first, then falls back to description parsing
- **Follows Trello API best practices** for custom field management

## 🔧 **Technical Architecture**

### **Custom Field Types**

```typescript
export interface TrelloCustomField {
  display: { cardFront: boolean };
  id: string;
  idModel: string; // Board ID
  modelType: "board";
  name: string;
  pos: number;
  type: "text" | "number" | "date" | "checkbox" | "list";
}

export interface TrelloCustomFieldItem {
  id: string;
  idCustomField: string;
  idModel: string; // Card ID
  modelType: "card";
  value?: {
    text?: string;
    number?: string;
    date?: string;
    checked?: string;
  };
}

export interface ArticleCustomFields {
  articleId?: string;
  articleLink?: string;
  articleTitle?: string;
  convertedDate?: string;
  convertedFrom?: "article" | "trello";
}
```

### **Article Integration Fields**

```typescript
export const ARTICLE_CUSTOM_FIELDS = {
  ARTICLE_ID: "Article ID",
  ARTICLE_LINK: "Article Link",
  ARTICLE_TITLE: "Article Title",
  CONVERTED_DATE: "Converted Date",
  CONVERTED_FROM: "Converted From",
} as const;
```

## 🚀 **Implementation Components**

### **1. TrelloCustomFieldsService**

Comprehensive service for managing custom fields using the [Trello API endpoints](https://developer.atlassian.com/cloud/trello/rest/api-group-cards/#api-cards-idcard-customfield-idcustomfield-item-put):

```typescript
export class TrelloCustomFieldsService {
  // Board-level custom field management
  async getBoardCustomFields(boardId: string): Promise<TrelloCustomField[]>
  async createCustomField(boardId: string, fieldData: {...}): Promise<TrelloCustomField>
  async setupArticleCustomFields(boardId: string): Promise<Record<string, TrelloCustomField>>

  // Card-level custom field values
  async setCustomFieldValue(cardId: string, customFieldId: string, value: string | number | boolean): Promise<void>
  async setMultipleCustomFieldValues(cardId: string, fieldValues: Array<{...}>): Promise<void>
  async getCardCustomFields(cardId: string): Promise<TrelloCustomFieldItem[]>

  // Article-specific operations
  async setArticleMetadata(cardId: string, boardId: string, articleData: ArticleCustomFields): Promise<void>
  async extractArticleMetadata(cardId: string, boardId: string): Promise<ArticleCustomFields | null>
  async isConvertedFromArticle(cardId: string, boardId: string): Promise<boolean>
}
```

### **2. Enhanced Article Metadata Utilities**

Hybrid approach supporting both custom fields and description parsing:

```typescript
// ✅ MODERN: Custom fields approach (preferred)
export async function extractArticleMetadataFromCustomFields(
  customFieldsService: TrelloCustomFieldsService,
  cardId: string,
  boardId: string,
): Promise<ArticleMetadata | null>;

// ✅ HYBRID: Tries custom fields first, then description fallback
export async function extractArticleMetadataHybrid(
  customFieldsService: TrelloCustomFieldsService,
  cardId: string,
  boardId: string,
  cardDescription?: string,
): Promise<ArticleMetadata | null>;

// ✅ LEGACY: Description parsing (backwards compatibility)
// @deprecated Use extractArticleMetadataFromCustomFields instead
export function extractArticleMetadata(cardDescription: string): ArticleMetadata | null;
```

## 🔄 **Migration Strategy**

### **Before (Description-based)**

```markdown
<!-- ARTICLE_METADATA
ARTICLE_ID: 12345678-90ab-cdef-1234-567890abcdef
ARTICLE_LINK: my-article-slug
ARTICLE_TITLE: My Article Title
CONVERTED_FROM: article
CONVERTED_DATE: 2024-01-15T10:30:00.000Z
-->

🔗 Converted from Article: My Article Title
📄 Original Article: [my-article-slug](http://localhost:5005/article/my-article-slug)
...
```

### **After (Custom Fields)**

**Clean Description:**

```markdown
🔗 Converted from Article: My Article Title
📄 Original Article: [my-article-slug](http://localhost:5005/article/my-article-slug)
📝 Summary: Article summary here
...
```

**Structured Custom Fields:**

- **Article ID:** `12345678-90ab-cdef-1234-567890abcdef`
- **Article Link:** `my-article-slug`
- **Article Title:** `My Article Title`
- **Converted From:** `article`
- **Converted Date:** `2024-01-15T10:30:00.000Z`

## 📊 **API Integration**

### **Card Creation with Custom Fields**

```typescript
// 1. Create card with clean description
const newCard = await trelloActions.createCard(listId, {
  desc: cleanDescription, // No embedded metadata!
  name: cardTitle,
  pos: "top",
});

// 2. Set article metadata as custom fields
const customFieldsService = new TrelloCustomFieldsService(apiService);
await customFieldsService.setArticleMetadata(newCard.id, boardId, {
  articleId: article.uuid_persistent,
  articleLink: article.link || "",
  articleTitle: article.title || "Untitled",
  convertedDate: new Date().toISOString(),
  convertedFrom: "article",
});
```

### **Metadata Extraction (Hybrid)**

```typescript
// Try custom fields first, fallback to description parsing
const customFieldsService = new TrelloCustomFieldsService(apiService);
const metadata = await extractArticleMetadataHybrid(
  customFieldsService,
  card.id,
  card.idBoard,
  card.desc,
);
```

## 🎨 **User Experience Improvements**

### **✅ Cleaner Card Descriptions**

- **Before:** HTML comments clutter the description
- **After:** Clean, readable description with no hidden metadata

### **✅ Professional Data Storage**

- **Before:** Parsing HTML comments from text
- **After:** Structured custom field data via API

### **✅ Trello UI Integration**

- **Before:** Metadata invisible in Trello UI
- **After:** Custom fields can be displayed in Trello interface

### **✅ API-Friendly**

- **Before:** String parsing required to extract metadata
- **After:** Direct API access to structured data

## 🔧 **Implementation Details**

### **Custom Field Setup Process**

1. **Board Detection:** Service checks existing custom fields on board
2. **Field Creation:** Creates missing article integration fields automatically
3. **Field Mapping:** Maps field names to IDs for efficient access
4. **Value Setting:** Uses Trello API to set field values on cards

### **API Endpoints Used**

Based on [Trello API documentation](https://developer.atlassian.com/cloud/trello/rest/api-group-cards/#api-cards-idcard-customfield-idcustomfield-item-put):

- `GET /boards/{id}/customFields` - Get board custom fields
- `POST /boards/{id}/customFields` - Create custom field
- `PUT /cards/{idCard}/customField/{idCustomField}/item` - Set single field value
- `PUT /cards/{idCard}/customFields` - Set multiple field values
- `GET /cards/{id}/customFieldItems` - Get card custom field values

### **Error Handling**

```typescript
try {
  await customFieldsService.setArticleMetadata(cardId, boardId, articleData);
  showInfo("Article metadata set as custom fields");
} catch (customFieldError) {
  console.error("Failed to set custom fields:", customFieldError);
  showError("Card created but failed to set article metadata");
  // Card creation still succeeds, only metadata setting fails
}
```

## 🧪 **Testing Scenarios**

### **New Cards (Custom Fields)**

1. **Create card** from article → Custom fields set
2. **Open card modal** → Metadata extracted from custom fields
3. **Comments work** with original article ID

### **Legacy Cards (Description-based)**

1. **Open existing card** with description metadata → Fallback parsing works
2. **Comments work** with extracted article ID
3. **Backwards compatibility** maintained

### **Hybrid Scenarios**

1. **Mixed board** with both old and new cards → Both approaches work
2. **Migration** from description to custom fields → Seamless transition
3. **API failures** → Graceful fallback to description parsing

## 📈 **Benefits Achieved**

### **🔧 Technical Benefits**

- **Structured data storage** via Trello API
- **Cleaner code** with dedicated service class
- **Better error handling** with granular failures
- **API-first approach** following Trello best practices

### **🎨 UX Benefits**

- **Cleaner card descriptions** without metadata clutter
- **Professional appearance** in Trello interface
- **Potential UI integration** with custom field displays
- **Better readability** of card content

### **🚀 Performance Benefits**

- **Direct API access** instead of string parsing
- **Efficient queries** for metadata extraction
- **Reduced description size** without embedded metadata
- **Better caching** of structured field data

### **🔄 Maintenance Benefits**

- **Centralized service** for custom field management
- **Type safety** with TypeScript interfaces
- **Backwards compatibility** reduces migration risk
- **Future extensibility** for additional metadata

## 🔮 **Future Enhancements**

### **Trello UI Integration**

```typescript
// Configure fields to display on card front
await createCustomField(boardId, {
  display: { cardFront: true }, // Show in Trello UI
  name: "Article Title",
  type: "text",
});
```

### **Advanced Metadata**

```typescript
// Additional custom fields for enhanced integration
const EXTENDED_FIELDS = {
  ARTICLE_AUTHOR: "Article Author",
  ARTICLE_TAGS: "Article Tags",
  LAST_UPDATED: "Last Updated",
  SYNC_STATUS: "Sync Status",
};
```

### **Bulk Operations**

```typescript
// Migrate existing cards from description to custom fields
await migrationService.migrateDescriptionToCustomFields(boardId);
```

## 📚 **Related Resources**

- [Trello Cards API - Custom Fields](https://developer.atlassian.com/cloud/trello/rest/api-group-cards/#api-cards-idcard-customfield-idcustomfield-item-put)
- [Article-Trello Linking Guide](./linking.md)
- [TrelloCustomFieldsService Source](../services/TrelloCustomFields.ts)
- [Article Metadata Utilities](../utils/articleMetadata.ts)

---

**🎉 Result:** Article metadata is now stored as structured Trello custom fields with backwards compatibility, providing a professional, API-first approach that follows Trello best practices while maintaining full functionality for existing cards!
