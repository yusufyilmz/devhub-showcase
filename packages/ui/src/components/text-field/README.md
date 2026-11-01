# TextField Component

A comprehensive form input system that respects the theme and provides advanced functionality with full accessibility support.

## Features

- **Theme Integration**: Uses CSS variables for consistent theming
- **Multiple Variants**: TextField, TextArea, and SearchField
- **State Management**: Error, success, and warning states
- **Accessibility**: Full ARIA support and keyboard navigation
- **Icon Support**: Left and right icon positioning
- **Validation**: Built-in validation states and helper text

## Basic Usage

```tsx
import { SearchField, TextArea, TextField } from '@shared/ui/components/v2'

// Basic text input
<TextField placeholder="Enter your name" />

// With label and helper text
<TextField
  label="Email Address"
  placeholder="Enter your email"
  helperText="We'll never share your email"
/>

// Textarea
<TextArea
  label="Message"
  placeholder="Enter your message"
  rows={4}
/>

// Search field
<SearchField
  placeholder="Search..."
  onClear={() => console.log('cleared')}
/>
```

## Props

### TextField Props

| Prop         | Type                                                                          | Default     | Description              |
| ------------ | ----------------------------------------------------------------------------- | ----------- | ------------------------ |
| `variant`    | `'default' \| 'primary' \| 'destructive' \| 'success' \| 'warning' \| 'info'` | `'default'` | Input variant            |
| `size`       | `'sm' \| 'default' \| 'lg'`                                                   | `'default'` | Input size               |
| `state`      | `'default' \| 'error' \| 'success' \| 'warning'`                              | `'default'` | Input state              |
| `label`      | `string`                                                                      | -           | Input label              |
| `helperText` | `string`                                                                      | -           | Helper text              |
| `error`      | `string`                                                                      | -           | Error message            |
| `success`    | `string`                                                                      | -           | Success message          |
| `warning`    | `string`                                                                      | -           | Warning message          |
| `required`   | `boolean`                                                                     | `false`     | Required field indicator |
| `leftIcon`   | `ReactNode`                                                                   | -           | Left icon                |
| `rightIcon`  | `ReactNode`                                                                   | -           | Right icon               |

### TextArea Props

Extends TextField props with:

| Prop     | Type                                             | Default      | Description     |
| -------- | ------------------------------------------------ | ------------ | --------------- |
| `resize` | `'none' \| 'both' \| 'horizontal' \| 'vertical'` | `'vertical'` | Resize behavior |

### SearchField Props

Extends TextField props with:

| Prop              | Type         | Default | Description          |
| ----------------- | ------------ | ------- | -------------------- |
| `onClear`         | `() => void` | -       | Clear button handler |
| `showClearButton` | `boolean`    | `true`  | Show clear button    |

## Variants

### Input Variants

```tsx
<TextField placeholder="Default input" variant="default" />
<TextField variant="default" placeholder="Primary input" />
<TextField placeholder="Error input" variant="destructive" />
<TextField variant="success" placeholder="Success input" />
<TextField placeholder="Warning input" variant="warning" />
<TextField variant="info" placeholder="Info input" />
```

### Sizes

```tsx
<TextField placeholder="Small input" size="sm" />
<TextField size="default" placeholder="Default input" />
<TextField placeholder="Large input" size="lg" />
```

## States

### Error State

```tsx
<TextField
  error="Please enter a valid email address"
  label="Email"
  placeholder="Enter your email"
  state="error"
/>;
```

### Success State

```tsx
<TextField label="Email" placeholder="Enter your email" state="success" success="Email is valid" />;
```

### Warning State

```tsx
<TextField
  label="Password"
  placeholder="Enter your password"
  state="warning"
  warning="Password is weak"
/>;
```

## Icons

### Left Icon

```tsx
<TextField label="Search" leftIcon={<SearchIcon />} placeholder="Search products..." />;
```

### Right Icon

```tsx
<TextField label="Password" rightIcon={<EyeIcon />} type="password" />;
```

### Both Icons

```tsx
<TextField
  label="Amount"
  leftIcon={<DollarIcon />}
  placeholder="0.00"
  rightIcon={<CurrencyIcon />}
/>;
```

## Form Examples

### Basic Form

```tsx
<form className="space-y-4">
  <TextField label="Full Name" placeholder="Enter your full name" required />

  <TextField
    helperText="We'll never share your email"
    label="Email Address"
    placeholder="Enter your email"
    required
    type="email"
  />

  <TextArea
    helperText="Tell us what you think"
    label="Message"
    placeholder="Enter your message"
    rows={4}
  />
</form>;
```

### Validation Form

