"use client";

import * as React from "react";

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";

import { convertSystemProps, extractSystemProps, type SystemProps } from "../utils/system-props";

const variantCardVariants = cva(
  "relative transition-all duration-300 ease-out border border-solid",
  {
    defaultVariants: {
      rounded: "default",
      shadow: "default",
      size: "default",
      variant: "default",
    },
    variants: {
      rounded: {
        default: "rounded-lg",
        full: "rounded-2xl",
        lg: "rounded-xl",
        none: "rounded-none",
        sm: "rounded-sm",
      },
      shadow: {
        default: "shadow-md",
        lg: "shadow-lg",
        none: "",
        sm: "shadow-sm",
        xl: "shadow-xl",
      },
      size: {
        compact: "p-2 sm:p-2.5 md:p-3",
        default: "p-4 sm:p-5 md:p-6",
        lg: "p-5 sm:p-6 md:p-8",
        sm: "p-3",
        spacious: "p-6 sm:p-8 md:p-10",
      },
      variant: {
        default: "bg-card text-card-foreground border-border",
        elevated: "bg-card text-card-foreground border-border shadow-lg",
        glass:
          "bg-card/60 text-card-foreground border-border/50 backdrop-blur-xl backdrop-saturate-120",
        gradient: "bg-gradient-to-br from-card to-muted text-card-foreground border-border",
        subtle: "bg-card/90 text-card-foreground border-border/70",
      },
    },
  },
);

type AccentConfig = {
  gradient?: string;
  position?: "top" | "bottom" | "left" | "right";
  size?: number;
  colors?: [string, string, string];
};

export interface VariantCardProps
  extends Omit<
      React.HTMLAttributes<HTMLDivElement>,
      keyof VariantProps<typeof variantCardVariants> | keyof SystemProps
    >,
    VariantProps<typeof variantCardVariants>,
    Omit<SystemProps, "shadow"> {
  /**
   * Show accent border/gradient
   * @default false
   */
  accent?: boolean | AccentConfig;

  /**
   * Allow overflow for effects like shadows/glows
   * @default false
   */
  allowOverflow?: boolean;

  children?: React.ReactNode;

  /**
   * Enable fade-in animation
   * @default false
   */
  fadeIn?: boolean;

  /**
   * Fade-in delay in ms
   * @default 0
   */
  fadeInDelay?: number;

  /**
   * Enable floating animation
   * @default false
   */
  float?: boolean;

  /**
   * Full width
   * @default false
   */
  fullWidth?: boolean;

  /**
   * Custom glow color (uses primary by default)
   */
  glowColor?: string;

  /**
   * Enable glow effect on hover
   * @default false
   */
  glowOnHover?: boolean;

  /**
   * Enable hover effects
   * @default false
   */
  hoverable?: boolean;

  /**
   * Scale factor on hover
   * @default 1.02
   */
  hoverScale?: number;

  /**
   * Translate Y on hover (negative moves up)
   * @default -4
   */
  hoverTranslateY?: number;

  /**
   * Overlay opacity (0-1)
   * @default 0.05
   */
  overlayOpacity?: number;

  /**
   * Pattern overlay
   * @default false
   */
  pattern?: "dots" | "grid" | "none";

  /**
   * Enable pulse animation
   * @default false
   */
  pulse?: boolean;

  /**
   * Transition duration in ms
   * @default 300
   */
  transitionDuration?: number;
}

function resolveVariantAccent(accent: boolean | AccentConfig | undefined): AccentConfig | null {
  if (typeof accent !== "boolean") return accent ?? null;
  if (accent) return {};
  return null;
}

