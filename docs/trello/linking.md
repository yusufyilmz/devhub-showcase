# Article-Trello Bidirectional Linking

This document explains how articles and Trello cards are bidirectionally linked to provide seamless integration and unified commenting.

## 🎯 **Overview**

The system creates seamless connections between articles and Trello cards, allowing users to:

- **Convert articles to Trello tasks** with preserved metadata
- **Link comments** between articles and their corresponding Trello cards
- **Navigate easily** between articles and tasks
- **Maintain unified comment threads** across both platforms

## 🔗 **Linking Architecture**

### **1. Article Metadata Embedding**

When converting an article to a Trello card, metadata is embedded in the card description:

```html
<!-- ARTICLE_METADATA
ARTICLE_ID: 12345678-90ab-cdef-1234-567890abcdef
ARTICLE_LINK: my-article-slug
ARTICLE_TITLE: My Article Title
CONVERTED_FROM: article
CONVERTED_DATE: 2024-01-15T10:30:00.000Z
-->
```

### **2. Comment System Integration**

- **Converted cards** use the original article ID for comments
- **New cards** create new article entries for commenting
- **Unified experience** across both platforms

### **3. Visual Indicators**

- **Article link display** in card detail modal
- **Conversion indicators** showing article origin
- **Navigation buttons** to view original articles

## 🚀 **Usage Examples**

### **Converting Article to Trello Card**

```tsx
import { ArticleToTrelloButton } from "../integration/ArticleToTrelloButton";

// In ArticleContent component
<ArticleToTrelloButton article={currentArticle} size="medium" variant="button" />;
```

**Result:**

- Creates Trello card with article content
- Embeds article metadata in description
- Links comment systems bidirectionally

### **Viewing Article Link in Trello Card**

```tsx
import { ArticleLinkDisplay } from "../integration/ArticleLinkDisplay";

// In TrelloCardDetailModal
<ArticleLinkDisplay card={card} />;
```

**Result:**

- Shows article link if card was converted from article
- Provides "View Article" button
- Displays article title and conversion info

### **Unified Comments**

```tsx
import { TrelloArticleComments } from "../integration/TrelloArticleComments";

// Automatically detects article linking
<TrelloArticleComments
  card={card}
  // Uses original article ID if available
/>;
```

**Result:**

- Uses original article ID for converted cards
- Creates new article for non-converted cards
- Maintains comment continuity

## 🔧 **Technical Implementation**

### **Article Metadata Structure**

```typescript
interface ArticleMetadata {
  articleId: string; // Original article UUID
  articleLink: string; // Article slug for URL
  articleTitle: string; // Display title
  convertedDate: string; // ISO timestamp
  convertedFrom: "article" | "trello";
}
```

### **Metadata Extraction**

```typescript
import { extractArticleMetadata } from "../utils/articleMetadata";

const metadata = extractArticleMetadata(card.desc);
if (metadata) {
  console.log("Original article:", metadata.articleTitle);
  console.log("Article ID:", metadata.articleId);
  console.log("Article link:", metadata.articleLink);
}
```

### **Comment ID Resolution**

```typescript
// TrelloArticleComments automatically handles this
const effectiveArticleId =
  articleId ||
  (wasConvertedFromArticle && articleMetadata?.articleId
    ? articleMetadata.articleId
    : `trello-card-${card.id}`);
```

## 📊 **Features**

### **✅ Article to Trello Conversion**

- **Rich metadata embedding** - All article info preserved
- **Content mapping** - Article content becomes card description
- **Link preservation** - Original article links maintained
- **Visual formatting** - Markdown content with proper formatting

### **✅ Bidirectional Navigation**

- **Article link display** - Easy navigation back to article
- **Visual indicators** - Clear conversion status
- **One-click access** - Direct article viewing from cards

### **✅ Unified Comment System**

- **Shared comment threads** - Same comments across platforms
- **Automatic detection** - Smart article ID resolution
- **Seamless experience** - No user intervention required

### **✅ Metadata Management**

