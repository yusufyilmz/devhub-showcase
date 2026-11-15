import { cardStoryImages } from "@fixtures/card-story-images";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { AspectRatio } from "./AspectRatio";

function Example({ width = 560, ratio = 16 / 9 }: { width?: number; ratio?: number }) {
  return (
    <figure className="w-full space-y-xs p-md" style={{ maxWidth: width }}>
      <AspectRatio
        className="overflow-hidden rounded-lg border border-border/60 bg-muted"
        ratio={ratio}
      >
        {/* biome-ignore lint/performance/noImgElement: The story uses a local image fixture. */}
        <img
          alt="Blue hills at sunrise"
          className="size-full object-cover"
          src={cardStoryImages.morning}
        />
      </AspectRatio>
      <figcaption className="text-sm text-muted-foreground">Blue hills at sunrise</figcaption>
    </figure>
  );
}

const meta = {
  component: Example,
  tags: ["autodocs"],
  title: "UI/Layout/Aspect Ratio",
} satisfies Meta<typeof Example>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Narrow: Story = { args: { width: 320 } };
export const Wide: Story = { args: { width: 960 } };
export const Portrait: Story = { args: { ratio: 3 / 4, width: 320 } };
