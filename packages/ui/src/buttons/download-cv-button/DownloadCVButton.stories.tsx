import type { Meta, StoryObj } from "@storybook/react-vite";

import { DownloadCVButton } from "./DownloadCVButton";

const meta = {
  component: DownloadCVButton,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  title: "UI/Actions/Download CV Button",
} satisfies Meta<typeof DownloadCVButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithFileDetails: Story = {
  render: () => (
    <div className="space-y-3">
      <p>Curriculum vitae · PDF</p>
      <DownloadCVButton />
    </div>
  ),
};
export const InPortfolioHeader: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <h2>Mina Chen</h2>
      <DownloadCVButton />
    </div>
  ),
};
