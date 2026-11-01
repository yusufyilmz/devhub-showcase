import type React from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Card } from "../card";
import { FlexCol } from "../flex";
import {
  Body1,
  Body2,
  Caption,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  Lead,
  Muted,
  Typography,
} from "./Typography";

/**
 * Demo component showcasing the Typography component with theme integration
 */
const TypographyDemo: React.FC = () => {
  return (
    <FlexCol gap="xl" padding="lg" width="full">
      <Heading1>Typography System Demo</Heading1>

      {/* Heading Hierarchy */}
      <FlexCol gap="lg">
        <Heading2>Heading Hierarchy</Heading2>

        <Card className="p-6">
          <Heading1>Heading 1 - Main Page Title</Heading1>
          <Heading2>Heading 2 - Section Title</Heading2>
          <Heading3>Heading 3 - Subsection Title</Heading3>
          <Heading4>Heading 4 - Minor Section</Heading4>
          <Heading5>Heading 5 - Small Section</Heading5>
          <Heading6>Heading 6 - Smallest Heading</Heading6>
        </Card>
      </FlexCol>

      {/* Body Text Variants */}
      <FlexCol gap="lg">
        <Heading2>Body Text Variants</Heading2>

        <Card className="p-6">
          <Lead>
            This is a lead paragraph that introduces the main content. It's larger and more
            prominent than regular body text.
          </Lead>

          <Body1>
            This is the primary body text (body1). It's used for the main content of your
            application. It has good readability and is perfect for paragraphs and general content.
          </Body1>

          <Body2>
            This is secondary body text (body2). It's slightly smaller and used for supporting
            content, descriptions, and secondary information.
          </Body2>

          <Muted>
            This is muted text. It's used for less important information, captions, and secondary
            details.
          </Muted>
        </Card>
      </FlexCol>

      {/* Color Variants */}
      <FlexCol gap="lg">
        <Heading2>Color Variants</Heading2>

        <Card className="p-6">
          <FlexCol gap="md">
            <Typography color="default">Default text color</Typography>
            <Typography color="muted">Muted text color</Typography>
            <Typography color="primary">Primary text color</Typography>
            <Typography color="destructive">Destructive text color</Typography>
            <Typography color="success">Success text color</Typography>
            <Typography color="warning">Warning text color</Typography>
            <Typography color="info">Info text color</Typography>
          </FlexCol>
        </Card>
      </FlexCol>

      {/* Text Styling */}
      <FlexCol gap="lg">
        <Heading2>Text Styling</Heading2>

        <Card className="p-6">
          <FlexCol gap="md">
            <Typography weight="thin">Thin weight text</Typography>
            <Typography weight="light">Light weight text</Typography>
            <Typography weight="normal">Normal weight text</Typography>
            <Typography weight="medium">Medium weight text</Typography>
            <Typography weight="semibold">Semibold weight text</Typography>
            <Typography weight="bold">Bold weight text</Typography>
            <Typography weight="extrabold">Extrabold weight text</Typography>
            <Typography weight="black">Black weight text</Typography>
          </FlexCol>
        </Card>
      </FlexCol>

      {/* Text Transform */}
      <FlexCol gap="lg">
        <Heading2>Text Transform</Heading2>

        <Card className="p-6">
          <FlexCol gap="md">
            <Typography transform="none">Normal case text</Typography>
            <Typography transform="uppercase">Uppercase text</Typography>
            <Typography transform="lowercase">Lowercase text</Typography>
            <Typography transform="capitalize">Capitalize text</Typography>
          </FlexCol>
        </Card>
      </FlexCol>

      {/* Text Decoration */}
      <FlexCol gap="lg">
        <Heading2>Text Decoration</Heading2>

        <Card className="p-6">
          <FlexCol gap="md">
            <Typography decoration="none">No decoration</Typography>
            <Typography decoration="underline">Underlined text</Typography>
            <Typography decoration="line-through">Strikethrough text</Typography>
            <Typography decoration="overline">Overline text</Typography>
          </FlexCol>
        </Card>
      </FlexCol>

      {/* Alignment */}
      <FlexCol gap="lg">
        <Heading2>Text Alignment</Heading2>

        <Card className="p-6">
          <FlexCol gap="md">
            <Typography align="left">Left aligned text</Typography>
            <Typography align="center">Center aligned text</Typography>
            <Typography align="right">Right aligned text</Typography>
            <Typography align="justify">
              Justified text that spreads across the full width of the container. This is useful for
              creating clean, even text blocks in documents and articles.
            </Typography>
          </FlexCol>
        </Card>
      </FlexCol>

      {/* Code and Special Text */}
      <FlexCol gap="lg">
        <Heading2>Code and Special Text</Heading2>

        <Card className="p-6">
          <FlexCol gap="md">
            <Typography variant="code">const example = "code text";</Typography>
            <Typography variant="caption">Caption text for small details</Typography>
            <Typography variant="overline">Overline text for labels</Typography>
            <Typography variant="subtitle1">Subtitle 1 for secondary headings</Typography>
            <Typography variant="subtitle2">Subtitle 2 for tertiary headings</Typography>
          </FlexCol>
        </Card>
      </FlexCol>

      {/* Truncation */}
      <FlexCol gap="lg">
        <Heading2>Text Truncation</Heading2>

        <Card className="p-6">
          <FlexCol gap="md">
            <Typography className="max-w-xs" truncate="truncate">
              This is a long text that will be truncated with ellipsis
            </Typography>
            <Typography className="max-w-xs" truncate="truncate-2">
              This is a longer text that will be truncated to two lines with ellipsis at the end
            </Typography>
            <Typography className="max-w-xs" truncate="truncate-3">
              This is an even longer text that will be truncated to three lines with ellipsis at the
              end
            </Typography>
          </FlexCol>
        </Card>
      </FlexCol>

      {/* Real-world Example */}
      <FlexCol gap="lg">
        <Heading2>Real-world Example</Heading2>

        <Card className="p-6">
          <article>
            <Heading1>Understanding React Hooks</Heading1>
            <Lead>
              React Hooks are a powerful feature that allows you to use state and other React
              features in functional components. This guide will help you understand how to use them
              effectively.
            </Lead>

            <Heading2>What are React Hooks?</Heading2>
            <Body1>
              React Hooks are functions that let you "hook into" React state and lifecycle features
              from functional components. They were introduced in React 16.8 and have become the
              standard way to write React components.
            </Body1>

            <Heading3>Common Hooks</Heading3>
            <Body2>Here are some of the most commonly used hooks:</Body2>

            <ul className="list-disc list-inside space-y-2 my-4">
              <li>
                <Code>useState</Code> - for managing component state
              </li>
              <li>
                <Code>useEffect</Code> - for side effects and lifecycle methods
              </li>
              <li>
                <Code>useContext</Code> - for consuming context values
              </li>
              <li>
                <Code>useReducer</Code> - for complex state management
              </li>
            </ul>

            <Heading3>Example Usage</Heading3>
            <Typography className="block p-4 bg-muted rounded" variant="code">
              {`import { useState, useEffect } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = \`Count: \${count}\`;
  }, [count]);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}`}
            </Typography>

            <Caption className="mt-4" color="muted">
              Published on {new Date().toLocaleDateString()} by React Team
            </Caption>
          </article>
        </Card>
      </FlexCol>
    </FlexCol>
  );
};

const meta = {
  component: TypographyDemo,
  parameters: { layout: "fullscreen" },
  title: "Components/Typography",
} satisfies Meta<typeof TypographyDemo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Demo: Story = {};
