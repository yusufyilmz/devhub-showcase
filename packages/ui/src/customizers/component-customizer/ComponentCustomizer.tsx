"use client";

import * as React from "react";
import { useState } from "react";

import { cn } from "cn";

import { Button } from "../../buttons/button";
import { IconButton } from "../../buttons/icon-button";
import { Card, CardContent, CardHeader, CardTitle } from "../../cards";
import { CodeBlock } from "../../display/code";
import { Typography } from "../../display/typography";
import { Checkbox } from "../../forms/checkbox";
import { Input } from "../../forms/input";
import { Input as LibraryInput } from "../../forms/input/Input";
import { Label } from "../../forms/label";
import { Label as LibraryLabel } from "../../forms/label/Label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../forms/select";
import { FlexBetween, FlexCenter, FlexCol, FlexRow } from "../../layout/flex";
import { componentCustomizerStyles, customizerVariants } from "../customizers/styles";
import type { ComponentCustomizerProps } from "../customizers/types";

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
          <LibraryLabel className={componentCustomizerStyles.element1} unstyled>
            <LibraryInput type="hidden" unstyled value={value} />
            <Checkbox
              checked={Boolean(value)}
              onCheckedChange={(checked) => handlePropChange(key, checked === true)}
            />
            {key}
          </LibraryLabel>
        );
      case "string":
        return (
          <FlexCol gap="sm">
            <Label className={componentCustomizerStyles.element2}>{key}</Label>
            <Input
              className={componentCustomizerStyles.element3}
              onChange={(e) => handlePropChange(key, e.target.value)}
              placeholder={`Enter ${key}...`}
              value={value || ""}
            />
          </FlexCol>
        );
      case "number":
        return (
          <FlexCol gap="sm">
            <Label className={componentCustomizerStyles.element4}>{key}</Label>
            <Input
              className={componentCustomizerStyles.element5}
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
            <Label className={componentCustomizerStyles.element6}>{key}</Label>
            <Select onValueChange={(next) => handlePropChange(key, next)} value={value || ""}>
              <SelectTrigger className={componentCustomizerStyles.element7}>
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
            <Label className={componentCustomizerStyles.element8}>{key}</Label>
            <Input
              className={componentCustomizerStyles.element9}
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
            <Typography className={componentCustomizerStyles.element10} variant="h3">
              {componentName} Customizer
            </Typography>
            {componentDescription && (
              <Typography className={componentCustomizerStyles.element11} variant="body2">
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
        <FlexCol className={componentCustomizerStyles.element12} gap="lg">
          {/* Live Preview */}
          <Card className={componentCustomizerStyles.element13}>
            <CardHeader>
              <CardTitle className={componentCustomizerStyles.element14}>Live Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <FlexCenter className={componentCustomizerStyles.element15}>
                {React.cloneElement(children as React.ReactElement, customProps)}
              </FlexCenter>
            </CardContent>
          </Card>

          {/* Code Panel */}
          {showCodePanel && (
            <Card className={componentCustomizerStyles.element16}>
              <CardHeader>
                <FlexBetween>
                  <CardTitle className={componentCustomizerStyles.element17}>
                    Generated Code
                  </CardTitle>
                  <Button
                    className={componentCustomizerStyles.element18}
                    onClick={() => navigator.clipboard.writeText(generateCode())}
                    size="sm"
                    variant="outline"
                  >
                    📋 Copy
                  </Button>
                </FlexBetween>
              </CardHeader>
              <CardContent>
                <CodeBlock className={componentCustomizerStyles.element19}>
                  {generateCode()}
                </CodeBlock>
              </CardContent>
            </Card>
          )}
        </FlexCol>

        {/* Props Panel */}
        {showPropsPanel && (
          <Card className={componentCustomizerStyles.element20}>
            <CardHeader>
              <CardTitle className={componentCustomizerStyles.element21}>Props</CardTitle>
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

export type { ComponentCustomizerProps } from "../customizers/types";