```tsx
const [formData, setFormData] = useState({
  confirmPassword: "",
  email: "",
  password: "",
});

const [errors, showErrors] = useState({});

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

<form className="space-y-4">
  <TextField
    error={!validateEmail(formData.email) && formData.email ? "Invalid email format" : ""}
    label="Email"
    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
    state={!validateEmail(formData.email) && formData.email ? "error" : "default"}
    type="email"
    value={formData.email}
  />

  <TextField
    helperText="Must be at least 8 characters"
    label="Password"
    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
    type="password"
    value={formData.password}
  />

  <TextField
    error={
      formData.password !== formData.confirmPassword && formData.confirmPassword
        ? "Passwords do not match"
        : ""
    }
    label="Confirm Password"
    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
    state={
      formData.password !== formData.confirmPassword && formData.confirmPassword
        ? "error"
        : "default"
    }
    type="password"
    value={formData.confirmPassword}
  />
</form>;
```

### Search Interface

```tsx
const [searchTerm, setSearchTerm] = useState('')
const [searchResults, setSearchResults] = useState([])

<SearchField
  placeholder="Search products..."
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  onClear={() => {
    setSearchTerm('')
    setSearchResults([])
  }}
  className="mb-4"
/>

{searchResults.length > 0 && (
  <div className="space-y-2">
    {searchResults.map(result => (
      <div className="p-2 border rounded" key={result.id} >
        {result.title}
      </div>
    ))}
  </div>
)}
```

## Advanced Examples

### Multi-step Form

```tsx
const [step, setStep] = useState(1);
const [formData, setFormData] = useState({});

const Step1 = () => (
  <div className="space-y-4">
    <Heading3>Personal Information</Heading3>
    <TextField label="First Name" placeholder="Enter your first name" required />
    <TextField label="Last Name" placeholder="Enter your last name" required />
    <TextField label="Email" placeholder="Enter your email" required type="email" />
  </div>
);

const Step2 = () => (
  <div className="space-y-4">
    <Heading3>Contact Information</Heading3>
    <TextField label="Phone Number" placeholder="Enter your phone number" />
    <TextArea label="Address" placeholder="Enter your address" rows={3} />
  </div>
);
```

### Filter Form

```tsx
const [filters, setFilters] = useState({
  category: '',
  priceRange: '', 
  search: ''
})

<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  <SearchField
    onChange={(e) => setFilters({...filters, search: e.target.value})}
    placeholder="Search products..."
    value={filters.search}
  />

  <TextField
    label="Category"
    placeholder="Select category"
    value={filters.category}
    onChange={(e) => setFilters({...filters, category: e.target.value})}
  />

  <TextField
    label="Price Range"
    placeholder="0 - 1000"
    value={filters.priceRange}
    onChange={(e) => setFilters({...filters, priceRange: e.target.value})}
  />
</div>
```

## Theme Integration

The TextField component automatically respects your theme system:

- **Colors**: Uses semantic color variables like `var(--primary)`, `var(--destructive)`
- **Spacing**: Uses `var(--spacing-*)` variables for consistent spacing
- **Borders**: Uses `var(--border)` and theme-specific border colors
- **Focus States**: Uses `var(--primary)` for focus rings
- **Backgrounds**: Uses `var(--background)` and `var(--muted)` for backgrounds

## Accessibility

### ARIA Support

- `aria-describedby` for helper text
- `aria-invalid` for error states
- `aria-required` for required fields
- Proper label associations

### Keyboard Navigation

- Tab order follows logical flow
- Enter key submits forms
- Escape key clears search fields
- Arrow keys for dropdown navigation

### Screen Reader Support

- Descriptive labels and helper text
- Error announcements
- State changes are announced
- Focus management

## Best Practices

### 1. Use Semantic Labels

```tsx
// ✅ Good - descriptive and clear
<TextField
  helperText="We'll use this to send you updates"
  label="Email Address"
  placeholder="Enter your email address"
/>

// ❌ Avoid - vague or unclear
<TextField
  label="Input"
  placeholder="Enter text"
/>
```

### 2. Provide Helpful Feedback

```tsx
// ✅ Good - specific and actionable
<TextField
  error="Password must be at least 8 characters and contain a number"
  label="Password"
  type="password"
/>

// ❌ Avoid - generic or unhelpful
<TextField
  label="Password"
  type="password"
  error="Invalid"
/>
```

### 3. Use Appropriate Input Types

```tsx
// ✅ Good - semantic input types
<TextField label="Email" type="email" />
<TextField type="password" label="Password" />
<TextField label="Phone Number" type="tel" />
<TextField type="url" label="Website" />

// ❌ Avoid - generic text for specific data
<TextField label="Email" type="text" />
```

### 4. Group Related Fields

```tsx
// ✅ Good - logical grouping
<fieldset>
  <legend>Contact Information</legend>
  <TextField label="Email" />
  <TextField label="Phone" />
</fieldset>

<fieldset>
  <legend>Address</legend>
  <TextField label="Street" />
  <TextField label="City" />
  <TextField label="ZIP Code" />
</fieldset>
```

## Performance

- **Controlled Components**: Optimized for React state management
- **Minimal Re-renders**: Uses stable class names
- **CSS Variables**: Leverages CSS variables for theme changes
- **Tree Shaking**: Only imports what you use

## Browser Support

- **Modern Browsers**: Full support for all features
- **CSS Variables**: Requires modern browser support
- **Form Validation**: Uses native HTML5 validation
- **Fallbacks**: Graceful degradation for older browsers
