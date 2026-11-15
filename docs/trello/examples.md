# Article to Trello Integration - Usage Examples

## 🎯 Overview

The `ArticleToTrelloButton` component enables seamless conversion of articles to Trello cards with intelligent content mapping, board/list selection, and comprehensive error handling.

## 📋 Basic Usage

### **In Article Content Component**

```tsx
import { articleSelectors, useArticleStore } from "@/shared/article/store/articleStore";
// src/modules/article/components/ArticleContent.tsx
import { ArticleToTrelloButton } from "@/shared/trello/v2/components/integration";

export const ArticleContent = () => {
  const currentArticle = useArticleStore(articleSelectors.currentArticle);

  return (
    <div className="article-content">
      <h1>{currentArticle.title}</h1>

      {/* ✅ Conversion button in top-right corner */}
      <div className="article-actions">
        <ArticleToTrelloButton article={currentArticle} size="small" variant="button" />
      </div>

      <div className="article-body">{/* Article content */}</div>
    </div>
  );
};
```

### **In Article Sidebar/Actions**

```tsx
// src/modules/article/components/ArticleSidebar.tsx
import { ArticleToTrelloButton } from "@/shared/trello/v2/components/integration";

export const ArticleSidebar = () => {
  const currentArticle = useArticleStore(articleSelectors.currentArticle);

  return (
    <aside className="article-sidebar">
      <h3>Actions</h3>
      <div className="action-buttons">
        {/* ✅ Icon variant for compact sidebar */}
        <ArticleToTrelloButton
          article={currentArticle}
          className="sidebar-action"
          size="medium"
          variant="icon"
        />

        <button>Share Article</button>
        <button>Print Article</button>
      </div>
    </aside>
  );
};
```

## 🎨 Component Variants

### **Button Variant (Recommended)**

```tsx
<ArticleToTrelloButton article={currentArticle} size="medium" variant="button" />;
```

**Renders:** `[🗃️ Convert to Trello Task]`

### **Icon Variant (Compact)**

```tsx
<ArticleToTrelloButton article={currentArticle} size="small" variant="icon" />;
```

**Renders:** `[🗃️]` (icon only with tooltip)

### **Custom Styling**

```tsx
<ArticleToTrelloButton
  article={currentArticle}
  className="custom-trello-button"
  disabled={!currentArticle.title} // Disable if no title
  size="large"
  variant="button"
/>;
```

## 📊 Article Data Mapping

### **What Gets Converted:**

| Article Property | →   | Trello Card Property                 |
| ---------------- | --- | ------------------------------------ |
| `title`          | →   | Card Name                            |
| `markdown`       | →   | Card Description (formatted)         |
| `sidebartext`    | →   | Card Description (summary)           |
| `link`           | →   | Card Description (full article link) |
| `created`        | →   | Card Description (metadata)          |
| `modified`       | →   | Card Description (metadata)          |
| `views`          | →   | Card Description (metadata)          |

### **Generated Card Description Format:**

```markdown
**Article:** Building Scalable React Components
**Link:** /article/scalable-react-components-52307777
**Summary:** A comprehensive guide to building maintainable components...
**Created:** 12/10/2024
**Modified:** 12/10/2024
**Views:** 1,247

**Content:**

# Introduction to Component Architecture

When building large-scale React applications, component architecture becomes crucial for maintainability, reusability, and team collaboration...

[Content truncated - see full article via link]

**Full Article:** /article/scalable-react-components-52307777
```

## 🔄 Conversion Flow

### **Step 1: Button Click**

- User clicks the "Convert to Trello Task" button
- Dialog opens with article preview

### **Step 2: Trello Initialization**

- Component automatically initializes Trello service
- Fetches user's available boards
- Shows loading state during fetch

### **Step 3: Board Selection**

- User selects target board from dropdown
- Component fetches lists for selected board
- List dropdown becomes available

### **Step 4: List Selection**

- User selects target list from dropdown
- Form becomes ready for submission

### **Step 5: Content Review**