- **Extraction utilities** - Easy metadata parsing
- **Update functions** - Modify metadata as needed
- **Validation** - Ensure data integrity

## 🎨 **UI Components**

### **ArticleToTrelloButton**

```tsx
// Button variant
<ArticleToTrelloButton
  article={article}
  size="medium"
  variant="button"
/>

// Icon variant
<ArticleToTrelloButton
  article={article}
  variant="icon"
  size="small"
/>
```

### **ArticleLinkDisplay**

```tsx
<ArticleLinkDisplay card={card} className="custom-styling" style={{ margin: "16px 0" }} />;
```

### **TrelloArticleComments**

```tsx
// Automatic linking
<TrelloArticleComments card={card} />

// Manual override
<TrelloArticleComments
  card={card}
  articleId="custom-article-id"
  articleUuid="custom-uuid"
/>
```

## 🔄 **Data Flow**

### **Article → Trello Conversion**

1. **User clicks** "Convert to Trello Task"
2. **Dialog opens** with article preview
3. **User selects** board and list
4. **Card created** with embedded metadata
5. **Success notification** with card link

### **Trello → Article Comment Linking**

1. **Card opened** in detail modal
2. **Metadata extracted** from description
3. **Article ID resolved** (existing or new)
4. **Comment system initialized** with correct ID
5. **Unified comments displayed**

### **Navigation Flow**

1. **User views** Trello card detail
2. **Article link displayed** (if converted)
3. **User clicks** "View Article"
4. **Article opens** in new tab
5. **Same comments** visible in both places

## 🧪 **Testing Scenarios**

### **Conversion Testing**

```typescript
describe("Article to Trello Conversion", () => {
  it("should embed article metadata in card description", () => {
    // Test metadata embedding
  });

  it("should preserve article links and content", () => {
    // Test content preservation
  });

  it("should create proper article URLs", () => {
    // Test URL generation
  });
});
```

### **Linking Testing**

```typescript
describe("Article-Trello Linking", () => {
  it("should detect converted cards", () => {
    // Test conversion detection
  });

  it("should use original article IDs for comments", () => {
    // Test comment ID resolution
  });

  it("should display article links correctly", () => {
    // Test link display
  });
});
```

## 📈 **Benefits**

### **🔄 Seamless Integration**

- **Unified workflow** - Move between articles and tasks effortlessly
- **Context preservation** - All article context available in Trello
- **Bidirectional sync** - Changes reflected across platforms

### **💬 Unified Comments**

- **Single comment thread** - No duplicate conversations
- **Cross-platform visibility** - Comments visible everywhere
- **Consistent experience** - Same UI and features

### **🚀 Enhanced Productivity**

- **Quick conversion** - Turn articles into actionable tasks
- **Easy navigation** - Jump between content and tasks
- **Rich context** - Full article content in task descriptions

### **🔧 Developer Benefits**

- **Reusable utilities** - Metadata functions for other features
- **Clean architecture** - Separation of concerns
- **Extensible design** - Easy to add new linking features

## 🔮 **Future Enhancements**

### **Advanced Linking**

- **Multiple article links** - Cards referencing multiple articles
- **Article collections** - Group related articles and tasks
- **Smart suggestions** - Recommend related content

### **Enhanced Metadata**

- **Custom fields** - Additional metadata storage
- **Version tracking** - Track article changes in tasks
- **Sync status** - Show synchronization state

### **Workflow Integration**

- **Automatic conversion** - Rules-based article-to-task creation
- **Status sync** - Article status reflects task progress
- **Notification integration** - Cross-platform notifications

## 📚 **Related Documentation**

- [Article Comment Integration](./comments.md)
- [Trello Store Documentation](../stores/trelloStore.ts)
- [Article Store Documentation](@/article/store/articleStore.ts)
- [Utility Functions](../utils/articleMetadata.ts)

---

**🎉 Result:** Articles and Trello cards are now seamlessly linked with bidirectional navigation, unified comments, and preserved context across both platforms!
