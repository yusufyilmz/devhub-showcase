import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./Carousel";

function Example({
  placement = "floating",
  width = 560,
}: {
  placement?: "floating" | "inline";
  width?: number;
}) {
  return (
    <div style={{ maxWidth: width, padding: placement === "floating" ? 12 : 0, width: "100%" }}>
      <Carousel
        aria-label="Projects"
        className={placement === "floating" ? "mx-10" : undefined}
        tabIndex={0}
      >
        <CarouselContent>
          {["First project", "Second project", "Third project"].map((title) => (
            <CarouselItem key={title}>
              <div className="grid min-h-32 place-items-center rounded-lg border border-border bg-card p-4 text-center">
                {title}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className={placement === "inline" ? "mt-3 flex justify-end gap-2" : undefined}>
          <CarouselPrevious placement={placement} />
          <CarouselNext placement={placement} />
        </div>
      </Carousel>
    </div>
  );
}
const meta = {
  component: Example,
  tags: ["autodocs"],
  title: "UI/Display/Carousel",
} satisfies Meta<typeof Example>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const InlineControls: Story = { args: { placement: "inline", width: 320 } };
export const Narrow: Story = { args: { placement: "inline", width: 320 } };
export const Wide: Story = { args: { width: 960 } };
