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
    <div style={{ maxWidth: width, padding: 24, width: "100%" }}>
      <Carousel className="mx-10">
        <CarouselContent>
          {["First project", "Second project", "Third project"].map((title) => (
            <CarouselItem key={title}>
              <div className="rounded-lg border p-12">{title}</div>
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
const meta = { component: Example, tags: ["autodocs"], title: "UI/carousel" } satisfies Meta<
  typeof Example
>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const InlineControls: Story = { args: { placement: "inline", width: 320 } };
export const Narrow: Story = { args: { width: 320 } };
export const Wide: Story = { args: { width: 960 } };
