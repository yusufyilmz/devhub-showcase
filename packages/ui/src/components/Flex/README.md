# Flex Component

A powerful and flexible layout component that respects the theme system and provides comprehensive flexbox utilities.

## Features

- **Theme Integration**: Uses CSS variables for consistent theming
- **Comprehensive Props**: Full control over flexbox properties
- **Convenience Components**: Pre-configured components for common patterns
- **TypeScript Support**: Full type safety with proper interfaces
- **Responsive Design**: Built-in support for responsive layouts

## Basic Usage

```tsx
import { Flex } from '@shared/ui/flex'

// Basic flex container
<Flex>
  <div>Item 1</div>
  <div>Item 2</div>
</Flex>

// With custom properties
<Flex
  direction="column"
  align="center"
  justify="between"
  gap="lg"
  padding="md"
  background="card"
>
  <div>Content</div>
</Flex>
```

## Props

### Layout Props

| Prop        | Type                                                                | Default    | Description     |
| ----------- | ------------------------------------------------------------------- | ---------- | --------------- |
| `direction` | `'row' \| 'row-reverse' \| 'column' \| 'column-reverse'`            | `'row'`    | Flex direction  |
| `align`     | `'start' \| 'center' \| 'end' \| 'stretch' \| 'baseline'`           | `'start'`  | Align items     |
| `justify`   | `'start' \| 'center' \| 'end' \| 'between' \| 'around' \| 'evenly'` | `'start'`  | Justify content |
| `wrap`      | `'nowrap' \| 'wrap' \| 'wrap-reverse'`                              | `'nowrap'` | Flex wrap       |

### Spacing Props

| Prop      | Type                                                               | Default  | Description       |
| --------- | ------------------------------------------------------------------ | -------- | ----------------- |
| `gap`     | `'none' \| 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl' \| '3xl'` | `'md'`   | Gap between items |
| `padding` | `'none' \| 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl' \| '3xl'` | `'none'` | Internal padding  |

### Styling Props

| Prop         | Type                                                                                                                       | Default  | Description      |
| ------------ | -------------------------------------------------------------------------------------------------------------------------- | -------- | ---------------- |
| `background` | `'none' \| 'primary' \| 'secondary' \| 'accent' \| 'card' \| 'muted' \| 'destructive' \| 'success' \| 'warning' \| 'info'` | `'none'` | Background color |
| `border`     | `'none' \| 'subtle' \| 'primary' \| 'accent' \| 'destructive'`                                                             | `'none'` | Border style     |
| `radius`     | `'none' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'`                                                                         | `'md'`   | Border radius    |
| `shadow`     | `'none' \| 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'`                                                                           | `'none'` | Box shadow       |

### Size Props

| Prop     | Type                                                      | Default  | Description |
| -------- | --------------------------------------------------------- | -------- | ----------- |
| `width`  | `'auto' \| 'full' \| 'fit' \| 'screen' \| 'min' \| 'max'` | `'auto'` | Width       |
| `height` | `'auto' \| 'full' \| 'fit' \| 'screen' \| 'min' \| 'max'` | `'auto'` | Height      |

## Convenience Components

### FlexRow

Pre-configured horizontal flex container.

```tsx
import { FlexRow } from "@shared/ui/components/v2";

<FlexRow align="center" gap="md">
  <div>Left</div>
  <div>Right</div>
</FlexRow>;
```

### FlexCol

Pre-configured vertical flex container.

```tsx
import { FlexCol } from "@shared/ui/components/v2";

<FlexCol align="stretch" gap="lg">
  <div>Top</div>
  <div>Bottom</div>
</FlexCol>;
```

### FlexCenter

Pre-configured centered flex container.

```tsx
import { FlexCenter } from "@shared/ui/components/v2";

<FlexCenter gap="md">
  <div>Centered content</div>
</FlexCenter>;
```

### FlexBetween

Pre-configured space-between flex container.

