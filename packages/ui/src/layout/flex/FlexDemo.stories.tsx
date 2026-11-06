// import '@shared/design-system/styles.css'
// import '@shared/design-system/theme.css'
// import '@shared/ui/styles.css'
// import './globals.css'

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "../../buttons";
import { Card } from "../../cards";
import { FlexGrid, FlexInline, FlexSpaced, FlexStack } from "./Flex";
import { FlexDemo } from "./FlexDemo";

const meta = {
  title: "UI Components/Flex",
  component: FlexDemo,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof FlexDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Demo: Story = {};

export const SpacingComponents: Story = {
  render: () => (
    <div className="p-8 space-y-8">
      <h2 className="text-2xl font-bold">Flex Spacing Components</h2>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">FlexSpaced - Space Between Items</h3>
        <FlexSpaced padding="md" background="card" radius="md" shadow="sm">
          <Button variant="outline">Left Button</Button>
          <Button variant="default">Right Button</Button>
        </FlexSpaced>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">FlexStack - Vertical Stack with Spacing</h3>
        <FlexStack padding="md" background="muted" radius="md">
          <Button variant="outline">Stack Item 1</Button>
          <Button variant="outline">Stack Item 2</Button>
          <Button variant="outline">Stack Item 3</Button>
        </FlexStack>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">FlexInline - Horizontal Inline with Spacing</h3>
        <FlexInline padding="md" background="accent" radius="md">
          <Button variant="ghost" size="sm">
            Item 1
          </Button>
          <Button variant="ghost" size="sm">
            Item 2
          </Button>
          <Button variant="ghost" size="sm">
            Item 3
          </Button>
        </FlexInline>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">FlexGrid - Wrapping Grid with Spacing</h3>
        <FlexGrid padding="md" background="card" radius="md" shadow="sm">
          <div className="px-3 py-2 bg-primary text-primary-foreground rounded">Tag 1</div>
          <div className="px-3 py-2 bg-primary text-primary-foreground rounded">Tag 2</div>
          <div className="px-3 py-2 bg-primary text-primary-foreground rounded">Tag 3</div>
          <div className="px-3 py-2 bg-primary text-primary-foreground rounded">Tag 4</div>
          <div className="px-3 py-2 bg-primary text-primary-foreground rounded">Tag 5</div>
          <div className="px-3 py-2 bg-primary text-primary-foreground rounded">Tag 6</div>
        </FlexGrid>
      </Card>
    </div>
  ),
};
