import { forwardRef } from "react";

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
          <div className={paperStyles.element1} style={paperInlineStyle1(accentGradient)} />
        )}
        {children}
      </div>
    );
  },
);

export type { PaperProps } from "./types";
