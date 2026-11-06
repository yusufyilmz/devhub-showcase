import type { Meta, StoryObj } from "@storybook/react-vite";

import { ErrorPage } from "../../feedback/error-page";

const meta = {
  component: ErrorPage,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
  title: "UI/Layout/ErrorPage",
} satisfies Meta<typeof ErrorPage>;

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
