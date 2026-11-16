import { PortfolioStoryFrame } from "@fixtures/portfolio-story-frame";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { LiveSectionPreview } from "./live-section-preview";
import { sectionExamples } from "./preview-examples";

const meta = {
  args: {
    assetUrl: (file) => new URL(`./examples/${file}.svg`, location.href).href,
    exampleId: "services",
  },
  argTypes: {
    exampleId: { control: "select", options: sectionExamples.map(({ id }) => id) },
  },
  component: LiveSectionPreview,
  decorators: [
    (Story) => (
      <PortfolioStoryFrame>
        <Story />
      </PortfolioStoryFrame>
    ),
  ],
  title: "Assistant/Sections/Live Section Preview",
} satisfies Meta<typeof LiveSectionPreview>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Services: Story = {};
export const Gallery: Story = { args: { exampleId: "gallery-grid" } };
export const Contact: Story = { args: { exampleId: "contact-form" } };
export const Video: Story = { args: { exampleId: "youtube" } };
