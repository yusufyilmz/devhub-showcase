"use client";

import * as React from "react";
import { useState } from "react";

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";

import { Button } from "../Button";
import { Card, CardContent, CardHeader, CardTitle } from "../Card";
import { Checkbox } from "../Checkbox";
import { CodeBlock } from "../Code";
import { FlexBetween, FlexCenter, FlexCol, FlexRow } from "../Flex";
import { Input } from "../Input";
import { IconButton } from "../icon-button";
import { Label } from "../Label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../Select";
import { Typography } from "../Typography";

const customizerVariants = cva(
  "w-full max-w-4xl mx-auto p-6 bg-[var(--background)] border border-[var(--border)] rounded-lg shadow-lg",
  {
    defaultVariants: {
      size: "md",
      theme: "auto",
    },
    variants: {
      size: {
        full: "max-w-none",
        lg: "max-w-6xl",
        md: "max-w-4xl",
        sm: "max-w-2xl",
      },
      theme: {
        auto: "bg-[var(--background)] text-[var(--foreground)]",
        dark: "bg-gray-900 text-white",
        light: "bg-white text-gray-900",
      },
    },
  },
);

export interface ComponentCustomizerProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof customizerVariants> {
  children: React.ReactNode;
  componentDescription?: string;
  componentName: string;
  onPropsChange?: (props: Record<string, any>) => void;
  propsConfig?: Record<string, any>;
  showCode?: boolean;
  showProps?: boolean;
  showTheme?: boolean;
}

