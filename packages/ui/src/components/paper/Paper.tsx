import { forwardRef, type ReactNode } from "react";

import { cn } from "cn";

export interface PaperProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Custom accent colors for the top border (gradient stops)
   */
  accentColors?: [string, string, string];
  /**
   * Allow child elements and shadows to overflow the container
   * @default false
   */
  allowOverflow?: boolean;
  /**
   * Backdrop filter blur amount (px)
   * @default 12
   */
  backdropBlur?: number;
  /**
   * Border radius size
   * @default 'lg'
   */
  borderRadius?: "none" | "sm" | "md" | "lg" | "xl" | "2xl";
  /**
   * Children for the paper
   */
  children?: ReactNode;
  /**
   * Whether to enable fade-in animation
   * @default true
   */
  enableFade?: boolean;
  /**
   * Enable subtle floating animation
   * @default false
   */
  enableFloat?: boolean;
  /**
   * Enable glow effect on hover
   * @default false
   */
  enableGlow?: boolean;
  /**
   * Whether to enable hover effects
   * @default true
   */
  enableHover?: boolean;
  /**
   * Enable pulsing animation
   * @default false
   */
  enablePulse?: boolean;
  /**
   * Use enhanced surface background
   * @default false
   */
  enhancedSurface?: boolean;
  /**
   * Fade animation delay in milliseconds
   * @default 0
   */
  fadeDelay?: number;
  /**
   * Force card shadow
   * @default undefined
   */
  forceCardShadow?: boolean;
  /**
   * Make the paper full width
   * @default false
   */
  fullWidth?: boolean;
  /**
   * Enable glass morphism effect with backdrop filter
   * @default false
   */
  glassEffect?: boolean;
  /**
   * Custom glow color
   */
  glowColor?: string;
  /**
   * Rotation on hover (degrees)
   * @default 0
   */
  hoverRotation?: number;
  /**
   * Transform scale on hover
   * @default 1.02
   */
  hoverScale?: number;
  /**
   * Transform translate Y on hover (negative = up)
   * @default -2
   */
  hoverTranslateY?: number;
  /**
   * Whether to show the top gradient border accent
   * @default true
   */
  showAccent?: boolean;
  /**
   * Spacing preset for common layouts
   * @default 'content'
   */
  spacing?: "content" | "compact" | "spacious" | "none" | "header" | "sidebar";
}

const SPACING_CLASS = {
  compact: "p-4",
  content: "p-6 m-3",
  header: "p-6",
  none: "p-0 m-0",
  sidebar: "p-3",
  spacious: "p-10 m-4",
} as const;

const RADIUS_CLASS = {
  "2xl": "rounded-2xl",
  lg: "rounded-lg",
  md: "rounded-md",
  none: "rounded-none",
  sm: "rounded-sm",
  xl: "rounded-xl",
} as const;

function accentGradientFor(accentColors?: [string, string, string]) {
  if (!accentColors) {
    return "linear-gradient(120deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 50%, hsl(var(--info)) 100%)";
  }
  return `linear-gradient(120deg, ${accentColors[0]} 0%, ${accentColors[1]} 50%, ${accentColors[2]} 100%)`;
}

function paperSurfaceClass(glassEffect: boolean, enhancedSurface: boolean) {
  if (glassEffect) return ["bg-background/80 backdrop-blur-md", "dark:bg-background/60"];
  if (enhancedSurface) {
    return [
      "bg-gradient-to-br from-background to-background/95",
      "dark:from-background dark:to-background/90",
    ];
  }
  return "bg-background";
}

function paperMotionClass({
  enableFloat,
  enableGlow,
  enableHover,
  enablePulse,
  forceCardShadow,
  glowColor,
}: {
  enableFloat: boolean;
  enableGlow: boolean;
  enableHover: boolean;
  enablePulse: boolean;
  forceCardShadow?: boolean;
  glowColor?: string;
}) {
  return cn(
    enableHover && "cursor-pointer hover:border-primary/30",
    enableHover && forceCardShadow !== false && "hover:shadow-lg",
    enablePulse && "animate-pulse",
    enableFloat && "animate-float",
    enableGlow && glowColor && `hover:shadow-[0_0_20px_${glowColor}]`,
    enableGlow && !glowColor && "hover:shadow-primary/20",
  );
}

