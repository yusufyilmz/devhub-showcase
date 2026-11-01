# Typography Component

A comprehensive typography system that respects the theme and provides semantic text styling with full accessibility support.

## Features

- **Theme Integration**: Uses CSS variables for consistent theming
- **Semantic HTML**: Automatically chooses appropriate HTML elements
- **Accessibility**: Proper heading hierarchy and ARIA support
- **Flexible Styling**: Comprehensive variant and styling options
- **TypeScript Support**: Full type safety with proper interfaces

## Basic Usage

```tsx
import { Typography } from '@shared/ui/components/v2'

// Basic typography
<Typography variant="h1">Main Heading</Typography>
<Typography variant="body1">Body text content</Typography>
<Typography color="muted" variant="caption" >Caption text</Typography>
```

## Props

### Typography Props

| Prop         | Type                                                                                                                                                                                                                                    | Default         | Description            |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- | ---------------------- |
| `variant`    | `'h1' \| 'h2' \| 'h3' \| 'h4' \| 'h5' \| 'h6' \| 'body1' \| 'body2' \| 'caption' \| 'overline' \| 'subtitle1' \| 'subtitle2' \| 'code' \| 'lead' \| 'large' \| 'small' \| 'muted' \| 'destructive' \| 'success' \| 'warning' \| 'info'` | `'body1'`       | Typography variant     |
| `align`      | `'left' \| 'center' \| 'right' \| 'justify'`                                                                                                                                                                                            | `'left'`        | Text alignment         |
| `weight`     | `'thin' \| 'light' \| 'normal' \| 'medium' \| 'semibold' \| 'bold' \| 'extrabold' \| 'black'`                                                                                                                                           | `'normal'`      | Font weight            |
| `transform`  | `'none' \| 'uppercase' \| 'lowercase' \| 'capitalize'`                                                                                                                                                                                  | `'none'`        | Text transform         |
| `decoration` | `'none' \| 'underline' \| 'line-through' \| 'overline'`                                                                                                                                                                                 | `'none'`        | Text decoration        |
| `color`      | `'default' \| 'muted' \| 'primary' \| 'secondary' \| 'accent' \| 'destructive' \| 'success' \| 'warning' \| 'info' \| 'card' \| 'popover'`                                                                                              | `'default'`     | Text color             |
| `truncate`   | `'none' \| 'truncate' \| 'truncate-2' \| 'truncate-3' \| 'truncate-4' \| 'truncate-5'`                                                                                                                                                  | `'none'`        | Text truncation        |
| `as`         | `React.ElementType`                                                                                                                                                                                                                     | Auto-determined | HTML element to render |

## Variants

### Headings

```tsx
<Typography variant="h1">Heading 1</Typography>
<Typography variant="h2">Heading 2</Typography>
<Typography variant="h3">Heading 3</Typography>
<Typography variant="h4">Heading 4</Typography>
<Typography variant="h5">Heading 5</Typography>
<Typography variant="h6">Heading 6</Typography>
```

### Body Text

```tsx
<Typography variant="body1">Primary body text</Typography>
<Typography variant="body2">Secondary body text</Typography>
<Typography variant="lead">Lead paragraph</Typography>
<Typography variant="large">Large text</Typography>
<Typography variant="small">Small text</Typography>
```

### Special Variants

```tsx
<Typography variant="caption">Caption text</Typography>
<Typography variant="overline">Overline text</Typography>
<Typography variant="subtitle1">Subtitle 1</Typography>
<Typography variant="subtitle2">Subtitle 2</Typography>
<Typography variant="code">Code text</Typography>
```

## Convenience Components

### Heading Components

```tsx
import { Heading1, Heading2, Heading3, Heading4, Heading5, Heading6 } from '@shared/ui/components/v2'

<Heading1>Main Title</Heading1>
<Heading2>Section Title</Heading2>
<Heading3>Subsection Title</Heading3>
```

### Body Components

```tsx
import { Body1, Body2, Caption, Code, Lead, Muted } from '@shared/ui/components/v2'

<Body1>Primary content</Body1>
<Body2>Secondary content</Body2>
<Caption>Caption text</Caption>
<Code>const example = "code";</Code>
<Lead>Lead paragraph text</Lead>
<Muted>Muted text</Muted>
```

## Styling Examples

### Color Variants

```tsx
<Typography color="default">Default text</Typography>
<Typography color="muted">Muted text</Typography>
<Typography color="primary">Primary text</Typography>
<Typography color="destructive">Error text</Typography>
<Typography color="success">Success text</Typography>
<Typography color="warning">Warning text</Typography>
<Typography color="info">Info text</Typography>
```

### Alignment

```tsx
<Typography align="left">Left aligned</Typography>
<Typography align="center">Center aligned</Typography>
<Typography align="right">Right aligned</Typography>
<Typography align="justify">Justified text</Typography>
```

### Weight and Transform

```tsx
<Typography weight="bold">Bold text</Typography>
<Typography weight="light">Light text</Typography>
<Typography transform="uppercase">UPPERCASE TEXT</Typography>
<Typography transform="capitalize">capitalized text</Typography>
```

### Text Decoration

```tsx
<Typography decoration="underline">Underlined text</Typography>
<Typography decoration="line-through">Strikethrough text</Typography>
```

### Truncation

