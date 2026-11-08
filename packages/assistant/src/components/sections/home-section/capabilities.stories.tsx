import { PortfolioStoryFrame } from "@fixtures/portfolio-story-frame";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { HomeCapabilitiesSection } from "./capabilities";

function Example({ width = 1120 }: { width?: number }) {
  return (
    <div style={{ maxWidth: width, width: "100%" }}>
      <HomeCapabilitiesSection />
    </div>
  );
}
const meta = {
  component: Example,
  decorators: [
    (Story, context) => (
      <PortfolioStoryFrame mode={context.globals.mode === "dark" ? "dark" : "light"}>
        <Story />
      </PortfolioStoryFrame>
    ),
  ],
  tags: ["autodocs"],
  title: "Home/HomeCapabilitiesSection",
} satisfies Meta<typeof Example>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Narrow: Story = { args: { width: 360 } };
export const Wide: Story = { args: { width: 1440 } };
