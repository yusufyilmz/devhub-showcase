"use client";

import { forwardRef } from "react";

import { cn } from "cn";

import { CardBase as Card } from "./CardBase";
import {
  appearanceCardClasses,
  appearanceCardInlineStyle1,
  appearanceCardStyle,
  appearanceCardStyles,
} from "./styles";
import type {
  AppearanceCardAccentConfig as AccentConfig,
  AppearanceAccentOptions,
  AppearanceCardProps,
  ResolveAccentOptions,
} from "./types";

function resolveAccent(accent: ResolveAccentOptions): AccentConfig | null {
  if (typeof accent !== "boolean") return accent ?? null;
  if (accent) return {};
  return null;
}

function AppearanceAccent({ accentConfig, transitionDuration }: AppearanceAccentOptions) {
  if (!accentConfig) return null;
  const atBottom = accentConfig.position === "bottom";
  return (
    <div
      className={cn(
        appearanceCardStyles.appearanceAccent,
        atBottom ? appearanceCardStyles.appearanceAccent2 : appearanceCardStyles.appearanceAccent3,
      )}
      style={appearanceCardInlineStyle1(
        accentConfig.gradient ??
          "linear-gradient(90deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 50%, hsl(var(--info)) 100%)",
        accentConfig.borderRadius ?? (atBottom ? "0 0 12px 12px" : "12px 12px 0 0"),
        `${accentConfig.height ?? 4}px`,
        `${transitionDuration}ms`,
      )}
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

export type { AppearanceCardAppearance, AppearanceCardProps } from "./types";