function paperClassName(options: {
  allowOverflow: boolean;
  borderRadius: keyof typeof RADIUS_CLASS;
  className?: string;
  enableFloat: boolean;
  enableGlow: boolean;
  enableHover: boolean;
  enablePulse: boolean;
  enhancedSurface: boolean;
  forceCardShadow?: boolean;
  fullWidth: boolean;
  glassEffect: boolean;
  glowColor?: string;
  spacing: keyof typeof SPACING_CLASS;
}) {
  return cn(
    "relative border border-border shadow-sm transition-all duration-300",
    RADIUS_CLASS[options.borderRadius],
    SPACING_CLASS[options.spacing] ?? SPACING_CLASS.content,
    options.fullWidth && "w-full",
    paperSurfaceClass(options.glassEffect, options.enhancedSurface),
    options.allowOverflow ? "overflow-visible" : "overflow-hidden",
    paperMotionClass(options),
    options.className,
  );
}

function paperStyle(options: {
  backdropBlur: number;
  enableFade: boolean;
  enableHover: boolean;
  fadeDelay: number;
  glassEffect: boolean;
  hoverRotation: number;
  hoverScale: number;
  hoverTranslateY: number;
  style?: React.CSSProperties;
}) {
  return {
    ...(options.glassEffect && {
      backdropFilter: `blur(${options.backdropBlur}px) saturate(120%)`,
      WebkitBackdropFilter: `blur(${options.backdropBlur}px) saturate(120%)`,
    }),
    ...(options.enableFade && {
      animation: `fadeIn 600ms ease-out ${options.fadeDelay}ms both`,
    }),
    ...(options.enableHover && {
      "--hover-rotation": `${options.hoverRotation}deg`,
      "--hover-scale": options.hoverScale,
      "--hover-translate-y": `${options.hoverTranslateY}px`,
    }),
    ...options.style,
  } as React.CSSProperties;
}

export const Paper = forwardRef<HTMLDivElement, PaperProps>(
  (
    {
      children,
      fullWidth = false,
      showAccent = true,
      enableHover = true,
      enableFade = true,
      accentColors,
      fadeDelay = 0,
      glassEffect = false,
      backdropBlur = 12,
      hoverScale = 1.02,
      hoverTranslateY = -2,
      hoverRotation = 0,
      enablePulse = false,
      enableGlow = false,
      glowColor,
      enableFloat = false,
      allowOverflow = false,
      spacing = "content",
      enhancedSurface = false,
      forceCardShadow,
      borderRadius = "lg",
      className,
      ...props
    },
    ref,
  ) => {
    const accentGradient = accentGradientFor(accentColors);
    const classes = paperClassName({
      allowOverflow,
      borderRadius,
      className,
      enableFloat,
      enableGlow,
      enableHover,
      enablePulse,
      enhancedSurface,
      forceCardShadow,
      fullWidth,
      glassEffect,
      glowColor,
      spacing,
    });
    const style = paperStyle({
      backdropBlur,
      enableFade,
      enableHover,
      fadeDelay,
      glassEffect,
      hoverRotation,
      hoverScale,
      hoverTranslateY,
      style: props.style,
    });

    return (
      <div
        className={classes}
        onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
          if (enableHover) {
            e.currentTarget.style.transform =
              "scale(var(--hover-scale)) translateY(var(--hover-translate-y)) rotate(var(--hover-rotation))";
          }
          props.onMouseEnter?.(e);
        }}
        onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
          if (enableHover) {
            e.currentTarget.style.transform = "";
          }
          props.onMouseLeave?.(e);
        }}
        ref={ref}
        style={style}
        {...props}
      >
        {showAccent && (
          <div
            className="absolute left-0 right-0 top-0 h-1 transition-all"
            style={{
              background: accentGradient,
              zIndex: 1,
            }}
          />
        )}
        {children}
      </div>
    );
  },
);