```tsx
<Typography truncate>Single line truncated text</Typography>
<Typography truncate="truncate-2">Two line truncated text</Typography>
<Typography truncate="truncate-3">Three line truncated text</Typography>
```

## Real-world Examples

### Article Layout

```tsx
<article>
  <Heading1>Article Title</Heading1>
  <Lead>This is the lead paragraph that introduces the article.</Lead>

  <Heading2>Section Heading</Heading2>
  <Body1>
    This is the main content of the article. It provides detailed information about the topic being
    discussed.
  </Body1>

  <Heading3>Subsection</Heading3>
  <Body2>This is secondary content that supports the main content.</Body2>

  <Caption color="muted">
    Published on {date} by {author}
  </Caption>
</article>;
```

### Form Labels and Helpers

```tsx
<form>
  <Typography className="mb-4" variant="h6">
    Contact Information
  </Typography>

  <div className="mb-4">
    <Typography className="mb-2" variant="body2" weight="medium">
      Full Name
    </Typography>
    <input type="text" />
    <Typography color="muted" variant="caption">
      Enter your full legal name
    </Typography>
  </div>

  <div className="mb-4">
    <Typography className="mb-2" variant="body2" weight="medium">
      Email Address
    </Typography>
    <input type="email" />
    <Typography color="destructive" variant="caption">
      Please enter a valid email address
    </Typography>
  </div>
</form>;
```

### Card Content

```tsx
<Card>
  <Heading4>Card Title</Heading4>
  <Body2 className="mb-4" color="muted">
    Card description that explains what this card is about.
  </Body2>

  <Body1 className="mb-4">
    Main card content goes here. This is where you put the primary information that users need to
    see.
  </Body1>

  <div className="flex justify-between items-center">
    <Caption color="muted">Last updated: {date}</Caption>
    <Button>Action</Button>
  </div>
</Card>;
```

### Code Documentation

```tsx
<div>
  <Heading5>Function: calculateTotal</Heading5>
  <Body2 className="mb-2" color="muted">
    Calculates the total price including tax and discounts.
  </Body2>

  <Code className="block p-4 bg-muted rounded">
    {`function calculateTotal(items, taxRate, discount) {
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const tax = subtotal * taxRate;
  const discountAmount = subtotal * discount;
  return subtotal + tax - discountAmount;
}`}
  </Code>

  <Body2 className="mt-2">
    <strong>Parameters:</strong>
  </Body2>
  <ul className="list-disc list-inside">
    <li>
      <Code>items</Code> - Array of items with price property
    </li>
    <li>
      <Code>taxRate</Code> - Tax rate as decimal (0.1 for 10%)
    </li>
    <li>
      <Code>discount</Code> - Discount rate as decimal
    </li>
  </ul>
</div>;
```

## Theme Integration

The Typography component automatically respects your theme system:

- **Colors**: Uses semantic color variables like `var(--foreground)`, `var(--primary)`
- **Spacing**: Inherits from parent container
- **Fonts**: Uses theme font family settings
- **Consistency**: All variants follow the same design system

## Accessibility

### Semantic HTML

The component automatically chooses appropriate HTML elements:

- `h1` → `<h1>`
- `h2` → `<h2>`
- `h3` → `<h3>`
- `h4` → `<h4>`
- `h5` → `<h5>`
- `h6` → `<h6>`
- `code` → `<code>`
- Others → `<p>`

### Custom Elements

```tsx
// Use custom HTML elements
<Typography as="span" variant="h1">Inline heading</Typography>
<Typography as="div" variant="body1">Block text</Typography>
```

### Screen Reader Support

- Proper heading hierarchy
- Semantic markup
- Color contrast compliance
- Focus management

## Best Practices

### 1. Use Semantic Variants

```tsx
// ✅ Good - semantic and accessible
<Heading1>Page Title</Heading1>
<Heading2>Section Title</Heading2>
<Body1>Main content</Body1>

// ❌ Avoid - non-semantic
<Typography variant="h1" as="div">Not a heading</Typography>
```

### 2. Consistent Hierarchy

```tsx
// ✅ Good - proper heading hierarchy
<Heading1>Main Title</Heading1>
  <Heading2>Section 1</Heading2>
    <Heading3>Subsection 1.1</Heading3>
    <Heading3>Subsection 1.2</Heading3>
  <Heading2>Section 2</Heading2>
    <Heading3>Subsection 2.1</Heading3>
```

### 3. Appropriate Color Usage

```tsx
// ✅ Good - semantic colors
<Typography color="destructive">Error message</Typography>
<Typography color="success">Success message</Typography>
<Typography color="muted">Secondary information</Typography>

// ❌ Avoid - using colors for decoration only
<Typography color="primary">Regular text</Typography>
```

### 4. Responsive Typography

```tsx
<Typography className="text-2xl md:text-4xl lg:text-5xl" variant="h1">
  Responsive heading
</Typography>;
```

## Performance

- **Minimal Re-renders**: Uses stable class names
- **CSS Variables**: Leverages CSS variables for theme changes
- **Tree Shaking**: Only imports what you use
- **TypeScript**: Compile-time optimizations

## Browser Support

- **Modern Browsers**: Full support for all CSS features
- **CSS Variables**: Requires modern browser support
- **Fallbacks**: Graceful degradation for older browsers
