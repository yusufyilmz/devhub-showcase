import { PortfolioStoryFrame } from "@fixtures/portfolio-story-frame";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { HeroSurface } from "./hero-surface";

const meta = {
  args: {
    children: (
      <div className="p-12">
        <h2 className="font-semibold text-3xl">Selected work</h2>
        <p>Design and engineering projects.</p>
      </div>
    ),
  },
  component: HeroSurface,
  decorators: [
    (Story) => (
      <PortfolioStoryFrame>
        <Story />
      </PortfolioStoryFrame>
    ),
  ],
  parameters: { layout: "padded" },
  render: ({ media, ...args }) => (
    <HeroSurface
      {...args}
      media={media && { ...media, url: new URL(media.url, window.location.href).href }}
    />
  ),
  tags: ["autodocs"],
  title: "UI/Layout/Hero/Hero Surface",
} satisfies Meta<typeof HeroSurface>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Plain: Story = {};
export const ImageBackground: Story = {
  args: {
    media: {
      kind: "image",
      overlay: "soft",
      position: "center",
      url: "/examples/orbit-brand.svg",
    },
  },
};
export const StrongOverlay: Story = {
  args: {
    media: {
      kind: "image",
      overlay: "strong",
      position: "top",
      url: "/examples/orbit-brand.svg",
    },
  },
};
