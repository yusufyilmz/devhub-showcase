import type { Meta, StoryObj } from "@storybook/react-vite";

import { DownloadCVButton } from "./DownloadCVButton";

const meta = {
  component: DownloadCVButton,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  title: "UI/Buttons/Download CV Button",
} satisfies Meta<typeof DownloadCVButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithFileDetails: Story = {
  render: () => (
    <div className="grid gap-sm rounded-xl border border-border/75 bg-card p-md">
      <p className="text-sm text-muted-foreground">Curriculum vitae · PDF</p>
      <DownloadCVButton />
    </div>
  ),
};
export const InPortfolioHeader: Story = {
  render: () => (
    <div className="flex w-full max-w-md flex-wrap items-center justify-between gap-sm">
      <h2 className="text-base font-semibold">Mina Chen</h2>
      <div>
        <DownloadCVButton />
      </div>
    </div>
  ),
};
