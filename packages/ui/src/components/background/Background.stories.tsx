import type React from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "../button";
import { FlexCol } from "../flex";
import { Typography } from "../typography";
import {
  Background,
  CardBackground,
  GradientBackground,
  PatternBackground,
  PrimaryBackground,
} from "./Background";

/**
 * Demo component showcasing the Background component with theme integration
 */
const BackgroundDemo: React.FC = () => {
  return (
    <FlexCol gap="xl" padding="lg" width="full">
      <Typography variant="h1">Background Component Demo</Typography>

      {/* Basic Background Variants */}
      <FlexCol gap="lg">
        <Typography variant="h2">Basic Background Variants</Typography>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Background className="p-4 rounded-lg" variant="default">
            <Typography variant="h6">Default</Typography>
            <Typography variant="body2">Default background variant</Typography>
          </Background>

          <Background className="p-4 rounded-lg" variant="default">
            <Typography variant="h6">Primary</Typography>
            <Typography variant="body2">Primary background variant</Typography>
          </Background>

          <Background className="p-4 rounded-lg" variant="secondary">
            <Typography variant="h6">Secondary</Typography>
            <Typography variant="body2">Secondary background variant</Typography>
          </Background>

          <Background className="p-4 rounded-lg" variant="accent">
            <Typography variant="h6">Accent</Typography>
            <Typography variant="body2">Accent background variant</Typography>
          </Background>

          <Background className="p-4 rounded-lg" variant="card">
            <Typography variant="h6">Card</Typography>
            <Typography variant="body2">Card background variant</Typography>
          </Background>

          <Background className="p-4 rounded-lg" variant="muted">
            <Typography variant="h6">Muted</Typography>
            <Typography variant="body2">Muted background variant</Typography>
          </Background>
        </div>
      </FlexCol>

      {/* Pattern Backgrounds */}
      <FlexCol gap="lg">
        <Typography variant="h2">Pattern Backgrounds</Typography>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Background className="p-6 rounded-lg" pattern="dots" variant="card">
            <Typography variant="h6">Dots Pattern</Typography>
            <Typography variant="body2">Background with dots pattern</Typography>
          </Background>

          <Background className="p-6 rounded-lg" pattern="grid" variant="card">
            <Typography variant="h6">Grid Pattern</Typography>
            <Typography variant="body2">Background with grid pattern</Typography>
          </Background>

          <Background className="p-6 rounded-lg" pattern="diagonal" variant="card">
            <Typography variant="h6">Diagonal Pattern</Typography>
            <Typography variant="body2">Background with diagonal pattern</Typography>
          </Background>

          <Background className="p-6 rounded-lg" pattern="stripes" variant="card">
            <Typography variant="h6">Stripes Pattern</Typography>
            <Typography variant="body2">Background with stripes pattern</Typography>
          </Background>
        </div>
      </FlexCol>

      {/* Gradient Backgrounds */}
      <FlexCol gap="lg">
        <Typography variant="h2">Gradient Backgrounds</Typography>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Background className="p-6 rounded-lg" gradient="rainbow">
            <Typography className="text-white" variant="h6">
              Rainbow Gradient
            </Typography>
            <Typography className="text-white/90" variant="body2">
              Beautiful rainbow gradient
            </Typography>
          </Background>

          <Background className="p-6 rounded-lg" gradient="sunset">
            <Typography className="text-white" variant="h6">
              Sunset Gradient
            </Typography>
            <Typography className="text-white/90" variant="body2">
              Warm sunset colors
            </Typography>
          </Background>

          <Background className="p-6 rounded-lg" gradient="ocean">
            <Typography className="text-white" variant="h6">
              Ocean Gradient
            </Typography>
            <Typography className="text-white/90" variant="body2">
              Cool ocean blues
            </Typography>
          </Background>

          <Background className="p-6 rounded-lg" gradient="forest">
            <Typography className="text-white" variant="h6">
              Forest Gradient
            </Typography>
            <Typography className="text-white/90" variant="body2">
              Natural forest greens
            </Typography>
          </Background>

          <Background className="p-6 rounded-lg" gradient="fire">
            <Typography className="text-white" variant="h6">
              Fire Gradient
            </Typography>
            <Typography className="text-white/90" variant="body2">
              Hot fire colors
            </Typography>
          </Background>

          <Background className="p-6 rounded-lg" gradient="cosmic">
            <Typography className="text-white" variant="h6">
              Cosmic Gradient
            </Typography>
            <Typography className="text-white/90" variant="body2">
              Mysterious cosmic colors
            </Typography>
          </Background>
        </div>
      </FlexCol>

      {/* Overlay Effects */}
      <FlexCol gap="lg">
        <Typography variant="h2">Overlay Effects</Typography>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Background className="p-6 rounded-lg" overlay="subtle" variant="default">
            <Typography className="text-white" variant="h6">
              Subtle Overlay
            </Typography>
            <Typography className="text-white/90" variant="body2">
              Subtle overlay effect
            </Typography>
          </Background>

          <Background className="p-6 rounded-lg" overlay="medium" variant="default">
            <Typography className="text-white" variant="h6">
              Medium Overlay
            </Typography>
            <Typography className="text-white/90" variant="body2">
              Medium overlay effect
            </Typography>
          </Background>

          <Background className="p-6 rounded-lg" overlay="strong" variant="default">
            <Typography className="text-white" variant="h6">
              Strong Overlay
            </Typography>
            <Typography className="text-white/90" variant="body2">
              Strong overlay effect
            </Typography>
          </Background>

          <Background className="p-6 rounded-lg" overlay="gradient" variant="default">
            <Typography className="text-white" variant="h6">
              Gradient Overlay
            </Typography>
            <Typography className="text-white/90" variant="body2">
              Gradient overlay effect
            </Typography>
          </Background>
        </div>
      </FlexCol>

      {/* Animations */}
      <FlexCol gap="lg">
        <Typography variant="h2">Animated Backgrounds</Typography>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Background animation="pulse" className="p-6 rounded-lg" variant="default">
            <Typography className="text-white" variant="h6">
              Pulsing
            </Typography>
            <Typography className="text-white/90" variant="body2">
              Pulsing animation
            </Typography>
          </Background>

          <Background animation="bounce" className="p-6 rounded-lg" variant="accent">
            <Typography className="text-white" variant="h6">
              Bouncing
            </Typography>
            <Typography className="text-white/90" variant="body2">
              Bouncing animation
            </Typography>
          </Background>

          <Background animation="ping" className="p-6 rounded-lg" variant="success">
            <Typography className="text-white" variant="h6">
              Pinging
            </Typography>
            <Typography className="text-white/90" variant="body2">
              Pinging animation
            </Typography>
          </Background>

          <Background animation="glow" className="p-6 rounded-lg" variant="warning">
            <Typography className="text-white" variant="h6">
              Glowing
            </Typography>
            <Typography className="text-white/90" variant="body2">
              Glowing animation
            </Typography>
          </Background>
        </div>
      </FlexCol>

      {/* Blur Effects */}
      <FlexCol gap="lg">
        <Typography variant="h2">Blur Effects</Typography>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Background
            blur="sm"
            className="p-6 rounded-lg border border-white/20"
            variant="transparent"
          >
            <Typography variant="h6">Small Blur</Typography>
            <Typography variant="body2">Small backdrop blur effect</Typography>
          </Background>

          <Background
            blur="md"
            className="p-6 rounded-lg border border-white/20"
            variant="transparent"
          >
            <Typography variant="h6">Medium Blur</Typography>
            <Typography variant="body2">Medium backdrop blur effect</Typography>
          </Background>

          <Background
            blur="lg"
            className="p-6 rounded-lg border border-white/20"
            variant="transparent"
          >
            <Typography variant="h6">Large Blur</Typography>
            <Typography variant="body2">Large backdrop blur effect</Typography>
          </Background>

          <Background
            blur="xl"
            className="p-6 rounded-lg border border-white/20"
            variant="transparent"
          >
            <Typography variant="h6">Extra Large Blur</Typography>
            <Typography variant="body2">Extra large backdrop blur effect</Typography>
          </Background>
        </div>
      </FlexCol>

      {/* Convenience Components */}
      <FlexCol gap="lg">
        <Typography variant="h2">Convenience Components</Typography>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <PrimaryBackground className="p-6 rounded-lg">
            <Typography className="text-white" variant="h6">
              Primary Background
            </Typography>
            <Typography className="text-white/90" variant="body2">
              Pre-configured primary background
            </Typography>
          </PrimaryBackground>

          <CardBackground className="p-6 rounded-lg">
            <Typography variant="h6">Card Background</Typography>
            <Typography variant="body2">Pre-configured card background</Typography>
          </CardBackground>

          <GradientBackground className="p-6 rounded-lg">
            <Typography className="text-white" variant="h6">
              Gradient Background
            </Typography>
            <Typography className="text-white/90" variant="body2">
              Pre-configured gradient background
            </Typography>
          </GradientBackground>

          <PatternBackground className="p-6 rounded-lg">
            <Typography variant="h6">Pattern Background</Typography>
            <Typography variant="body2">Pre-configured pattern background</Typography>
          </PatternBackground>
        </div>
      </FlexCol>

      {/* Real-world Examples */}
      <FlexCol gap="lg">
        <Typography variant="h2">Real-world Examples</Typography>

        {/* Hero Section */}
        <Background
          animation="pulse"
          className="p-12 rounded-lg text-center"
          gradient="sunset"
          overlay="gradient"
          variant="default"
        >
          <Typography className="text-white mb-4" variant="h1">
            Welcome to Our Platform
          </Typography>
          <Typography className="text-white/90 mb-6" variant="body1">
            Discover amazing features and start your journey with us
          </Typography>
          <Button size="lg" variant="secondary">
            Get Started
          </Button>
        </Background>

        {/* Glass Card */}
        <Background
          blur="xl"
          className="p-8 border border-white/20"
          overlay="subtle"
          radius="lg"
          shadow="lg"
          variant="transparent"
        >
          <Typography className="text-white mb-4" variant="h3">
            Glass Morphism Card
          </Typography>
          <Typography className="text-white/90" variant="body1">
            This is a glass morphism effect with backdrop blur and subtle overlay. Perfect for
            modern UI designs.
          </Typography>
        </Background>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Background className="p-6" pattern="dots" radius="lg" shadow="md" variant="card">
            <Typography className="mb-2" variant="h6">
              Feature 1
            </Typography>
            <Typography variant="body2">
              Description of the first feature with dot pattern background.
            </Typography>
          </Background>

          <Background
            className="p-6"
            gradient="ocean"
            overlay="medium"
            radius="lg"
            shadow="md"
            variant="card"
          >
            <Typography className="text-white mb-2" variant="h6">
              Feature 2
            </Typography>
            <Typography className="text-white/90" variant="body2">
              Description of the second feature with ocean gradient.
            </Typography>
          </Background>

          <Background animation="float" className="p-6" radius="lg" shadow="md" variant="card">
            <Typography className="mb-2" variant="h6">
              Feature 3
            </Typography>
            <Typography variant="body2">
              Description of the third feature with floating animation.
            </Typography>
          </Background>
        </div>
      </FlexCol>
    </FlexCol>
  );
};

const meta = {
  component: BackgroundDemo,
  parameters: { layout: "fullscreen" },
  title: "Components/Background",
} satisfies Meta<typeof BackgroundDemo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Demo: Story = {};
