import type React from "react";

import { Button } from "../../buttons";
import { Card } from "../../cards";
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
export const FlexDemo: React.FC = () => {
  return (
    <FlexCol gap="xl" padding="lg" width="full">
      <h2>Flex Component Demo</h2>

      {/* Basic Flex Examples */}
      <FlexCol gap="lg">
        <h3>Basic Flex Examples</h3>

        <FlexRow gap="md" padding="md" background="card" radius="md" shadow="sm">
          <div>Item 1</div>
          <div>Item 2</div>
          <div>Item 3</div>
        </FlexRow>

        <FlexCol gap="sm" padding="md" background="muted" radius="md">
          <div>Vertical Item 1</div>
          <div>Vertical Item 2</div>
        </FlexCol>
      </FlexCol>

      {/* Convenience Components */}
      <FlexCol gap="lg">
        <h3>Convenience Components</h3>

        <FlexCenter gap="md" padding="md" background="accent" radius="md">
          <div>Centered Content</div>
        </FlexCenter>

        <FlexBetween padding="md" background="card" radius="md" shadow="sm">
          <div>Left Content</div>
          <div>Right Content</div>
        </FlexBetween>

        <FlexWrap gap="sm" padding="md" background="muted" radius="md">
          <div className="px-2 py-1 bg-primary text-primary-foreground rounded">Tag 1</div>
          <div className="px-2 py-1 bg-primary text-primary-foreground rounded">Tag 2</div>
          <div className="px-2 py-1 bg-primary text-primary-foreground rounded">Tag 3</div>
          <div className="px-2 py-1 bg-primary text-primary-foreground rounded">Tag 4</div>
        </FlexWrap>
      </FlexCol>

      {/* Spacing-Focused Components */}
      <FlexCol gap="lg">
        <h3>Spacing-Focused Components</h3>

        <FlexSpaced padding="md" background="card" radius="md" shadow="sm">
          <div>Left Item</div>
          <div>Right Item</div>
        </FlexSpaced>

        <FlexStack padding="md" background="muted" radius="md">
          <div>Stack Item 1</div>
          <div>Stack Item 2</div>
          <div>Stack Item 3</div>
        </FlexStack>

        <FlexInline padding="md" background="accent" radius="md">
          <div>Inline Item 1</div>
          <div>Inline Item 2</div>
          <div>Inline Item 3</div>
        </FlexInline>

        <FlexGrid padding="md" background="card" radius="md" shadow="sm">
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
            direction="column"
            gap="sm"
            padding="md"
            background="primary"
            radius="md"
            shadow="md"
            className="flex-1"
          >
            <div className="font-semibold">Primary Background</div>
            <div className="text-sm opacity-90">Uses var(--primary)</div>
          </Flex>

          <Flex
            direction="column"
            gap="sm"
            padding="md"
            background="accent"
            radius="md"
            shadow="md"
            className="flex-1"
          >
            <div className="font-semibold">Accent Background</div>
            <div className="text-sm opacity-90">Uses var(--accent)</div>
          </Flex>
        </FlexRow>

        <FlexRow gap="md">
          <Flex
            direction="column"
            gap="sm"
            padding="md"
            background="card"
            border="subtle"
            radius="md"
            shadow="sm"
            className="flex-1"
          >
            <div className="font-semibold">Card with Border</div>
            <div className="text-sm opacity-70">Uses var(--card) and var(--border)</div>
          </Flex>

          <Flex
            direction="column"
            gap="sm"
            padding="md"
            background="muted"
            border="primary"
            radius="lg"
            shadow="lg"
            className="flex-1"
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
          <FlexRow gap="xs" padding="sm" background="card" radius="sm">
            <div>XS Gap</div>
            <div>Small</div>
            <div>Spacing</div>
          </FlexRow>

          <FlexRow gap="sm" padding="sm" background="card" radius="sm">
            <div>SM Gap</div>
            <div>Small</div>
            <div>Spacing</div>
          </FlexRow>

          <FlexRow gap="md" padding="sm" background="card" radius="sm">
            <div>MD Gap</div>
            <div>Medium</div>
            <div>Spacing</div>
          </FlexRow>

          <FlexRow gap="lg" padding="sm" background="card" radius="sm">
            <div>LG Gap</div>
            <div>Large</div>
            <div>Spacing</div>
          </FlexRow>
        </FlexCol>
      </FlexCol>

      {/* Interactive Examples */}
      <FlexCol gap="lg">
        <h3>Interactive Examples</h3>

        <FlexBetween padding="md" background="card" radius="md" shadow="sm">
          <div>
            <div className="font-semibold">Action Bar</div>
            <div className="text-sm opacity-70">Space between content</div>
          </div>
          <FlexRow gap="sm">
            <Button variant="outline" size="sm">
              Cancel
            </Button>
            <Button variant="default" size="sm">
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
