import type React from "react";
import type { JSX } from "react";

import { Flex, type FlexProps } from "@shared/ui/flex";
import { TextField } from "@shared/ui/text-field";
import { Textarea } from "@shared/ui/textarea";

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

// Text
export const Text = ({ children, color, size, style, ...rest }: BaseTextProps) => {
  const fontSize =
    size === "xs"
      ? "12px"
      : size === "s"
        ? "13px"
        : size === "l"
          ? "16px"
          : size === "xl"
            ? "18px"
            : "14px";
  return (
    <span style={{ color, fontSize, ...(style || {}) }} {...rest}>
      {children}
    </span>
  );
};

// Label (small pill)
export const Label = ({ children, color = "#e2e8f0", small = false, style, ...rest }: any) => {
  return (
    <span
      style={{
        background: color,
        borderRadius: "4px",
        display: "inline-block",
        fontSize: small ? "11px" : "12px",
        lineHeight: 1,
        padding: small ? "2px 6px" : "4px 8px",
        ...(style || {}),
      }}
      {...rest}
    >
      {children}
    </span>
  );
};

const spacingGaps = new Set([
  "none",
  "xs",
  "sm",
  "md",
  "lg",
  "xl",
  "2xl",
  "3xl",
  "4xl",
  "5xl",
  "-1",
]);

type StackProps = Omit<FlexProps, "gap"> & {
  gap?: FlexProps["gap"] | string;
};

export const Stack = ({ gap = "md", style, ...props }: StackProps) => {
  const customGap = typeof gap === "string" && !spacingGaps.has(gap);
  return (
    <Flex
      direction="column"
      gap={customGap ? undefined : (gap as FlexProps["gap"])}
      style={customGap ? { gap, ...style } : style}
      {...props}
    />
  );
};

export const Column = Stack;
export const Row = (props: FlexProps) => <Flex direction="row" {...props} />;
export const Grid = (props: FlexProps) => <Flex gap="md" wrap {...props} />;

// Sidebar from shared UI

export type {
  FlexProps,
  FlexProps as ColumnProps,
  FlexProps as GridProps,
  FlexProps as RowProps,
  StackProps,
};
export { Flex };

// Inputs
export const Input = (props: React.ComponentProps<typeof TextField>) => <TextField {...props} />;
export const TextArea = (
  props: Omit<React.ComponentProps<typeof Textarea>, "rows"> & { rows?: number },
) => <Textarea {...props} rows={props.rows ?? 3} />;

// Modal (Dialog)
// Simple Card primitives used by Trello
export const Card = ({
  children,
  className,
  style,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={className}
    style={{
      background: "white",
      border: "1px solid #e5e7eb",
      borderRadius: 8,
      boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
      padding: 12,
      ...style,
    }}
    {...rest}
  >
    {children}
  </div>
);

export const CardHeader = ({
  children,
  className,
  style,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={className} style={{ marginBottom: 8, ...style }} {...rest}>
    {children}
  </div>
);

export const CardBody = ({
  children,
  className,
  style,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={className} style={{ ...style }} {...rest}>
    {children}
  </div>
);

// Trello-specific containers
export const ListContainer = ({
  children,
  className,
  style,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={className}
    style={{ background: "#f4f5f7", borderRadius: 8, padding: 8, ...style }}
    {...rest}
  >
    {children}
  </div>
);

export const Panel = ({
  children,
  className,
  style,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={className}
    style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 8, ...style }}
    {...rest}
  >
    {children}
  </div>
);

// Board container for full board background
export const BoardContainer = ({
  children,
  className,
  style,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={className}
    style={{
      background: "linear-gradient(135deg, #0079bf, #5067c5)",
      minHeight: "100%",
      padding: 12,
      ...style,
    }}
    {...rest}
  >
    {children}
  </div>
);

// Markdown renderer placeholder (render plain text)
export const MarkdownRenderer = ({ markdown }: { markdown: string }) => {
  return <pre style={{ whiteSpace: "pre-wrap" }}>{markdown}</pre>;
};