export function ComponentCustomizer({
  componentName,
  componentDescription,
  children,
  propsConfig = {},
  onPropsChange,
  showCode = true,
  showProps = true,
  showTheme = true,
  size,
  theme,
  className,
  ...props
}: ComponentCustomizerProps) {
  const [customProps, setCustomProps] = useState<Record<string, any>>(propsConfig);
  const [selectedTheme, setSelectedTheme] = useState<"light" | "dark" | "auto">("auto");
  const [showCodePanel, setShowCodePanel] = useState(showCode);
  const [showPropsPanel, setShowPropsPanel] = useState(showProps);

  const handlePropChange = (key: string, value: any) => {
    const newProps = { ...customProps, [key]: value };
    setCustomProps(newProps);
    onPropsChange?.(newProps);
  };

  const generateCode = () => {
    const propsString = Object.entries(customProps)
      .filter(([_, value]) => value !== undefined && value !== "")
      .map(([key, value]) => {
        if (typeof value === "string") {
          return `${key}="${value}"`;
        }
        return `${key}={${JSON.stringify(value)}}`;
      })
      .join(" ");

    return `<${componentName}${propsString ? ` ${propsString}` : ""} />`;
  };

  const renderPropControl = (key: string, value: any, type: string) => {
    switch (type) {
      case "boolean":
        return (
          <label className="flex items-center gap-2 text-foreground">
            <input type="hidden" value={value} />
            <Checkbox
              checked={Boolean(value)}
              onCheckedChange={(checked) => handlePropChange(key, checked === true)}
            />
            {key}
          </label>
        );
      case "string":
        return (
          <FlexCol gap="sm">
            <Label className="text-[var(--foreground)]">{key}</Label>
            <Input
              className="h-8 bg-[var(--background)] border-[var(--border)] text-[var(--foreground)]"
              onChange={(e) => handlePropChange(key, e.target.value)}
              placeholder={`Enter ${key}...`}
              value={value || ""}
            />
          </FlexCol>
        );
      case "number":
        return (
          <FlexCol gap="sm">
            <Label className="text-[var(--foreground)]">{key}</Label>
            <Input
              className="h-8 bg-[var(--background)] border-[var(--border)] text-[var(--foreground)]"
              onChange={(e) => handlePropChange(key, Number(e.target.value))}
              placeholder={`Enter ${key}...`}
              type="number"
              value={value || ""}
            />
          </FlexCol>
        );
      case "select":
        return (
          <FlexCol gap="sm">
            <Label className="text-[var(--foreground)]">{key}</Label>
            <Select onValueChange={(next) => handlePropChange(key, next)} value={value || ""}>
              <SelectTrigger className="bg-[var(--background)] border-[var(--border)] text-[var(--foreground)]">
                <SelectValue placeholder={`Select ${key}...`} />
              </SelectTrigger>
              <SelectContent>
                {["primary", "secondary", "outline", "ghost", "destructive"].map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FlexCol>
        );
      default:
        return (
          <FlexCol gap="sm">
            <Label className="text-[var(--foreground)]">{key}</Label>
            <Input
              className="h-8 bg-[var(--background)] border-[var(--border)] text-[var(--foreground)]"
              onChange={(e) => handlePropChange(key, e.target.value)}
              placeholder={`Enter ${key}...`}
              value={value || ""}
            />
          </FlexCol>
        );
    }
  };

  return (
    <FlexCol className={cn(customizerVariants({ className, size, theme }))} gap="lg" {...props}>
      {/* Header */}
      <FlexCol gap="md">
        <FlexBetween>
          <FlexCol gap="sm">
            <Typography className="font-bold text-[var(--foreground)]" variant="h3">
              {componentName} Customizer
            </Typography>
            {componentDescription && (
              <Typography className="text-[var(--muted-foreground)]" variant="body2">
                {componentDescription}
              </Typography>
            )}
          </FlexCol>
          <FlexRow gap="sm">
            {showTheme && (
              <Select
                onValueChange={(next) => setSelectedTheme(next as "light" | "dark" | "auto")}
                value={selectedTheme}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select theme..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto Theme</SelectItem>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                </SelectContent>
              </Select>
            )}
            <IconButton
              aria-label="Toggle code panel"
              onClick={() => setShowCodePanel(!showCodePanel)}
              size="sm"
              variant="outline"
            >
              {showCodePanel ? "👁️" : "👁️‍🗨️"}
            </IconButton>
            <IconButton
              aria-label="Toggle props panel"
              onClick={() => setShowPropsPanel(!showPropsPanel)}
              size="sm"
              variant="outline"
            >
              ⚙️
            </IconButton>
          </FlexRow>
        </FlexBetween>
      </FlexCol>

      <FlexRow align="start" gap="lg">
        {/* Main Content */}
        <FlexCol className="flex-1" gap="lg">
          {/* Live Preview */}
          <Card className="p-6 bg-[var(--card)] border-[var(--border)]">
            <CardHeader>
              <CardTitle className="text-[var(--foreground)]">Live Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <FlexCenter className="min-h-[200px] border-2 border-dashed border-[var(--border)] rounded-lg p-4 bg-[var(--muted)]/20">
                {React.cloneElement(children as React.ReactElement, customProps)}
              </FlexCenter>
            </CardContent>
          </Card>

          {/* Code Panel */}
          {showCodePanel && (
            <Card className="p-6 bg-[var(--card)] border-[var(--border)]">
              <CardHeader>
                <FlexBetween>
                  <CardTitle className="text-[var(--foreground)]">Generated Code</CardTitle>
                  <Button
                    className="bg-[var(--background)] border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]"
                    onClick={() => navigator.clipboard.writeText(generateCode())}
                    size="sm"
                    variant="outline"
                  >
                    📋 Copy
                  </Button>
                </FlexBetween>
              </CardHeader>
              <CardContent>
                <CodeBlock className="bg-[var(--muted)] p-4 rounded-md overflow-x-auto text-sm text-[var(--muted-foreground)]">
                  {generateCode()}
                </CodeBlock>
              </CardContent>
            </Card>
          )}
        </FlexCol>

        {/* Props Panel */}
        {showPropsPanel && (
          <Card className="w-80 p-6 bg-[var(--card)] border-[var(--border)]">
            <CardHeader>
              <CardTitle className="text-[var(--foreground)]">Props</CardTitle>
            </CardHeader>
            <CardContent>
              <FlexCol gap="md">
                {Object.entries(propsConfig).map(([key, value]) => {
                  const type =
                    typeof value === "boolean"
                      ? "boolean"
                      : typeof value === "number"
                        ? "number"
                        : key.includes("variant") || key.includes("size")
                          ? "select"
                          : "string";
                  return (
                    <FlexCol gap="sm" key={key}>
                      {renderPropControl(key, customProps[key] ?? value, type)}
                    </FlexCol>
                  );
                })}
              </FlexCol>
            </CardContent>
          </Card>
        )}
      </FlexRow>
    </FlexCol>
  );
}

// Convenience components for common use cases
export function ButtonCustomizer({
  children,
  ...props
}: Omit<ComponentCustomizerProps, "componentName" | "propsConfig">) {
  return (
    <ComponentCustomizer
      componentDescription="Customize button appearance and behavior"
      componentName="Button"
      propsConfig={{
        children: "Click me",
        disabled: false,
        size: "default",
        variant: "default",
      }}
      {...props}
    >
      {children}
    </ComponentCustomizer>
  );
}

export function CardCustomizer({
  children,
  ...props
}: Omit<ComponentCustomizerProps, "componentName" | "propsConfig">) {
  return (
    <ComponentCustomizer
      componentDescription="Customize card appearance and layout"
      componentName="Card"
      propsConfig={{
        background: "default",
        padding: "md",
        radius: "md",
        shadow: "md",
      }}
      {...props}
    >
      {children}
    </ComponentCustomizer>
  );
}

export function TypographyCustomizer({
  children,
  ...props
}: Omit<ComponentCustomizerProps, "componentName" | "propsConfig">) {
  return (
    <ComponentCustomizer
      componentDescription="Customize typography styles and variants"
      componentName="Typography"
      propsConfig={{
        align: "left",
        children: "Sample text",
        color: "default",
        variant: "body1",
        weight: "normal",
      }}
      {...props}
    >
      {children}
    </ComponentCustomizer>
  );
}
