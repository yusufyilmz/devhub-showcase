import type * as React from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Card, CardContent, CardHeader, CardTitle } from "../../cards";
import { FlexCol } from "../../layout/flex";
import { Typography } from "../typography";
import {
  Code,
  CodeBlock,
  CodeDestructive,
  CodeInfo,
  CodeLarge,
  CodePrimary,
  CodeSecondary,
  CodeSmall,
  CodeSuccess,
  CodeWarning,
} from "./Code";

const CodeDemo: React.FC = () => {
  const codeExample = `function greetUser(name: string) {
  return \`Hello, \${name}!\`;
}

const user = "World";
console.log(greetUser(user));`;

  return (
    <FlexCol className="p-8" gap="xl">
      {/* Header */}
      <div>
        <Typography className="font-bold mb-4 text-[var(--foreground)]" variant="h1">
          Code Component Demo
        </Typography>
        <Typography className="text-[var(--muted-foreground)]" variant="body1">
          Theme-aware code components with variants, sizes, and proper syntax highlighting.
        </Typography>
      </div>

      {/* Basic Examples */}
      <Card className="p-6 bg-[var(--card)] border-[var(--border)]">
        <CardHeader>
          <CardTitle className="text-[var(--foreground)]">Basic Examples</CardTitle>
        </CardHeader>
        <CardContent>
          <FlexCol gap="md">
            <div>
              <Typography className="text-[var(--foreground)] mb-2" variant="body1">
                Inline code: <Code>const name = "World"</Code>
              </Typography>
            </div>

            <div>
              <Typography className="text-[var(--foreground)] mb-2" variant="body1">
                Code with function: <Code>function greet() {`{ return "Hello!" }`}</Code>
              </Typography>
            </div>

            <div>
              <Typography className="text-[var(--foreground)] mb-2" variant="body1">
                Code block example:
              </Typography>
              <CodeBlock className="bg-[var(--muted)] p-4 rounded-md text-[var(--muted-foreground)]">
                {codeExample}
              </CodeBlock>
            </div>
          </FlexCol>
        </CardContent>
      </Card>

      {/* Variants */}
      <Card className="p-6 bg-[var(--card)] border-[var(--border)]">
        <CardHeader>
          <CardTitle className="text-[var(--foreground)]">Variants</CardTitle>
        </CardHeader>
        <CardContent>
          <FlexCol gap="md">
            <div>
              <Typography className="text-[var(--foreground)] mb-2" variant="body1">
                Default: <Code>default code</Code>
              </Typography>
            </div>

            <div>
              <Typography className="text-[var(--foreground)] mb-2" variant="body1">
                Primary: <CodePrimary>primary code</CodePrimary>
              </Typography>
            </div>

            <div>
              <Typography className="text-[var(--foreground)] mb-2" variant="body1">
                Secondary: <CodeSecondary>secondary code</CodeSecondary>
              </Typography>
            </div>

            <div>
              <Typography className="text-[var(--foreground)] mb-2" variant="body1">
                Destructive: <CodeDestructive>destructive code</CodeDestructive>
              </Typography>
            </div>

            <div>
              <Typography className="text-[var(--foreground)] mb-2" variant="body1">
                Success: <CodeSuccess>success code</CodeSuccess>
              </Typography>
            </div>

            <div>
              <Typography className="text-[var(--foreground)] mb-2" variant="body1">
                Warning: <CodeWarning>warning code</CodeWarning>
              </Typography>
            </div>

            <div>
              <Typography className="text-[var(--foreground)] mb-2" variant="body1">
                Info: <CodeInfo>info code</CodeInfo>
              </Typography>
            </div>
          </FlexCol>
        </CardContent>
      </Card>

      {/* Sizes */}
      <Card className="p-6 bg-[var(--card)] border-[var(--border)]">
        <CardHeader>
          <CardTitle className="text-[var(--foreground)]">Sizes</CardTitle>
        </CardHeader>
        <CardContent>
          <FlexCol gap="md">
            <div>
              <Typography className="text-[var(--foreground)] mb-2" variant="body1">
                Small: <CodeSmall>small code</CodeSmall>
              </Typography>
            </div>

            <div>
              <Typography className="text-[var(--foreground)] mb-2" variant="body1">
                Default: <Code>default code</Code>
              </Typography>
            </div>

            <div>
              <Typography className="text-[var(--foreground)] mb-2" variant="body1">
                Large: <CodeLarge>large code</CodeLarge>
              </Typography>
            </div>
          </FlexCol>
        </CardContent>
      </Card>

      {/* Real-world Examples */}
      <Card className="p-6 bg-[var(--card)] border-[var(--border)]">
        <CardHeader>
          <CardTitle className="text-[var(--foreground)]">Real-world Examples</CardTitle>
        </CardHeader>
        <CardContent>
          <FlexCol gap="lg">
            {/* API Documentation */}
            <FlexCol gap="md">
              <Typography className="text-[var(--foreground)]" variant="h6">
                API Documentation
              </Typography>
              <FlexCol gap="sm">
                <Typography className="text-[var(--foreground)]" variant="body1">
                  To make a request, use the <Code>fetch()</Code> function:
                </Typography>
                <CodeBlock className="bg-[var(--muted)] p-4 rounded-md text-[var(--muted-foreground)]">
                  {`const response = await fetch('/api/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ name: 'John' })
});`}
                </CodeBlock>
              </FlexCol>
            </FlexCol>

            {/* Error Messages */}
            <FlexCol gap="md">
              <Typography className="text-[var(--foreground)]" variant="h6">
                Error Messages
              </Typography>
              <FlexCol gap="sm">
                <div className="p-3 bg-[var(--destructive)]/10 border border-[var(--destructive)]/20 rounded-md">
                  <Typography className="text-[var(--destructive)]" variant="body2">
                    Error:{" "}
                    <CodeDestructive>
                      TypeError: Cannot read property 'name' of undefined
                    </CodeDestructive>
                  </Typography>
                </div>
                <div className="p-3 bg-[var(--warning)]/10 border border-[var(--warning)]/20 rounded-md">
                  <Typography className="text-[var(--warning)]" variant="body2">
                    Warning: <CodeWarning>Deprecated API endpoint</CodeWarning> will be removed in
                    v2.0
                  </Typography>
                </div>
                <div className="p-3 bg-[var(--success)]/10 border border-[var(--success)]/20 rounded-md">
                  <Typography className="text-[var(--success)]" variant="body2">
                    Success: <CodeSuccess>User created successfully</CodeSuccess>
                  </Typography>
                </div>
              </FlexCol>
            </FlexCol>

            {/* Configuration Examples */}
            <FlexCol gap="md">
              <Typography className="text-[var(--foreground)]" variant="h6">
                Configuration Examples
              </Typography>
              <FlexCol gap="sm">
                <Typography className="text-[var(--foreground)]" variant="body1">
                  Environment variables:
                </Typography>
                <CodeBlock className="bg-[var(--muted)] p-4 rounded-md text-[var(--muted-foreground)]">
                  {`# .env
DATABASE_URL=postgresql://user:pass@localhost:5432/db
API_KEY=your-api-key-here
DEBUG=true`}
                </CodeBlock>
              </FlexCol>
            </FlexCol>

            {/* Command Examples */}
            <FlexCol gap="md">
              <Typography className="text-[var(--foreground)]" variant="h6">
                Command Examples
              </Typography>
              <FlexCol gap="sm">
                <Typography className="text-[var(--foreground)]" variant="body1">
                  Install dependencies:
                </Typography>
                <CodeBlock className="bg-[var(--muted)] p-4 rounded-md text-[var(--muted-foreground)]">
                  {`npm install
# or
yarn install
# or
pnpm install`}
                </CodeBlock>
              </FlexCol>
            </FlexCol>
          </FlexCol>
        </CardContent>
      </Card>
    </FlexCol>
  );
};

const meta = {
  component: CodeDemo,
  parameters: { layout: "fullscreen" },
  title: "UI/Display/Code",
} satisfies Meta<typeof CodeDemo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Demo: Story = {};

export const NarrowCanvas: StoryObj<typeof meta> = {
  ...Demo,
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 320, width: "100%" }}>
        <Story />
      </div>
    ),
  ],
};

export const WideCanvas: StoryObj<typeof meta> = {
  ...Demo,
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 960, width: "100%" }}>
        <Story />
      </div>
    ),
  ],
};
