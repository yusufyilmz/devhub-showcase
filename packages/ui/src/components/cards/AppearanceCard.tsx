import { forwardRef, type ReactNode } from "react";

import { cn } from "cn";

import { Card } from "../card/Card";

const GRADIENT_MAP = {
  default: "bg-card",
  header: "bg-gradient-to-br from-card to-card/80",
  muted: "bg-gradient-to-br from-card/95 to-card/90",
  none: "bg-card",
  subtle: "bg-gradient-to-br from-card to-card/95",
} as const;

export type AppearanceCardAppearance = keyof typeof GRADIENT_MAP;

type AccentConfig = {
  gradient?: string;
  position?: "top" | "bottom";
  height?: number;
  borderRadius?: string | number;
};

export interface AppearanceCardProps extends Omit<React.ComponentProps<typeof Card>, "children"> {
  accent?: boolean | AccentConfig;
  /**
   * Allow child elements (e.g. hover glows) to render outside the card bounds
   * @default false
   */
  allowOverflow?: boolean;
  appearance?: AppearanceCardAppearance | "none";

  children?: ReactNode;
  /**
   * Enable glow effect on hover
   * @default false
   */
  enableGlow?: boolean;
  /**
   * Enable hover effects
   * @default false
   */
  enableHover?: boolean;
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
   * Enable interactive elevation change
   * @default false
   */
  interactiveElevation?: boolean;
  /**
   * Transition duration in ms
   * @default 300
   */
  transitionDuration?: number;
}

function resolveAccent(accent: boolean | AccentConfig | undefined): AccentConfig | null {
  if (typeof accent !== "boolean") return accent ?? null;
  if (accent) return {};
  return null;
}

function appearanceCardClasses({
  allowOverflow,
  appearance,
  className,
  enableGlow,
  enableHover,
  interactiveElevation,
}: {
  allowOverflow: boolean;
  appearance: AppearanceCardAppearance | "none";
  className?: string;
  enableGlow: boolean;
  enableHover: boolean;
  interactiveElevation: boolean;
}) {
  const appearanceClass =
    GRADIENT_MAP[appearance as AppearanceCardAppearance] ?? GRADIENT_MAP.default;
  return cn(
    appearanceClass,
    "relative border shadow-sm backdrop-blur-sm",
    allowOverflow ? "overflow-visible" : "overflow-hidden",
    enableHover && "cursor-pointer transition-all hover:border-primary/30 hover:shadow-md",
    enableHover && interactiveElevation && "hover:shadow-xl",
    enableHover && enableGlow && "hover:shadow-primary/20 hover:brightness-105",
    className,
  );
}

function appearanceCardStyle({
  enableHover,
  hoverScale,
  hoverTranslateY,
  transitionDuration,
}: {
  enableHover: boolean;
  hoverScale: number;
  hoverTranslateY: number;
  transitionDuration: number;
}) {
  return {
    transitionDuration: `${transitionDuration}ms`,
    transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
    ...(enableHover && {
      "--hover-scale": hoverScale,
      "--hover-translate-y": `${hoverTranslateY}px`,
    }),
  } as React.CSSProperties;
}

function AppearanceAccent({
  accentConfig,
  transitionDuration,
}: {
  accentConfig: AccentConfig | null;
  transitionDuration: number;
}) {
  if (!accentConfig) return null;
  const atBottom = accentConfig.position === "bottom";
  return (
    <div
      className={cn("absolute left-0 right-0 transition-all", atBottom ? "bottom-0" : "top-0")}
      style={{
        background:
          accentConfig.gradient ??
          "linear-gradient(90deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 50%, hsl(var(--info)) 100%)",
        borderRadius: accentConfig.borderRadius ?? (atBottom ? "0 0 12px 12px" : "12px 12px 0 0"),
        height: `${accentConfig.height ?? 4}px`,
        transitionDuration: `${transitionDuration}ms`,
      }}
    />
  );
}

export const AppearanceCard = forwardRef<HTMLDivElement, AppearanceCardProps>(
  (
    {
      appearance = "default",
      accent = false,
      allowOverflow = false,
      enableHover = false,
      hoverScale = 1.02,
      hoverTranslateY = -4,
      enableGlow = false,
      interactiveElevation = false,
      transitionDuration = 300,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const accentConfig = resolveAccent(accent);
    const classes = appearanceCardClasses({
      allowOverflow,
      appearance,
      className,
      enableGlow,
      enableHover,
      interactiveElevation,
    });
    const style = appearanceCardStyle({
      enableHover,
      hoverScale,
      hoverTranslateY,
      transitionDuration,
    });

    return (
      <Card
        className={classes}
        ref={ref}
        style={style}
        {...props}
        onMouseEnter={(event: React.MouseEvent<HTMLDivElement>) => {
          if (enableHover) {
            event.currentTarget.style.transform =
              "scale(var(--hover-scale)) translateY(var(--hover-translate-y))";
          }
        }}
        onMouseLeave={(event: React.MouseEvent<HTMLDivElement>) => {
          if (enableHover) {
            event.currentTarget.style.transform = "";
          }
        }}
      >
        <AppearanceAccent accentConfig={accentConfig} transitionDuration={transitionDuration} />
        {children}
      </Card>
    );
  },
);

AppearanceCard.displayName = "AppearanceCard";

export default AppearanceCard;
