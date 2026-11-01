import type React from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Card } from "../card";
import { FlexCol } from "../flex";
import { Typography } from "../typography";
import { ThemeCustomizer } from "./ThemeCustomizer";

/**
 * Demo component showcasing the ThemeCustomizer
 */
const ThemeCustomizerDemo: React.FC = () => {
  return (
    <FlexCol className="p-8" gap="lg">
      <div>
        <Typography className="font-bold mb-4" variant="h1">
          Theme Customizer Demo
        </Typography>
        <Typography className="text-[var(--muted-foreground)] mb-8" variant="body1">
          Interactive theme customization tool for your design system. Adjust colors, spacing,
          shadows, and more to see real-time changes.
        </Typography>
      </div>

      <Card className="p-6">
        <Typography className="font-semibold mb-4" variant="h3">
          🎨 Live Theme Customizer
        </Typography>
        <Typography className="text-[var(--muted-foreground)] mb-6" variant="body2">
          Use the controls below to customize your theme. Changes are applied instantly and you can
          copy the generated code to use in your projects.
        </Typography>

        <ThemeCustomizer
          onBorderChange={(border) => console.log("Border changed:", border)}
          onBrandChange={(brand) => console.log("Brand changed:", brand)}
          onRadiusChange={(radius) => console.log("Radius changed:", radius)}
          onShadowChange={(shadow) => console.log("Shadow changed:", shadow)}
          onSpacingChange={(spacing) => console.log("Spacing changed:", spacing)}
          onThemeChange={(theme) => console.log("Theme changed:", theme)}
          onTransitionChange={(transition) => console.log("Transition changed:", transition)}
          showCode={true}
          showPreview={true}
          showReset={true}
        />
      </Card>

      <Card className="p-6">
        <Typography className="font-semibold mb-4" variant="h3">
          🚀 Features
        </Typography>
        <FlexCol gap="md">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🎨</span>
            <div>
              <Typography className="font-semibold" variant="h6">
                Theme & Brand Colors
              </Typography>
              <Typography className="text-[var(--muted-foreground)]" variant="body2">
                Switch between light/dark themes and customize brand colors
              </Typography>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-2xl">🎯</span>
            <div>
              <Typography className="font-semibold" variant="h6">
                Visual Style Controls
              </Typography>
              <Typography className="text-[var(--muted-foreground)]" variant="body2">
                Adjust borders, shadows, spacing, and border radius
              </Typography>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-2xl">⚡</span>
            <div>
              <Typography className="font-semibold" variant="h6">
                Live Preview
              </Typography>
              <Typography className="text-[var(--muted-foreground)]" variant="body2">
                See changes instantly with real component examples
              </Typography>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-2xl">📋</span>
            <div>
              <Typography className="font-semibold" variant="h6">
                Code Generation
              </Typography>
              <Typography className="text-[var(--muted-foreground)]" variant="body2">
                Copy generated code to apply your theme programmatically
              </Typography>
            </div>
          </div>
        </FlexCol>
      </Card>
    </FlexCol>
  );
};

const meta = {
  component: ThemeCustomizerDemo,
  parameters: { layout: "fullscreen" },
  title: "Components/ThemeCustomizer",
} satisfies Meta<typeof ThemeCustomizerDemo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Demo: Story = {};
