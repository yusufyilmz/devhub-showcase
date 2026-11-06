"use client";

import type { JSX } from "react";

import { IconButton } from "../../buttons/icon-button";

interface HeadingLinkProps {
  id: string;
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

// Trello UI adapter: map Trello's expected UI primitives to @shared/ui
// and lightweight wrappers so Trello components can use a unified API.

// Buttons
// Headers and common components
// Typography adapters

// Trello UI adapter: map Trello's expected UI primitives to @shared/ui
// and lightweight wrappers so Trello components can use a unified API.

// Buttons
// Headers and common components
// Typography adapters

import type React from "react";

import { useNotification } from "@shared/runtime/notifications";

import { Flex } from "../flex";

type BaseTextProps = React.HTMLAttributes<HTMLElement> & {
  color?: string;
  size?: "xs" | "s" | "m" | "l" | "xl";
};

// Heading: level 1..6
export const Heading = ({
  level = 3,
  children,
  style,
  ...rest
}: BaseTextProps & { level?: 1 | 2 | 3 | 4 | 5 | 6 }) => {
  const tag = `h${level}` as unknown as keyof JSX.IntrinsicElements;
  const Comp = tag as any;
  return (
    <Comp style={style} {...rest}>
      {children}
    </Comp>
  );
};

export const HeadingLink: React.FC<HeadingLinkProps> = ({ id, level, children, style }) => {
  const { addNotification } = useNotification();

  const copyURL = (id: string): void => {
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    navigator.clipboard.writeText(url).then(
      () => {
        addNotification({
          variant: "success",
          message: "Link copied to clipboard.",
        });
      },
      () => {
        addNotification({
          variant: "danger",
          message: "Failed to copy link.",
        });
      },
    );
  };

  const variantMap = {
    1: "display-strong-xs",
    2: "heading-strong-xl",
    3: "heading-strong-l",
    4: "heading-strong-m",
    5: "heading-strong-s",
    6: "heading-strong-xs",
  } as const;

  const variant = variantMap[level];
  const asTag = `h${level}` as keyof JSX.IntrinsicElements;

  return (
    <Flex
      style={style}
      onClick={() => copyURL(id)}
      className={styles.control}
      vertical="center"
      gap="4"
    >
      <Heading className={styles.text} id={id} variant={variant} as={asTag}>
        {children}
      </Heading>
      <IconButton
        className={styles.visibility}
        size="s"
        icon="openLink"
        variant="ghost"
        tooltip="Copy"
        tooltipPosition="right"
      />
    </Flex>
  );
};
