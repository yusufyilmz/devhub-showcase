import type React from "react";

import { Button } from "../../buttons";
import { Typography } from "../../display/typography";
import { FlexCol } from "../../layout";
import {
  Background,
  CardBackground,
  GradientBackground,
  PatternBackground,
  PrimaryBackground,
} from "./BackgroundShad";

export const BackgroundShadDemo: React.FC = () => {
  return (
    <FlexCol gap="xl" padding="lg" width="full">
      <Typography variant="h1">Background Component Demo</Typography>

      {/* Basic Background Variants */}
      <FlexCol gap="lg">
        <Typography variant="h2">Basic Background Variants</Typography>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Background variant="default" className="p-4 rounded-lg">
            <Typography variant="h6">Default</Typography>
            <Typography variant="body2">Default background variant</Typography>
          </Background>

          <Background variant="primary" className="p-4 rounded-lg">
            <Typography variant="h6">Primary</Typography>
            <Typography variant="body2">Primary background variant</Typography>
          </Background>

          <Background variant="secondary" className="p-4 rounded-lg">
            <Typography variant="h6">Secondary</Typography>
            <Typography variant="body2">Secondary background variant</Typography>
          </Background>

          <Background variant="accent" className="p-4 rounded-lg">
            <Typography variant="h6">Accent</Typography>
            <Typography variant="body2">Accent background variant</Typography>
          </Background>

          <Background variant="card" className="p-4 rounded-lg">
            <Typography variant="h6">Card</Typography>
            <Typography variant="body2">Card background variant</Typography>
          </Background>

          <Background variant="muted" className="p-4 rounded-lg">
            <Typography variant="h6">Muted</Typography>
            <Typography variant="body2">Muted background variant</Typography>
          </Background>
        </div>
      </FlexCol>

      {/* Pattern Backgrounds */}
      <FlexCol gap="lg">
        <Typography variant="h2">Pattern Backgrounds</Typography>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Background variant="card" pattern="dots" className="p-6 rounded-lg">
            <Typography variant="h6">Dots Pattern</Typography>
            <Typography variant="body2">Background with dots pattern</Typography>
          </Background>

          <Background variant="card" pattern="grid" className="p-6 rounded-lg">
            <Typography variant="h6">Grid Pattern</Typography>
            <Typography variant="body2">Background with grid pattern</Typography>
          </Background>

          <Background variant="card" pattern="diagonal" className="p-6 rounded-lg">
            <Typography variant="h6">Diagonal Pattern</Typography>
            <Typography variant="body2">Background with diagonal pattern</Typography>
          </Background>

          <Background variant="card" pattern="stripes" className="p-6 rounded-lg">
            <Typography variant="h6">Stripes Pattern</Typography>
            <Typography variant="body2">Background with stripes pattern</Typography>
          </Background>
        </div>
      </FlexCol>

      {/* Gradient Backgrounds */}
      <FlexCol gap="lg">
        <Typography variant="h2">Gradient Backgrounds</Typography>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Background gradient="rainbow" className="p-6 rounded-lg">
            <Typography variant="h6" className="text-white">
              Rainbow Gradient
            </Typography>
            <Typography variant="body2" className="text-white/90">
              Beautiful rainbow gradient
            </Typography>
          </Background>

          <Background gradient="sunset" className="p-6 rounded-lg">
            <Typography variant="h6" className="text-white">
              Sunset Gradient
            </Typography>
            <Typography variant="body2" className="text-white/90">
              Warm sunset colors
            </Typography>
          </Background>

          <Background gradient="ocean" className="p-6 rounded-lg">
            <Typography variant="h6" className="text-white">
              Ocean Gradient
            </Typography>
            <Typography variant="body2" className="text-white/90">
              Cool ocean blues
            </Typography>
          </Background>

          <Background gradient="forest" className="p-6 rounded-lg">
            <Typography variant="h6" className="text-white">
              Forest Gradient
            </Typography>
            <Typography variant="body2" className="text-white/90">
              Natural forest greens
            </Typography>
          </Background>

          <Background gradient="fire" className="p-6 rounded-lg">
            <Typography variant="h6" className="text-white">
              Fire Gradient
            </Typography>
            <Typography variant="body2" className="text-white/90">
              Hot fire colors
            </Typography>
          </Background>

          <Background gradient="cosmic" className="p-6 rounded-lg">
            <Typography variant="h6" className="text-white">
              Cosmic Gradient
            </Typography>
            <Typography variant="body2" className="text-white/90">
              Mysterious cosmic colors
            </Typography>
          </Background>
        </div>
      </FlexCol>

      {/* Overlay Effects */}
      <FlexCol gap="lg">
        <Typography variant="h2">Overlay Effects</Typography>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Background variant="primary" overlay="subtle" className="p-6 rounded-lg">
            <Typography variant="h6" className="text-white">
              Subtle Overlay
            </Typography>
            <Typography variant="body2" className="text-white/90">
              Subtle overlay effect
            </Typography>
          </Background>

          <Background variant="primary" overlay="medium" className="p-6 rounded-lg">
            <Typography variant="h6" className="text-white">
              Medium Overlay
            </Typography>
            <Typography variant="body2" className="text-white/90">
              Medium overlay effect
            </Typography>
          </Background>

          <Background variant="primary" overlay="strong" className="p-6 rounded-lg">
            <Typography variant="h6" className="text-white">
              Strong Overlay
            </Typography>
            <Typography variant="body2" className="text-white/90">
              Strong overlay effect
            </Typography>
          </Background>

          <Background variant="primary" overlay="gradient" className="p-6 rounded-lg">
            <Typography variant="h6" className="text-white">
              Gradient Overlay
            </Typography>
            <Typography variant="body2" className="text-white/90">
              Gradient overlay effect
            </Typography>
          </Background>
        </div>
      </FlexCol>

      {/* Animations */}
      <FlexCol gap="lg">
        <Typography variant="h2">Animated Backgrounds</Typography>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Background variant="primary" animation="pulse" className="p-6 rounded-lg">
            <Typography variant="h6" className="text-white">
              Pulsing
            </Typography>
            <Typography variant="body2" className="text-white/90">
              Pulsing animation
            </Typography>
          </Background>

          <Background variant="accent" animation="bounce" className="p-6 rounded-lg">
            <Typography variant="h6" className="text-white">
              Bouncing
            </Typography>
            <Typography variant="body2" className="text-white/90">
              Bouncing animation
            </Typography>
          </Background>

          <Background variant="success" animation="ping" className="p-6 rounded-lg">
            <Typography variant="h6" className="text-white">
              Pinging
            </Typography>
            <Typography variant="body2" className="text-white/90">
              Pinging animation
            </Typography>
          </Background>

          <Background variant="warning" animation="glow" className="p-6 rounded-lg">
            <Typography variant="h6" className="text-white">
              Glowing
            </Typography>
            <Typography variant="body2" className="text-white/90">
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
            variant="transparent"
            blur="sm"
            className="p-6 rounded-lg border border-white/20"
          >
            <Typography variant="h6">Small Blur</Typography>
            <Typography variant="body2">Small backdrop blur effect</Typography>
          </Background>

          <Background
            variant="transparent"
            blur="md"
            className="p-6 rounded-lg border border-white/20"
          >
            <Typography variant="h6">Medium Blur</Typography>
            <Typography variant="body2">Medium backdrop blur effect</Typography>
          </Background>

          <Background
            variant="transparent"
            blur="lg"
            className="p-6 rounded-lg border border-white/20"
          >
            <Typography variant="h6">Large Blur</Typography>
            <Typography variant="body2">Large backdrop blur effect</Typography>
          </Background>

          <Background
            variant="transparent"
            blur="xl"
            className="p-6 rounded-lg border border-white/20"
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
            <Typography variant="h6" className="text-white">
              Primary Background
            </Typography>
            <Typography variant="body2" className="text-white/90">
              Pre-configured primary background
            </Typography>
          </PrimaryBackground>

          <CardBackground className="p-6 rounded-lg">
            <Typography variant="h6">Card Background</Typography>
            <Typography variant="body2">Pre-configured card background</Typography>
          </CardBackground>

          <GradientBackground className="p-6 rounded-lg">
            <Typography variant="h6" className="text-white">
              Gradient Background
            </Typography>
            <Typography variant="body2" className="text-white/90">
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
          variant="primary"
          gradient="sunset"
          overlay="gradient"
          animation="pulse"
          className="p-12 rounded-lg text-center"
        >
          <Typography variant="h1" className="text-white mb-4">
            Welcome to Our Platform
          </Typography>
          <Typography variant="body1" className="text-white/90 mb-6">
            Discover amazing features and start your journey with us
          </Typography>
          <Button variant="secondary" size="lg">
            Get Started
          </Button>
        </Background>

        {/* Glass Card */}
        <Background
          variant="transparent"
          blur="xl"
          overlay="subtle"
          radius="lg"
          shadow="lg"
          className="p-8 border border-white/20"
        >
          <Typography variant="h3" className="text-white mb-4">
            Glass Morphism Card
          </Typography>
          <Typography variant="body1" className="text-white/90">
            This is a glass morphism effect with backdrop blur and subtle overlay. Perfect for
            modern UI designs.
          </Typography>
        </Background>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Background variant="card" pattern="dots" radius="lg" shadow="md" className="p-6">
            <Typography variant="h6" className="mb-2">
              Feature 1
            </Typography>
            <Typography variant="body2">
              Description of the first feature with dot pattern background.
            </Typography>
          </Background>

          <Background
            variant="card"
            gradient="ocean"
            overlay="medium"
            radius="lg"
            shadow="md"
            className="p-6"
          >
            <Typography variant="h6" className="text-white mb-2">
              Feature 2
            </Typography>
            <Typography variant="body2" className="text-white/90">
              Description of the second feature with ocean gradient.
            </Typography>
          </Background>

          <Background variant="card" animation="float" radius="lg" shadow="md" className="p-6">
            <Typography variant="h6" className="mb-2">
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
