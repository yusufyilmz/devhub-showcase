import { cardStoryImages } from "@fixtures/card-story-images";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { ProjectCard } from "./ProjectCard";

const meta = {
  args: {
    caseStudyHref: "#case-study",
    description: "A portfolio for a landscape photography practice.",
    projectHref: "#project",
    title: "Storybook App UI/Cards/Project Card/Projectcard",
  },
  component: ProjectCard,
  decorators: [
    (Story) => (
      <div className="w-[min(88vw,30rem)]">
        <Story />
      </div>
    ),
  ],
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  title: "UI/Cards/Project Card",
} satisfies Meta<typeof ProjectCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithCarousel: Story = {
  args: {
    images: [
      { alt: "Blue hills in the morning", src: cardStoryImages.morning },
      { alt: "Purple hills in the evening", src: cardStoryImages.evening },
    ],
  },
};
export const WithTeam: Story = {
  args: {
    avatars: [
      { alt: "Mina Chen", value: "MC" },
      { alt: "Sol Ortiz", value: "SO" },
    ],
  },
};
