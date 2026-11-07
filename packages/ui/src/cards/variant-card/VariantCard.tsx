"use client";

import React from "react";

import { cn } from "cn";

import { convertSystemProps, extractSystemProps, type SystemProps } from "../../utils/system-props";
import {
  variantCardInlineStyle1,
  variantCardStyle,
  variantCardStyles,
  variantCardVariants,
} from "../styles";
import type {
  VariantCardAccentConfig as AccentConfig,
  ResolveVariantAccentOptions,
  VariantCardProps,
} from "../types";

function resolveVariantAccent(accent: ResolveVariantAccentOptions): AccentConfig | null {
  if (typeof accent !== "boolean") return accent ?? null;
  if (accent) return {};
  return null;
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
            className={cn(
              variantCardStyles.variantCard,
              hoverable && variantCardStyles.variantCard2,
            )}
            style={getAccentStyles()}
          />
        )}

        {pattern !== "none" && (
          <div
            aria-hidden="true"
            className={variantCardStyles.element1}
            style={variantCardInlineStyle1(overlayOpacity)}
          />
        )}

        <div
          className={cn(
            variantCardStyles.variantCard3,
            pattern !== "none" && variantCardStyles.variantCard4,
          )}
        >
          {children}
        </div>
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
      className={cn(variantCardStyles.variantCardHeader, className)}
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
      className={cn(variantCardStyles.variantCardTitle, className)}
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
      className={cn(variantCardStyles.variantCardDescription, className)}
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
    <div
      className={cn(variantCardStyles.variantCardContent, className)}
      ref={ref}
      style={systemStyles}
      {...otherProps}
    >
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
      className={cn(variantCardStyles.variantCardFooter, className)}
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

export type { VariantCardProps } from "../types";
