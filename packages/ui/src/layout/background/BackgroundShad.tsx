import type * as React from "react";

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";

const backgroundVariants = cva("relative overflow-hidden", {
  variants: {
    variant: {
      default: "bg-[var(--background)]",
      primary: "bg-[var(--primary)] text-[var(--primary-foreground)]",
      secondary: "bg-[var(--secondary)] text-[var(--secondary-foreground)]",
      accent: "bg-[var(--accent)] text-[var(--accent-foreground)]",
      card: "bg-[var(--card)] text-[var(--card-foreground)]",
      muted: "bg-[var(--muted)] text-[var(--muted-foreground)]",
      destructive: "bg-[var(--destructive)] text-[var(--destructive-foreground)]",
      success: "bg-[var(--success)] text-[var(--success-foreground)]",
      warning: "bg-[var(--warning)] text-[var(--warning-foreground)]",
      info: "bg-[var(--info)] text-[var(--info-foreground)]",
      popover: "bg-[var(--popover)] text-[var(--popover-foreground)]",
      transparent: "bg-transparent",
    },
    pattern: {
      none: "",
      dots: "bg-[radial-gradient(circle_at_1px_1px,_var(--foreground)_1px,_transparent_0)] bg-[length:20px_20px]",
      grid: "bg-[linear-gradient(var(--foreground)_1px,_transparent_1px),_linear-gradient(90deg,_var(--foreground)_1px,_transparent_1px)] bg-[length:20px_20px]",
      diagonal:
        "bg-[linear-gradient(45deg,_var(--foreground)_25%,_transparent_25%),_linear-gradient(-45deg,_var(--foreground)_25%,_transparent_25%),_linear-gradient(45deg,_transparent_75%,_var(--foreground)_75%),_linear-gradient(-45deg,_transparent_75%,_var(--foreground)_75%)] bg-[length:20px_20px] bg-[position:0_0,0_10px,10px_-10px,-10px_0px]",
      stripes:
        "bg-[repeating-linear-gradient(45deg,_var(--foreground),_var(--foreground)_10px,_transparent_10px,_transparent_20px)]",
      waves: "bg-[radial-gradient(ellipse_at_center,_var(--foreground)_0%,_transparent_70%)]",
      noise:
        "bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSBiYXNlRnJlcXVlbmN5PSIwLjkiIG51bU9jdGF2ZXM9IjQiIHN0aXRjaFRpbGVzPSJzdGl0Y2giLz48L2ZpbHRlcj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI25vaXNlKSIgb3BhY2l0eT0iMC4xIi8+PC9zdmc+')]",
    },
    gradient: {
      none: "",
      primary: "bg-gradient-to-br from-[var(--primary)] to-[var(--primary)]/80",
      secondary: "bg-gradient-to-br from-[var(--secondary)] to-[var(--secondary)]/80",
      accent: "bg-gradient-to-br from-[var(--accent)] to-[var(--accent)]/80",
      rainbow: "bg-gradient-to-r from-red-500 via-yellow-500 to-green-500",
      sunset: "bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600",
      ocean: "bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600",
      forest: "bg-gradient-to-br from-green-400 via-green-500 to-green-600",
      fire: "bg-gradient-to-br from-red-400 via-orange-500 to-yellow-500",
      ice: "bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600",
      earth: "bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500",
      sky: "bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600",
      cosmic: "bg-gradient-to-br from-purple-400 via-pink-500 to-red-500",
    },
    overlay: {
      none: "",
      subtle: "before:absolute before:inset-0 before:bg-black/5 before:pointer-events-none",
      medium: "before:absolute before:inset-0 before:bg-black/10 before:pointer-events-none",
      strong: "before:absolute before:inset-0 before:bg-black/20 before:pointer-events-none",
      primary:
        "before:absolute before:inset-0 before:bg-[var(--primary)]/10 before:pointer-events-none",
      accent:
        "before:absolute before:inset-0 before:bg-[var(--accent)]/10 before:pointer-events-none",
      gradient:
        "before:absolute before:inset-0 before:bg-gradient-to-br before:from-black/10 before:to-transparent before:pointer-events-none",
    },
    animation: {
      none: "",
      pulse: "animate-pulse",
      bounce: "animate-bounce",
      spin: "animate-spin",
      ping: "animate-ping",
      wiggle: "animate-wiggle",
      float: "animate-float",
      glow: "animate-glow",
    },
    blur: {
      none: "",
      sm: "backdrop-blur-sm",
      md: "backdrop-blur-md",
      lg: "backdrop-blur-lg",
      xl: "backdrop-blur-xl",
      "2xl": "backdrop-blur-2xl",
      "3xl": "backdrop-blur-3xl",
    },
    radius: {
      none: "rounded-none",
      sm: "rounded-[var(--radius-s)]",
      md: "rounded-[var(--radius-m)]",
      lg: "rounded-[var(--radius-lg)]",
      xl: "rounded-[var(--radius-xl)]",
      "2xl": "rounded-[var(--radius-2xl)]",
      full: "rounded-[var(--radius-full)]",
    },
    shadow: {
      none: "shadow-none",
      xs: "shadow-[var(--shadow-xs)]",
      sm: "shadow-[var(--shadow-s)]",
      md: "shadow-[var(--shadow-md)]",
      lg: "shadow-[var(--shadow-lg)]",
      xl: "shadow-[var(--shadow-xl)]",
      "2xl": "shadow-2xl",
      inner: "shadow-inner",
    },
  },
  defaultVariants: {
    variant: "default",
    pattern: "none",
    gradient: "none",
    overlay: "none",
    animation: "none",
    blur: "none",
    radius: "md",
    shadow: "none",
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
      data-slot="background"
      className={cn(
        backgroundVariants({
          variant,
          pattern,
          gradient,
          overlay,
          animation,
          blur,
          radius,
          shadow,
          className,
        }),
      )}
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
    <Background variant="primary" className={className} {...props}>
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
    <Background variant="card" className={className} {...props}>
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
    <Background gradient="primary" className={className} {...props}>
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
    <Background pattern="dots" className={className} {...props}>
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
