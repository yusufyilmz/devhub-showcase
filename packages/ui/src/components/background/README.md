# Background Component

A comprehensive background component that respects the theme system and provides advanced visual effects, patterns, and animations.

## Features

- **Theme Integration**: Uses CSS variables for consistent theming
- **Pattern Support**: Dots, grid, diagonal, stripes, waves, and noise patterns
- **Gradient Backgrounds**: Multiple gradient options including rainbow, sunset, ocean
- **Overlay Effects**: Subtle, medium, strong, and themed overlays
- **Animations**: Pulse, bounce, spin, ping, and custom animations
- **Blur Effects**: Backdrop blur from subtle to extreme
- **Convenience Components**: Pre-configured components for common patterns

## Basic Usage

```tsx
import { Background } from '@shared/ui/components/v2'

// Basic background
<Background variant="card">
  Content
</Background>

// With pattern
<Background
  variant="default"
  pattern="dots"
  gradient="sunset"
>
  Content
</Background>

// With animation
<Background
  variant="accent"
  animation="pulse"
  blur="lg"
>
  Content
</Background>
```

## Props

### Background Props

| Prop        | Type                                                                                                                                                        | Default     | Description         |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- | ------------------- |
| `variant`   | `'default' \| 'primary' \| 'secondary' \| 'accent' \| 'card' \| 'muted' \| 'destructive' \| 'success' \| 'warning' \| 'info' \| 'popover' \| 'transparent'` | `'default'` | Background variant  |
| `pattern`   | `'none' \| 'dots' \| 'grid' \| 'diagonal' \| 'stripes' \| 'waves' \| 'noise'`                                                                               | `'none'`    | Background pattern  |
| `gradient`  | `'none' \| 'primary' \| 'secondary' \| 'accent' \| 'rainbow' \| 'sunset' \| 'ocean' \| 'forest' \| 'fire' \| 'ice' \| 'earth' \| 'sky' \| 'cosmic'`         | `'none'`    | Gradient background |
| `overlay`   | `'none' \| 'subtle' \| 'medium' \| 'strong' \| 'primary' \| 'accent' \| 'gradient'`                                                                         | `'none'`    | Overlay effect      |
| `animation` | `'none' \| 'pulse' \| 'bounce' \| 'spin' \| 'ping' \| 'wiggle' \| 'float' \| 'glow'`                                                                        | `'none'`    | Animation effect    |
| `blur`      | `'none' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl' \| '3xl'`                                                                                                  | `'none'`    | Backdrop blur       |
| `radius`    | `'none' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl' \| 'full'`                                                                                                 | `'md'`      | Border radius       |
| `shadow`    | `'none' \| 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl' \| 'inner'`                                                                                        | `'none'`    | Box shadow          |

## Variants

### Background Variants

```tsx
<Background variant="default">Default background</Background>
<Background variant="default">Primary background</Background>
<Background variant="secondary">Secondary background</Background>
<Background variant="accent">Accent background</Background>
<Background variant="card">Card background</Background>
<Background variant="muted">Muted background</Background>
<Background variant="destructive">Destructive background</Background>
<Background variant="success">Success background</Background>
<Background variant="warning">Warning background</Background>
<Background variant="info">Info background</Background>
<Background variant="transparent">Transparent background</Background>
```

## Patterns

### Pattern Examples

```tsx
<Background pattern="dots">Dots pattern</Background>
<Background pattern="grid">Grid pattern</Background>
<Background pattern="diagonal">Diagonal pattern</Background>
<Background pattern="stripes">Stripes pattern</Background>
<Background pattern="waves">Waves pattern</Background>
<Background pattern="noise">Noise pattern</Background>
```

## Gradients

### Gradient Examples

```tsx
<Background gradient="primary">Primary gradient</Background>
<Background gradient="rainbow">Rainbow gradient</Background>
<Background gradient="sunset">Sunset gradient</Background>
<Background gradient="ocean">Ocean gradient</Background>
<Background gradient="forest">Forest gradient</Background>
<Background gradient="fire">Fire gradient</Background>
<Background gradient="ice">Ice gradient</Background>
<Background gradient="earth">Earth gradient</Background>
<Background gradient="sky">Sky gradient</Background>
<Background gradient="cosmic">Cosmic gradient</Background>
```

## Overlays

### Overlay Examples

```tsx
<Background overlay="subtle">Subtle overlay</Background>
<Background overlay="medium">Medium overlay</Background>
<Background overlay="strong">Strong overlay</Background>
<Background overlay="primary">Primary overlay</Background>
<Background overlay="accent">Accent overlay</Background>
<Background overlay="gradient">Gradient overlay</Background>
```

## Animations

### Animation Examples

```tsx
<Background animation="pulse">Pulsing background</Background>
<Background animation="bounce">Bouncing background</Background>
<Background animation="spin">Spinning background</Background>
<Background animation="ping">Pinging background</Background>
<Background animation="wiggle">Wiggling background</Background>
<Background animation="float">Floating background</Background>
<Background animation="glow">Glowing background</Background>
```

