"use client";

import { useState } from "react";

import { cn } from "cn";

import { Button } from "../../buttons/button/Button";
import { Typography } from "../../display/typography/Typography";
import { Badge } from "../../feedback/badge/Badge";
import { Flex, FlexRow } from "../flex/Flex";
import { colorSchemeClasses, sectionHeaderStyles } from "./styles";
import type { SectionHeaderProps } from "./types";

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
      sectionHeaderStyles.baseClasses,
      (onClick || collapsible) && sectionHeaderStyles.baseClasses2,
    );

    switch (variant) {
      case "card":
        return cn(
          baseClasses,
          sectionHeaderStyles.getContainerClasses,
          colorSchemeClasses[colorScheme],
          sectionHeaderStyles.getContainerClasses2,
        );
      case "minimal":
        return cn(
          baseClasses,
          sectionHeaderStyles.getContainerClasses3,
          sectionHeaderStyles.getContainerClasses4,
        );
      default:
        return cn(
          baseClasses,
          sectionHeaderStyles.getContainerClasses5,
          sectionHeaderStyles.getContainerClasses6,
        );
    }
  };

  return (
    <div className={cn(getContainerClasses(), className)} onClick={handleClick}>
      {/* Icon */}
      <div
        className={cn(
          sectionHeaderStyles.sectionHeader,
          colorSchemeClasses[colorScheme].split(" ")[0],
        )}
      >
        {icon}
      </div>

      {/* Content */}
      <Flex className={sectionHeaderStyles.element1} direction="column" gap="sm">
        <FlexRow align="center" gap="sm">
          <Typography
            className={cn(
              sectionHeaderStyles.sectionHeader2,
              variant === "standard" && sectionHeaderStyles.sectionHeader3,
              sectionHeaderStyles.sectionHeader4,
            )}
            variant="subtitle2"
          >
            {title}
          </Typography>

          {badge && (
            <Badge
              className={cn(sectionHeaderStyles.sectionHeader5, colorSchemeClasses[colorScheme])}
              variant="secondary"
            >
              {badge}
            </Badge>
          )}
        </FlexRow>

        {subtitle && (
          <Typography className={sectionHeaderStyles.element2} variant="caption">
            {subtitle}
          </Typography>
        )}
      </Flex>

      {/* Expand/Collapse Button */}
      {collapsible && (
        <Button
          className={cn(
            sectionHeaderStyles.sectionHeader6,
            expanded && sectionHeaderStyles.sectionHeader7,
          )}
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

export type { SectionHeaderProps } from "./types";