function variantCardStyle(options: {
  allowOverflow: boolean;
  fadeIn: boolean;
  finalGlowColor: string;
  fullWidth: boolean;
  glowOnHover: boolean;
  hoverScale: number;
  hoverTranslateY: number;
  hoverable: boolean;
  isVisible: boolean;
  patternStyles: React.CSSProperties;
  style?: React.CSSProperties;
  systemStyles: React.CSSProperties;
  transitionDuration: number;
}): React.CSSProperties {
  return {
    ...options.systemStyles,
    ...options.style,
    opacity: options.isVisible ? 1 : 0,
    overflow: options.allowOverflow ? "visible" : "hidden",
    transform: options.isVisible ? "translateY(0)" : "translateY(10px)",
    transition: options.fadeIn
      ? `opacity ${options.transitionDuration}ms ease-out, transform ${options.transitionDuration}ms ease-out, all ${options.transitionDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`
      : `all ${options.transitionDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
    transitionDuration: `${options.transitionDuration}ms`,
    width: options.fullWidth ? "100%" : undefined,
    ...options.patternStyles,
    ...(options.hoverable &&
      ({
        "--hover-scale": options.hoverScale.toString(),
        "--hover-translate-y": `${options.hoverTranslateY}px`,
      } as React.CSSProperties)),
    ...(options.glowOnHover &&
      ({
        "--glow-color": options.finalGlowColor,
      } as React.CSSProperties)),
  };
}

export const VariantCard = React.forwardRef<HTMLDivElement, VariantCardProps>(
  (
    {
      className,
      variant,
      size,
      rounded,
      shadow,
      accent = false,
      hoverable = false,
      hoverScale = 1.02,
      hoverTranslateY = -4,
      glowOnHover = false,
      pulse = false,
      float = false,
      allowOverflow = false,
      fullWidth = false,
      transitionDuration = 300,
      fadeIn = false,
      fadeInDelay = 0,
      glowColor,
      pattern = "none",
      overlayOpacity = 0.05,
      children,
      style,
      ...props
    },
    ref,
  ) => {
    const [systemProps, otherProps] = extractSystemProps(props);
    const systemStyles = convertSystemProps(systemProps);
    const [isVisible, setIsVisible] = React.useState(!fadeIn);

    React.useEffect(() => {
      if (fadeIn) {
        const timer = setTimeout(() => setIsVisible(true), fadeInDelay);
        return () => clearTimeout(timer);
      }
    }, [fadeIn, fadeInDelay]);

    const accentConfig = resolveVariantAccent(accent);

    const accentGradient =
      accentConfig?.gradient ||
      "linear-gradient(120deg, var(--primary) 0%, var(--secondary) 50%, var(--accent) 100%)";

    const finalGlowColor = glowColor || "var(--primary)";

    const getAccentStyles = (): React.CSSProperties => {
      if (!accentConfig) return {};

      const position = accentConfig.position || "top";
      const size = accentConfig.size || 4;

      const baseStyles: React.CSSProperties = {
        background: accentGradient,
        content: '""',
        position: "absolute",
        transition: `all ${transitionDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
      };

      switch (position) {
        case "top":
          return {
            ...baseStyles,
            height: `${size}px`,
            left: 0,
            right: 0,
            top: 0,
          };
        case "bottom":
          return {
            ...baseStyles,
            bottom: 0,
            height: `${size}px`,
            left: 0,
            right: 0,
          };
        case "left":
          return {
            ...baseStyles,
            bottom: 0,
            left: 0,
            top: 0,
            width: `${size}px`,
          };
        case "right":
          return {
            ...baseStyles,
            bottom: 0,
            right: 0,
            top: 0,
            width: `${size}px`,
          };
        default:
          return baseStyles;
      }
    };

    const patternStyles = React.useMemo(() => {
      if (pattern === "none") return {};

      const patterns = {
        dots: "radial-gradient(circle at 1px 1px, var(--muted-foreground) 1px, transparent 0)",
        grid: "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
      };

      return {
        backgroundImage: patterns[pattern as keyof typeof patterns as keyof typeof patterns],
        backgroundPosition: pattern === "dots" ? "0 0" : "0 0",
        backgroundSize: pattern === "dots" ? "20px 20px" : "20px 20px",
      };
    }, [pattern]);

    const combinedStyles = variantCardStyle({
      allowOverflow,
      fadeIn,
      finalGlowColor,
      fullWidth,
      glowOnHover,
      hoverable,
      hoverScale,
      hoverTranslateY,
      isVisible,
      patternStyles,
      style,
      systemStyles,
      transitionDuration,
    });

    return (
      <div
        className={cn(
          variantCardVariants({ rounded, shadow, size, variant }),
          {
            "animate-float": float,
            "animate-pulse": pulse,
            "cursor-pointer": hoverable,
          },
          className,
        )}
        data-glow-hover={glowOnHover}
        data-interactive-hover={hoverable}
        ref={ref}
        style={combinedStyles}
        {...otherProps}
      >
        {accentConfig && (
          <div
            aria-hidden="true"
            className={cn("pointer-events-none absolute z-10", hoverable && "group-hover:h-[6px]")}
            style={getAccentStyles()}
          />
        )}

        {pattern !== "none" && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0"
            style={{
              background: "var(--muted)",
              mixBlendMode: "multiply",
              opacity: overlayOpacity,
            }}
          />
        )}

        <div className={cn("relative z-10", pattern !== "none" && "relative")}>{children}</div>
      </div>
    );
  },
);

VariantCard.displayName = "VariantCard";

export const VariantCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & SystemProps
>(({ className, children, ...props }, ref) => {
  const [systemProps, otherProps] = extractSystemProps(props);
  const systemStyles = convertSystemProps(systemProps);

  return (
    <div
      className={cn("mb-4 flex flex-col space-y-1.5", className)}
      ref={ref}
      style={systemStyles}
      {...otherProps}
    >
      {children}
    </div>
  );
});
VariantCardHeader.displayName = "VariantCardHeader";

export const VariantCardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement> & SystemProps
>(({ className, children, ...props }, ref) => {
  const [systemProps, otherProps] = extractSystemProps(props);
  const systemStyles = convertSystemProps(systemProps);

  return (
    <h3
      className={cn(
        "text-2xl font-semibold leading-none tracking-tight text-foreground",
        className,
      )}
      ref={ref}
      style={systemStyles}
      {...otherProps}
    >
      {children}
    </h3>
  );
});
VariantCardTitle.displayName = "VariantCardTitle";

export const VariantCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement> & SystemProps
>(({ className, children, ...props }, ref) => {
  const [systemProps, otherProps] = extractSystemProps(props);
  const systemStyles = convertSystemProps(systemProps);

  return (
    <p
      className={cn("text-sm text-muted-foreground", className)}
      ref={ref}
      style={systemStyles}
      {...otherProps}
    >
      {children}
    </p>
  );
});
VariantCardDescription.displayName = "VariantCardDescription";

export const VariantCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & SystemProps
>(({ className, children, ...props }, ref) => {
  const [systemProps, otherProps] = extractSystemProps(props);
  const systemStyles = convertSystemProps(systemProps);

  return (
    <div className={cn("pt-0", className)} ref={ref} style={systemStyles} {...otherProps}>
      {children}
    </div>
  );
});
VariantCardContent.displayName = "VariantCardContent";

export const VariantCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & SystemProps
>(({ className, children, ...props }, ref) => {
  const [systemProps, otherProps] = extractSystemProps(props);
  const systemStyles = convertSystemProps(systemProps);

  return (
    <div
      className={cn("flex items-center pt-4", className)}
      ref={ref}
      style={systemStyles}
      {...otherProps}
    >
      {children}
    </div>
  );
});
VariantCardFooter.displayName = "VariantCardFooter";

export default VariantCard;
