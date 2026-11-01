import type { Meta, StoryObj } from "@storybook/react-vite";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "./Tabs";

/**
 * A set of layered sections of content—known as tab panels—that are displayed one at a time.
 */
const meta: Meta<typeof Tabs> = {
  args: {
    defaultValue: "account",
    orientation: "horizontal",
  },
  argTypes: {
    defaultValue: {
      control: "text",
      description: "The value of the tab that should be active when initially rendered",
    },
    orientation: {
      control: "radio",
      description: "The orientation of the component",
      options: ["horizontal", "vertical"],
    },
  },
  component: Tabs,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  title: "UI/Tabs",
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Tabs {...args} className="w-[400px]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent className="space-y-2" value="account">
        <div>
          <h3 className="text-lg font-medium">Account</h3>
          <p className="text-sm text-muted-foreground">
            Make changes to your account here. Click save when you're done.
          </p>
        </div>
      </TabsContent>
      <TabsContent className="space-y-2" value="password">
        <div>
          <h3 className="text-lg font-medium">Password</h3>
          <p className="text-sm text-muted-foreground">
            Change your password here. After saving, you'll be logged out.
          </p>
        </div>
      </TabsContent>
    </Tabs>
  ),
};

export const NarrowCanvas: StoryObj<typeof meta> = {
  ...Default,
  decorators: [
    (Story) => (
      <div style={{ width: "100%", maxWidth: 320 }}>
        <Story />
      </div>
    ),
  ],
};

export const WideCanvas: StoryObj<typeof meta> = {
  ...Default,
  decorators: [
    (Story) => (
      <div style={{ width: "100%", maxWidth: 960 }}>
        <Story />
      </div>
    ),
  ],
};