- Card title auto-populated with article title
- Card description auto-generated with article content
- User can edit title and description if needed

### **Step 6: Card Creation**

- User clicks "Create Trello Card"
- Component calls Trello API to create card
- Shows loading state during creation

### **Step 7: Success/Error Feedback**

- Success: Shows confirmation with card name
- Error: Shows error message with retry option
- Dialog auto-closes after successful creation

## 🎛️ Advanced Configuration

### **Conditional Display**

```tsx
// Only show button for published articles
{
  currentArticle.visibility?.public && (
    <ArticleToTrelloButton article={currentArticle} size="small" variant="button" />
  );
}

// Only show for articles with content
{
  currentArticle.markdown && currentArticle.markdown.length > 100 && (
    <ArticleToTrelloButton article={currentArticle} size="medium" variant="icon" />
  );
}
```

### **Custom Event Handling**

```tsx
// You can wrap with custom logic
const handleTrelloConversion = (article: CurrentArticle) => {
  // Track analytics
  analytics.track("article_converted_to_trello", {
    articleId: article.uuid,
    articleTitle: article.title,
    wordCount: article.markdown?.length || 0,
  });
};

return (
  <div onClick={() => handleTrelloConversion(currentArticle)}>
    <ArticleToTrelloButton
      article={currentArticle}
      size="medium"
      variant="button"
    />
  </div>
);
```

### **Responsive Design**

```tsx
// Different variants for different screen sizes
const isMobile = useMediaQuery('(max-width: 768px)')

<ArticleToTrelloButton
  article={currentArticle}
  variant={isMobile ? "icon" : "button"}
  size={isMobile ? "small" : "medium"}
/>
```

## 🛠️ Error Handling

### **Common Error Scenarios:**

**No Trello Access:**

- Component shows "Failed to initialize Trello" message
- Retry button allows user to attempt again
- Fallback message explains Trello setup requirements

**No Boards Available:**

- Dialog shows "No boards found" message
- Suggests creating a board first
- Provides link to Trello board creation

**Network Failures:**

- Shows network error message
- Retry button for failed operations
- Graceful degradation with helpful messaging

**Invalid Article Data:**

- Validates article has required fields (title)
- Disables button if article is incomplete
- Shows tooltip explaining requirements

## 📱 Integration Points

### **Where to Add the Button:**

**✅ Recommended Locations:**

- Article content header (top-right corner)
- Article sidebar (actions section)
- Article toolbar (with other action buttons)
- Article detail modal (if using modals)

**❌ Avoid These Locations:**

- Inside article content text (disruptive)
- Footer (too far from context)
- Navigation bars (wrong context)
- Loading states (poor UX)

### **Styling Integration:**

```css
/* Match your existing button styles */
.custom-trello-button {
  padding: 8px 16px;
  font-weight: 500;
  color: white;
  background: var(--primary-color);
  border: none;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.custom-trello-button:hover {
  background: var(--primary-color-dark);
  transform: translateY(-1px);
}
```

## 🚀 Performance Tips

### **Optimizations:**

- Component lazy-loads Trello service only when clicked
- Trello boards are cached after first fetch
- Dialog content is memoized to prevent re-renders
- API calls use debouncing to prevent spam

### **Best Practices:**

- Place button in logical, discoverable locations
- Use icon variant in space-constrained areas
- Disable button for incomplete articles
- Provide clear feedback during all operations

## 🎯 Real-World Examples

### **Blog Post to Task:**

- **Article:** "Implementing Dark Mode in React"
- **Becomes:** Trello card in "Development Tasks" list
- **Usage:** Track implementation progress

### **Tutorial to Checklist:**

- **Article:** "Complete Guide to TypeScript Setup"
- **Becomes:** Trello card in "Learning" list
- **Usage:** Step-by-step learning progress

### **Bug Report to Ticket:**

- **Article:** "Critical Login Issue Analysis"
- **Becomes:** Trello card in "Bug Fixes" list
- **Usage:** Development team task tracking

---

**Ready to integrate article-to-Trello conversion!** 🎉