```tsx
import { FlexBetween } from "@shared/ui/components/v2";

<FlexBetween>
  <div>Left</div>
  <div>Right</div>
</FlexBetween>;
```

### FlexWrap

Pre-configured wrapping flex container.

```tsx
import { FlexWrap } from "@shared/ui/components/v2";

<FlexWrap gap="sm">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</FlexWrap>;
```

## Examples

### Card Layout

```tsx
<Flex background="card" direction="column" gap="lg" padding="lg" radius="lg" shadow="md">
  <h3>Card Title</h3>
  <p>Card content goes here</p>
</Flex>;
```

### Navigation Bar

```tsx
<Flex
  align="center"
  background="primary"
  direction="row"
  justify="between"
  padding="md"
  radius="md"
>
  <div>Logo</div>
  <Flex gap="md">
    <div>Link 1</div>
    <div>Link 2</div>
  </Flex>
</Flex>;
```

### Form Layout

```tsx
<FlexCol gap="md" width="full">
  <FlexCol gap="sm">
    <label>Name</label>
    <input />
  </FlexCol>
  <FlexCol gap="sm">
    <label>Email</label>
    <input />
  </FlexCol>
  <FlexRow gap="sm" justify="end">
    <button>Cancel</button>
    <button>Submit</button>
  </FlexRow>
</FlexCol>;
```

### Responsive Grid

```tsx
<FlexWrap gap="md">
  {items.map((item) => (
    <Flex
      background="card"
      className="flex-1 min-w-[200px]"
      direction="column"
      key={item.id}
      padding="md"
      radius="md"
      shadow="sm"
    >
      <h4>{item.title}</h4>
      <p>{item.description}</p>
    </Flex>
  ))}
</FlexWrap>;
```

## Theme Integration

The Flex component automatically respects your theme system:

- **Spacing**: Uses `var(--spacing-*)` variables
- **Colors**: Uses semantic color variables like `var(--primary)`, `var(--card)`
- **Shadows**: Uses `var(--shadow-*)` variables
- **Radius**: Uses `var(--radius-*)` variables
- **Borders**: Uses `var(--border)` variable

## Best Practices

### 1. Use Semantic Props

```tsx
// ✅ Good - semantic and clear
<Flex background="card" direction="column" gap="lg" padding="md" >

// ❌ Avoid - too specific
<Flex className="flex-col gap-4 p-4 bg-white">
```

### 2. Combine with Convenience Components

```tsx
// ✅ Good - use convenience components for common patterns
<FlexCenter gap="md">
  <div>Content</div>
</FlexCenter>

// ✅ Also good - use base component for complex layouts
<Flex direction="column" align="stretch" gap="lg">
  <div>Header</div>
  <FlexRow justify="between">
    <div>Left</div>
    <div>Right</div>
  </FlexRow>
</Flex>
```

### 3. Responsive Design

```tsx
<Flex className="flex-col md:flex-row" direction="row" gap="md">
  <div>Responsive item</div>
</Flex>;
```

### 4. Accessibility

```tsx
<Flex aria-label="Main navigation" direction="row" gap="md" role="navigation">
  <a href="/">Home</a>
  <a href="/about">About</a>
</Flex>;
```

## Migration from CSS Flexbox

### Before (CSS)

```css
.container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: var(--card);
  border-radius: 0.5rem;
}
```

### After (Flex Component)

```tsx
<Flex
  align="center"
  background="card"
  direction="column"
  gap="md"
  justify="between"
  padding="md"
  radius="md"
>
  Content
</Flex>;
```

## Performance

The Flex component is optimized for performance:

- **Minimal Re-renders**: Uses stable class names
- **CSS Variables**: Leverages CSS variables for theme changes
- **Tree Shaking**: Only imports what you use
- **TypeScript**: Compile-time optimizations

## Browser Support

- **Modern Browsers**: Full support for all flexbox features
- **CSS Variables**: Requires modern browser support
- **Fallbacks**: Graceful degradation for older browsers
