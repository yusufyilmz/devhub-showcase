import type { Meta, StoryObj } from "@storybook/react-vite";

import { NotFoundPage } from "./NotFoundPage";

const meta = {
  component: NotFoundPage,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
  title: "UI/Layout/Not Found Page",
} satisfies Meta<typeof NotFoundPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Narrow: Story = {
  decorators: [
    (Story) => (
      <div className="mx-auto max-w-sm">
        <Story />
      </div>
    ),
  ],
};
export const InPageShell: Story = {
  decorators: [
    (Story) => (
      <main aria-label="Page recovery">
        <Story />
      </main>
    ),
  ],
};
