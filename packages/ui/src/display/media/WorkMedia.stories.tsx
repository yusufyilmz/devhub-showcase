import type { Meta, StoryObj } from "@storybook/react-vite";

import { WorkMedia } from "./WorkMedia";

const meta = {
  args: { title: "Ridgeline portfolio" },
  component: WorkMedia,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  title: "UI/Display/Media/Work Media",
} satisfies Meta<typeof WorkMedia>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CoverImage: Story = { args: { imageUrl: "/examples/atlas-interface.svg" } };
export const YouTubeConsent: Story = {
  args: { title: "Example project video", youtubeId: "aqz-KE-bpKQ" },
};
export const SourceLink: Story = { args: { sourceUrl: "https://www.instagram.com/p/Csample/" } };
