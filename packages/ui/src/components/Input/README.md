# Input Component

A comprehensive input component that respects the theme system and provides advanced functionality with icon support and state management.

## Features

- **Theme Integration**: Uses CSS variables for consistent theming
- **Icon Support**: Left and right icon positioning
- **State Management**: Error, success, and warning states
- **Size Variants**: Small, default, and large sizes
- **Accessibility**: Full ARIA support and keyboard navigation
- **File Input Support**: Optimized for file uploads

## Basic Usage

```tsx
import { Input } from '@shared/ui/components/v2'

// Basic input
<Input placeholder="Enter your name" />

// With icons
<Input
  placeholder="Search products..."
  leftIcon={<SearchIcon />}
  rightIcon={<FilterIcon />}
/>

// With state
<Input
  placeholder="Enter your email"
  state="error"
  variant="destructive"
/>
```

## Props

### Input Props

| Prop                 | Type                                                                          | Default     | Description          |
| -------------------- | ----------------------------------------------------------------------------- | ----------- | -------------------- |
| `variant`            | `'default' \| 'primary' \| 'destructive' \| 'success' \| 'warning' \| 'info'` | `'default'` | Input variant        |
| `size`               | `'sm' \| 'default' \| 'lg'`                                                   | `'default'` | Input size           |
| `state`              | `'default' \| 'error' \| 'success' \| 'warning'`                              | `'default'` | Input state          |
| `leftIcon`           | `ReactNode`                                                                   | -           | Left icon            |
| `rightIcon`          | `ReactNode`                                                                   | -           | Right icon           |
| `containerClassName` | `string`                                                                      | -           | Container class name |

## Variants

### Input Variants

```tsx
<Input placeholder="Default input" variant="default" />
<Input variant="default" placeholder="Primary input" />
<Input placeholder="Error input" variant="destructive" />
<Input variant="success" placeholder="Success input" />
<Input placeholder="Warning input" variant="warning" />
<Input variant="info" placeholder="Info input" />
```

### Sizes

```tsx
<Input placeholder="Small input" size="sm" />
<Input size="default" placeholder="Default input" />
<Input placeholder="Large input" size="lg" />
```

### States

```tsx
<Input placeholder="Default state" state="default" />
<Input state="error" placeholder="Error state" />
<Input placeholder="Success state" state="success" />
<Input state="warning" placeholder="Warning state" />
```

## Icons

### Left Icon

```tsx
<Input leftIcon={<SearchIcon />} placeholder="Search products..." />;
```

### Right Icon

```tsx
<Input placeholder="Enter amount" rightIcon={<CurrencyIcon />} />;
```

### Both Icons

```tsx
<Input leftIcon={<SearchIcon />} placeholder="Search and filter" rightIcon={<FilterIcon />} />;
```

## Examples

### Search Input

```tsx
<Input
  className="w-full"
  leftIcon={<SearchIcon />}
  placeholder="Search products..."
  type="search"
/>;
```

### Email Input

```tsx
<Input leftIcon={<EmailIcon />} placeholder="Enter your email" required type="email" />;
```

### Password Input

```tsx
<Input placeholder="Enter your password" required rightIcon={<EyeIcon />} type="password" />;
```

### File Input

```tsx
<Input
  accept="image/*"
  className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[var(--primary)] file:text-[var(--primary-foreground)] hover:file:bg-[var(--primary)]/90"
  type="file"
/>;
```

### Number Input

```tsx
<Input max="100" min="0" placeholder="Enter quantity" step="1" type="number" />;
```

### URL Input

```tsx
<Input leftIcon={<LinkIcon />} placeholder="Enter website URL" type="url" />;
```

### Date Input

```tsx
<Input leftIcon={<CalendarIcon />} placeholder="Select date" type="date" />;
```

### Time Input

```tsx
<Input leftIcon={<ClockIcon />} placeholder="Select time" type="time" />;
```

### Color Input

```tsx
<Input className="h-12 w-12 rounded border-0 cursor-pointer" type="color" />;
```

## Form Integration

### Basic Form

```tsx
<form className="space-y-4">
  <Input placeholder="Full Name" required type="text" />

  <Input placeholder="Email Address" required type="email" />

  <Input placeholder="Password" required type="password" />
</form>;
```

### Controlled Input

```tsx
const [value, setValue] = useState('')

<Input
  value={value}
  onChange={(e) => setValue(e.target.value)}
  placeholder="Controlled input"
/>
```

### Validation States

```tsx
const [email, setEmail] = useState("");
const [isValid, setIsValid] = useState(true);

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

<Input
  onChange={(e) => {
    setEmail(e.target.value);
    setIsValid(validateEmail(e.target.value));
  }}
  placeholder="Enter your email"
  state={isValid ? "default" : "error"}
  type="email"
  value={email}
  variant={isValid ? "default" : "destructive"}
/>;
```

## Theme Integration

The Input component automatically respects your theme system:

- **Colors**: Uses semantic color variables like `var(--primary)`, `var(--destructive)`
- **Spacing**: Uses `var(--spacing-*)` variables for consistent spacing
- **Borders**: Uses `var(--border)` and theme-specific border colors
- **Focus States**: Uses `var(--primary)` for focus rings
- **Backgrounds**: Uses `var(--background)` for input backgrounds

## Accessibility

### ARIA Support

- Proper focus management
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support

### Keyboard Navigation

- Tab order follows logical flow
- Enter key submits forms
- Escape key clears inputs
- Arrow keys for number inputs

## Best Practices

### 1. Use Appropriate Input Types

```tsx
// ✅ Good - semantic input types
<Input placeholder="Email" type="email" />
<Input type="password" placeholder="Password" />
<Input placeholder="Phone" type="tel" />
<Input type="url" placeholder="Website" />

// ❌ Avoid - generic text for specific data
<Input placeholder="Email" type="text" />
```

### 2. Provide Visual Feedback

```tsx
// ✅ Good - clear state indication
<Input
  placeholder="Invalid input"
  state="error"
  variant="destructive"
/>

// ❌ Avoid - unclear state
<Input placeholder="Input" />
```

### 3. Use Icons Meaningfully

```tsx
// ✅ Good - helpful icons
<Input
  leftIcon={<SearchIcon />}
  placeholder="Search"
/>

// ❌ Avoid - decorative icons
<Input
  placeholder="Name"
  leftIcon={<StarIcon />}
/>
```

### 4. Handle Loading States

```tsx
<Input
  disabled={isLoading}
  placeholder="Searching..."
  rightIcon={isLoading ? <SpinnerIcon /> : <SearchIcon />}
/>;
```

## Performance

- **Controlled Components**: Optimized for React state management
- **Minimal Re-renders**: Uses stable class names
- **CSS Variables**: Leverages CSS variables for theme changes
- **File Handling**: Optimized for file upload scenarios

## Browser Support

- **Modern Browsers**: Full support for all input types
- **CSS Variables**: Requires modern browser support
- **File API**: Uses native file input capabilities
- **Fallbacks**: Graceful degradation for older browsers