## Blur Effects

### Blur Examples

```tsx
<Background blur="sm">Small blur</Background>
<Background blur="md">Medium blur</Background>
<Background blur="lg">Large blur</Background>
<Background blur="xl">Extra large blur</Background>
<Background blur="2xl">2X large blur</Background>
<Background blur="3xl">3X large blur</Background>
```

## Convenience Components

### Pre-configured Components

```tsx
import {
  AnimatedBackground, 
  CardBackground,
  GradientBackground,
  PatternBackground,
  PrimaryBackground
} from '@shared/ui/components/v2'

<PrimaryBackground>Primary content</PrimaryBackground>
<CardBackground>Card content</CardBackground>
<GradientBackground>Gradient content</GradientBackground>
<PatternBackground>Pattern content</PatternBackground>
<AnimatedBackground>Animated content</AnimatedBackground>
```

## Examples

### Hero Section

```tsx
<Background
  animation="pulse"
  className="min-h-screen flex items-center justify-center"
  gradient="sunset"
  overlay="gradient"
  variant="default"
>
  <div className="text-center text-white">
    <h1 className="text-4xl font-bold mb-4">Welcome</h1>
    <p className="text-xl">Your journey starts here</p>
  </div>
</Background>;
```

### Card with Pattern

```tsx
<Background className="p-6" pattern="dots" radius="lg" shadow="lg" variant="card">
  <h3>Pattern Card</h3>
  <p>Content with dot pattern background</p>
</Background>;
```

### Animated Background

```tsx
<Background animation="float" blur="md" className="p-8" gradient="ocean" variant="accent">
  <div className="text-center">
    <h2>Floating Content</h2>
    <p>This content floats with the background</p>
  </div>
</Background>;
```

### Glass Effect

```tsx
<Background
  blur="xl"
  className="p-6 border border-white/20"
  overlay="subtle"
  radius="lg"
  shadow="lg"
  variant="transparent"
>
  <h3>Glass Card</h3>
  <p>Content with glass morphism effect</p>
</Background>;
```

### Noise Texture

```tsx
<Background className="p-6" overlay="medium" pattern="noise" variant="muted">
  <h3>Noise Texture</h3>
  <p>Content with noise pattern background</p>
</Background>;
```

### Gradient Overlay

```tsx
<Background
  animation="glow"
  className="p-8"
  gradient="cosmic"
  overlay="gradient"
  variant="transparent"
>
  <div className="text-white text-center">
    <h2>Cosmic Background</h2>
    <p>Content with cosmic gradient and glow effect</p>
  </div>
</Background>;
```

## Theme Integration

The Background component automatically respects your theme system:

- **Colors**: Uses semantic color variables like `var(--primary)`, `var(--card)`
- **Spacing**: Inherits from parent container
- **Shadows**: Uses `var(--shadow-*)` variables
- **Radius**: Uses `var(--radius-*)` variables
- **Consistency**: All variants follow the same design system

## Performance

- **CSS Variables**: Leverages CSS variables for theme changes
- **Minimal Re-renders**: Uses stable class names
- **Hardware Acceleration**: Animations use GPU acceleration
- **Tree Shaking**: Only imports what you use

## Browser Support

- **Modern Browsers**: Full support for all effects
- **CSS Variables**: Requires modern browser support
- **Backdrop Filter**: Requires modern browser support
- **Fallbacks**: Graceful degradation for older browsers

## Best Practices

### 1. Use Semantic Variants

```tsx
// ✅ Good - semantic variants
<Background variant="card">Card content</Background>
<Background variant="default">Primary content</Background>

// ❌ Avoid - non-semantic variants
<Background variant="destructive">Regular content</Background>
```

### 2. Combine Effects Thoughtfully

```tsx
// ✅ Good - complementary effects
<Background
  animation="pulse"
  gradient="sunset"
  overlay="gradient"
  variant="default"
>
  Content
</Background>

// ❌ Avoid - conflicting effects
<Background
  variant="default"
  gradient="ocean"
  pattern="stripes"
  animation="spin"
>
  Content
</Background>
```

### 3. Consider Performance

```tsx
// ✅ Good - minimal effects for performance
<Background shadow="sm" variant="card" >
  Content
</Background>

// ❌ Avoid - too many effects
<Background
  variant="default"
  gradient="rainbow"
  pattern="noise"
  animation="spin"
  blur="3xl"
>
  Content
</Background>
```

### 4. Use for Visual Hierarchy

```tsx
<Background className="p-8" variant="default" >
  <h1>Main Content</h1>
</Background>

<Background variant="card" className="p-4">
  <h2>Secondary Content</h2>
</Background>

<Background variant="muted" className="p-2">
  <p>Supporting Content</p>
</Background>
```
