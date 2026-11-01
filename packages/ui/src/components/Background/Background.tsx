import type * as React from "react";

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";

const backgroundVariants = cva("relative overflow-hidden", {
  defaultVariants: {
    animation: "none",
    blur: "none",
    gradient: "none",
    overlay: "none",
    pattern: "none",
    radius: "md",
    shadow: "none",
    variant: "default",
  },
  variants: {
    animation: {
      bounce: "animate-bounce",
      float: "animate-float",
      glow: "animate-glow",
      none: "",
      ping: "animate-ping",
      pulse: "animate-pulse",
      spin: "animate-spin",
      wiggle: "animate-wiggle",
    },
    blur: {
      "2xl": "backdrop-blur-2xl",
      "3xl": "backdrop-blur-3xl",
      lg: "backdrop-blur-lg",
      md: "backdrop-blur-md",
      none: "",
      sm: "backdrop-blur-sm",
      xl: "backdrop-blur-xl",
    },
    gradient: {
      accent: "bg-gradient-to-br from-[var(--accent)] to-[var(--accent)]/80",
      cosmic: "bg-gradient-to-br from-purple-400 via-pink-500 to-red-500",
      earth: "bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500",
      fire: "bg-gradient-to-br from-red-400 via-orange-500 to-yellow-500",
      forest: "bg-gradient-to-br from-green-400 via-green-500 to-green-600",
      ice: "bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600",
      none: "",
      ocean: "bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600",
      primary: "bg-gradient-to-br from-[var(--primary)] to-[var(--primary)]/80",
      rainbow: "bg-gradient-to-r from-red-500 via-yellow-500 to-green-500",
      secondary: "bg-gradient-to-br from-[var(--secondary)] to-[var(--secondary)]/80",
      sky: "bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600",
      sunset: "bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600",
    },
    overlay: {
      accent:
        "before:absolute before:inset-0 before:bg-[var(--accent)]/10 before:pointer-events-none",
      gradient:
        "before:absolute before:inset-0 before:bg-gradient-to-br before:from-black/10 before:to-transparent before:pointer-events-none",
      medium: "before:absolute before:inset-0 before:bg-black/10 before:pointer-events-none",
      none: "",
      primary:
        "before:absolute before:inset-0 before:bg-[var(--primary)]/10 before:pointer-events-none",
      strong: "before:absolute before:inset-0 before:bg-black/20 before:pointer-events-none",
      subtle: "before:absolute before:inset-0 before:bg-black/5 before:pointer-events-none",
    },
    pattern: {
      diagonal:
        "bg-[linear-gradient(45deg,_var(--foreground)_25%,_transparent_25%),_linear-gradient(-45deg,_var(--foreground)_25%,_transparent_25%),_linear-gradient(45deg,_transparent_75%,_var(--foreground)_75%),_linear-gradient(-45deg,_transparent_75%,_var(--foreground)_75%)] bg-[length:20px_20px] bg-[position:0_0,0_10px,10px_-10px,-10px_0px]",
      dots: "bg-[radial-gradient(circle_at_1px_1px,_var(--foreground)_1px,_transparent_0)] bg-[length:20px_20px]",
      grid: "bg-[linear-gradient(var(--foreground)_1px,_transparent_1px),_linear-gradient(90deg,_var(--foreground)_1px,_transparent_1px)] bg-[length:20px_20px]",
      noise:
        "bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSBiYXNlRnJlcXVlbmN5PSIwLjkiIG51bU9jdGF2ZXM9IjQiIHN0aXRjaFRpbGVzPSJzdGl0Y2giLz48L2ZpbHRlcj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI25vaXNlKSIgb3BhY2l0eT0iMC4xIi8+PC9zdmc+')]",
      none: "",
      stripes:
        "bg-[repeating-linear-gradient(45deg,_var(--foreground),_var(--foreground)_10px,_transparent_10px,_transparent_20px)]",
      waves: "bg-[radial-gradient(ellipse_at_center,_var(--foreground)_0%,_transparent_70%)]",
    },
    radius: {
      "2xl": "rounded-[var(--radius-2xl)]",
      full: "rounded-[var(--radius-full)]",
      lg: "rounded-[var(--radius-lg)]",
      md: "rounded-[var(--radius-m)]",
      none: "rounded-none",
      sm: "rounded-[var(--radius-s)]",
      xl: "rounded-[var(--radius-xl)]",
    },
    shadow: {
      "2xl": "shadow-2xl",
      inner: "shadow-inner",
      lg: "shadow-[var(--shadow-lg)]",
      md: "shadow-[var(--shadow-md)]",
      none: "shadow-none",
      sm: "shadow-[var(--shadow-s)]",
      xl: "shadow-[var(--shadow-xl)]",
      xs: "shadow-[var(--shadow-xs)]",
    },
    variant: {
      accent: "bg-[var(--accent)] text-[var(--accent-foreground)]",
      card: "bg-[var(--card)] text-[var(--card-foreground)]",
      default: "bg-[var(--background)]",
      destructive: "bg-[var(--destructive)] text-[var(--destructive-foreground)]",
      info: "bg-[var(--info)] text-[var(--info-foreground)]",
      muted: "bg-[var(--muted)] text-[var(--muted-foreground)]",
      popover: "bg-[var(--popover)] text-[var(--popover-foreground)]",
      primary: "bg-[var(--primary)] text-[var(--primary-foreground)]",
      secondary: "bg-[var(--secondary)] text-[var(--secondary-foreground)]",
      success: "bg-[var(--success)] text-[var(--success-foreground)]",
      transparent: "bg-transparent",
      warning: "bg-[var(--warning)] text-[var(--warning-foreground)]",
    },
  },
});

export interface BackgroundProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof backgroundVariants> {
  children?: React.ReactNode;
}

export function Background({
  className,
  variant,
  pattern,
  gradient,
  overlay,
  animation,
  blur,
  radius,
  shadow,
  children,
  ...props
}: BackgroundProps) {
  return (
    <div
      className={cn(
        backgroundVariants({
          animation,
          blur,
          className,
          gradient,
          overlay,
          pattern,
          radius,
          shadow,
          variant,
        }),
      )}
      data-slot="background"
      {...props}
    >
      {children}
    </div>
  );
}

// Convenience components for common background patterns
export function PrimaryBackground({
  className,
  children,
  ...props
}: Omit<BackgroundProps, "variant">) {
  return (
    <Background className={className} variant="default" {...props}>
      {children}
    </Background>
  );
}

export function CardBackground({
  className,
  children,
  ...props
}: Omit<BackgroundProps, "variant">) {
  return (
    <Background className={className} variant="card" {...props}>
      {children}
    </Background>
  );
}

export function GradientBackground({
  className,
  children,
  ...props
}: Omit<BackgroundProps, "gradient">) {
  return (
    <Background className={className} gradient="primary" {...props}>
      {children}
    </Background>
  );
}

export function PatternBackground({
  className,
  children,
  ...props
}: Omit<BackgroundProps, "pattern">) {
  return (
    <Background className={className} pattern="dots" {...props}>
      {children}
    </Background>
  );
}

export function AnimatedBackground({
  className,
  children,
  ...props
}: Omit<BackgroundProps, "animation">) {
  return (
    <Background animation="pulse" className={className} {...props}>
      {children}
    </Background>
  );
}
