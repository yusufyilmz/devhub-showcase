import type React from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "../Button";
import { Card } from "../Card";
import {
  Flex,
  FlexBetween,
  FlexCenter,
  FlexCol,
  FlexGrid,
  FlexInline,
  FlexRow,
  FlexSpaced,
  FlexStack,
  FlexWrap,
} from "./Flex";

/**
 * Demo component showcasing the Flex component with theme integration
 */
const FlexDemo: React.FC = () => {
  return (
    <FlexCol gap="xl" padding="lg" width="full">
      <h2>Flex Component Demo</h2>

      {/* Basic Flex Examples */}
      <FlexCol gap="lg">
        <h3>Basic Flex Examples</h3>

        <FlexRow background="card" gap="md" padding="md" radius="md" shadow="sm">
          <div>Item 1</div>
          <div>Item 2</div>
          <div>Item 3</div>
        </FlexRow>

        <FlexCol background="muted" gap="sm" padding="md" radius="md">
          <div>Vertical Item 1</div>
          <div>Vertical Item 2</div>
        </FlexCol>
      </FlexCol>

      {/* Convenience Components */}
      <FlexCol gap="lg">
        <h3>Convenience Components</h3>

        <FlexCenter background="accent" gap="md" padding="md" radius="md">
          <div>Centered Content</div>
        </FlexCenter>

        <FlexBetween background="card" padding="md" radius="md" shadow="sm">
          <div>Left Content</div>
          <div>Right Content</div>
        </FlexBetween>

        <FlexWrap background="muted" gap="sm" padding="md" radius="md">
          <div className="px-2 py-1 bg-primary text-primary-foreground rounded">Tag 1</div>
          <div className="px-2 py-1 bg-primary text-primary-foreground rounded">Tag 2</div>
          <div className="px-2 py-1 bg-primary text-primary-foreground rounded">Tag 3</div>
          <div className="px-2 py-1 bg-primary text-primary-foreground rounded">Tag 4</div>
        </FlexWrap>
      </FlexCol>

      {/* Spacing-Focused Components */}
      <FlexCol gap="lg">
        <h3>Spacing-Focused Components</h3>

        <FlexSpaced background="card" padding="md" radius="md" shadow="sm">
          <div>Left Item</div>
          <div>Right Item</div>
        </FlexSpaced>

        <FlexStack background="muted" padding="md" radius="md">
          <div>Stack Item 1</div>
          <div>Stack Item 2</div>
          <div>Stack Item 3</div>
        </FlexStack>

        <FlexInline background="accent" padding="md" radius="md">
          <div>Inline Item 1</div>
          <div>Inline Item 2</div>
          <div>Inline Item 3</div>
        </FlexInline>

        <FlexGrid background="card" padding="md" radius="md" shadow="sm">
          <div className="px-2 py-1 bg-primary text-primary-foreground rounded">Grid Item 1</div>
          <div className="px-2 py-1 bg-primary text-primary-foreground rounded">Grid Item 2</div>
          <div className="px-2 py-1 bg-primary text-primary-foreground rounded">Grid Item 3</div>
          <div className="px-2 py-1 bg-primary text-primary-foreground rounded">Grid Item 4</div>
          <div className="px-2 py-1 bg-primary text-primary-foreground rounded">Grid Item 5</div>
          <div className="px-2 py-1 bg-primary text-primary-foreground rounded">Grid Item 6</div>
        </FlexGrid>
      </FlexCol>

      {/* Theme Integration Examples */}
      <FlexCol gap="lg">
        <h3>Theme Integration</h3>

        <FlexRow gap="md">
          <Flex
            background="primary"
            className="flex-1"
            direction="column"
            gap="sm"
            padding="md"
            radius="md"
            shadow="md"
          >
            <div className="font-semibold">Primary Background</div>
            <div className="text-sm opacity-90">Uses var(--primary)</div>
          </Flex>

          <Flex
            background="accent"
            className="flex-1"
            direction="column"
            gap="sm"
            padding="md"
            radius="md"
            shadow="md"
          >
            <div className="font-semibold">Accent Background</div>
            <div className="text-sm opacity-90">Uses var(--accent)</div>
          </Flex>
        </FlexRow>

        <FlexRow gap="md">
          <Flex
            background="card"
            border="subtle"
            className="flex-1"
            direction="column"
            gap="sm"
            padding="md"
            radius="md"
            shadow="sm"
          >
            <div className="font-semibold">Card with Border</div>
            <div className="text-sm opacity-70">Uses var(--card) and var(--border)</div>
          </Flex>

          <Flex
            background="muted"
            border="primary"
            className="flex-1"
            direction="column"
            gap="sm"
            padding="md"
            radius="lg"
            shadow="lg"
          >
            <div className="font-semibold">Muted with Primary Border</div>
            <div className="text-sm opacity-70">Uses var(--muted) and var(--primary)</div>
          </Flex>
        </FlexRow>
      </FlexCol>

      {/* Spacing Examples */}
      <FlexCol gap="lg">
        <h3>Spacing Examples</h3>

        <FlexCol gap="md">
          <FlexRow background="card" gap="xs" padding="sm" radius="sm">
            <div>XS Gap</div>
            <div>Small</div>
            <div>Spacing</div>
          </FlexRow>

          <FlexRow background="card" gap="sm" padding="sm" radius="sm">
            <div>SM Gap</div>
            <div>Small</div>
            <div>Spacing</div>
          </FlexRow>

          <FlexRow background="card" gap="md" padding="sm" radius="sm">
            <div>MD Gap</div>
            <div>Medium</div>
            <div>Spacing</div>
          </FlexRow>

          <FlexRow background="card" gap="lg" padding="sm" radius="sm">
            <div>LG Gap</div>
            <div>Large</div>
            <div>Spacing</div>
          </FlexRow>
        </FlexCol>
      </FlexCol>

      {/* Interactive Examples */}
      <FlexCol gap="lg">
        <h3>Interactive Examples</h3>

        <FlexBetween background="card" padding="md" radius="md" shadow="sm">
          <div>
            <div className="font-semibold">Action Bar</div>
            <div className="text-sm opacity-70">Space between content</div>
          </div>
          <FlexRow gap="sm">
            <Button size="sm" variant="outline">
              Cancel
            </Button>
            <Button size="sm" variant="default">
              Save
            </Button>
          </FlexRow>
        </FlexBetween>

        <FlexWrap gap="md">
          <Card className="flex-1 min-w-[200px]">
            <div className="p-4">
              <h4 className="font-semibold mb-2">Card 1</h4>
              <p className="text-sm opacity-70">Responsive card content</p>
            </div>
          </Card>
          <Card className="flex-1 min-w-[200px]">
            <div className="p-4">
              <h4 className="font-semibold mb-2">Card 2</h4>
              <p className="text-sm opacity-70">Another responsive card</p>
            </div>
          </Card>
          <Card className="flex-1 min-w-[200px]">
            <div className="p-4">
              <h4 className="font-semibold mb-2">Card 3</h4>
              <p className="text-sm opacity-70">Third responsive card</p>
            </div>
          </Card>
        </FlexWrap>
      </FlexCol>
    </FlexCol>
  );
};

const meta = {
  component: FlexDemo,
  parameters: { layout: "fullscreen" },
  title: "Components/Flex",
} satisfies Meta<typeof FlexDemo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Demo: Story = {};
