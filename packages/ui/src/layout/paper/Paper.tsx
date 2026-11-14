import type { CSSProperties } from "react";
import { forwardRef } from "react";

import { cn } from "cn";

import {
  accentGradientFor,
  paperClassName,
  paperInlineStyle1,
  paperStyle,
  paperStyles,
} from "./styles";
import type { PaperProps } from "./types";

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
        {...props}
        className={cn(
          enableFade &&
            "motion-safe:animate-[card-entrance_600ms_ease-out_var(--paper-fade-delay)_backwards]",
          classes,
        )}
        ref={ref}
        style={
          {
            "--paper-glow": glowColor ?? "color-mix(in srgb, var(--primary) 20%, transparent)",
            ...style,
          } as CSSProperties
        }
      >
        {showAccent && (
          <div
            aria-hidden="true"
            className={paperStyles.element1}
            style={paperInlineStyle1(accentGradient)}
          />
        )}
        {children}
      </div>
    );
  },
);

export type { PaperProps } from "./types";
