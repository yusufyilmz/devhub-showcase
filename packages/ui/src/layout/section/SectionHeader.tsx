"use client";

import type React from "react";
import { useState } from "react";

import { cn } from "cn";

import { Button } from "../../buttons/button/Button";
import { Typography } from "../../display/typography/Typography";
import { Badge } from "../../feedback/badge/Badge";
import { Flex, FlexRow } from "../flex/Flex";

// Simple Chevron Down icon as SVG
const ChevronDownIcon = () => (
  <svg
    fill="none"
    height="16"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
    width="16"
    xmlns="http://www.w3.org/2000/svg"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

export interface SectionHeaderProps {
  /**
   * Optional badge content (number or text)
   */
  badge?: string | number;
  /**
   * Additional className
   */
  className?: string;
  /**
   * Whether the section is collapsible
   * @default false
   */
  collapsible?: boolean;
  /**
   * Color scheme for the header
   * @default 'primary'
   */
  colorScheme?: "primary" | "secondary" | "success" | "warning" | "error" | "info";
  /**
   * Whether the section is expanded (only used if collapsible)
   * @default true
   */
  defaultExpanded?: boolean;
  /**
   * Icon to display
   */
  icon: React.ReactNode;
  /**
   * Click handler for the entire header
   */
  onClick?: () => void;
  /**
   * Callback when expand state changes
   */
  onExpandChange?: (expanded: boolean) => void;
  /**
   * Optional subtitle
   */
  subtitle?: string;
  /**
   * Section title
   */
  title: string;
  /**
   * Visual variant
   * @default 'standard'
   */
  variant?: "standard" | "card" | "minimal";
}

const colorSchemeClasses = {
  error: "text-destructive bg-destructive/5 border-destructive/20",
  info: "text-info bg-info/5 border-info/20",
  primary: "text-primary bg-primary/5 border-primary/20",
  secondary: "text-secondary bg-secondary/5 border-secondary/20",
  success: "text-success bg-success/5 border-success/20",
  warning: "text-warning bg-warning/5 border-warning/20",
};

export const SectionHeader = ({
  icon,
  title,
  subtitle,
  badge,
  collapsible = false,
  defaultExpanded = true,
  onExpandChange,
  colorScheme = "primary",
  variant = "standard",
  onClick,
  className,
}: SectionHeaderProps) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const handleClick = () => {
    if (collapsible) {
      const newExpanded = !expanded;
      setExpanded(newExpanded);
      onExpandChange?.(newExpanded);
    }
    onClick?.();
  };

  const getContainerClasses = () => {
    const baseClasses = cn(
      "flex items-center gap-3 transition-all",
      (onClick || collapsible) && "cursor-pointer",
    );

    switch (variant) {
      case "card":
        return cn(
          baseClasses,
          "p-4 rounded-lg border",
          colorSchemeClasses[colorScheme],
          "hover:bg-opacity-80",
        );
      case "minimal":
        return cn(baseClasses, "py-2 px-0", "hover:opacity-80");
      default:
        return cn(baseClasses, "p-4 pb-2 border-b border-border/40", "hover:bg-accent/50");
    }
  };

  return (
    <div className={cn(getContainerClasses(), className)} onClick={handleClick}>
      {/* Icon */}
      <div
        className={cn(
          "flex items-center justify-center",
          colorSchemeClasses[colorScheme].split(" ")[0],
        )}
      >
        {icon}
      </div>

      {/* Content */}
      <Flex className="flex-1" direction="column" gap="sm">
        <FlexRow align="center" gap="sm">
          <Typography
            className={cn(
              "font-semibold text-sm tracking-wide",
              variant === "standard" && "uppercase",
              "transition-colors",
            )}
            variant="subtitle2"
          >
            {title}
          </Typography>

          {badge && (
            <Badge className={cn("text-xs", colorSchemeClasses[colorScheme])} variant="secondary">
              {badge}
            </Badge>
          )}
        </FlexRow>

        {subtitle && (
          <Typography className="text-muted-foreground" variant="caption">
            {subtitle}
          </Typography>
        )}
      </Flex>

      {/* Expand/Collapse Button */}
      {collapsible && (
        <Button
          className={cn("shrink-0 transition-transform", expanded && "rotate-180")}
          size="icon"
          variant="ghost"
        >
          <ChevronDownIcon />
        </Button>
      )}
    </div>
  );
};

SectionHeader.displayName = "SectionHeader";

export default SectionHeader;
