import { PortfolioStoryFrame } from "@fixtures/portfolio-story-frame";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { SectionGallery } from "./section-gallery";

function Example({ width = 1120 }: { width?: number }) {
  return (
    <div style={{ maxWidth: width, width: "100%" }}>
      <SectionGallery assetUrl={(file) => new URL(`./examples/${file}.svg`, location.href).href} />
    </div>
  );
}
const meta = {
  component: Example,
  decorators: [
    (Story) => (
      <PortfolioStoryFrame>
        <Story />
      </PortfolioStoryFrame>
    ),
  ],
  tags: ["autodocs"],
  title: "Assistant/Sections/Home Section/Section Gallery",
} satisfies Meta<typeof Example>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Narrow: Story = { args: { width: 360 } };
export const Wide: Story = { args: { width: 1440 } };
