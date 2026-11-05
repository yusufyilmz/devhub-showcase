import type { Meta, StoryObj } from "@storybook/react-vite";

import { PortfolioStoryFrame } from "../../../../../tools/test/fixtures/portfolio-story-frame";
import { HomePricingSection } from "./pricing";

const action = { href: "/login", label: "Create your portfolio", signedIn: false };
function Example({ width = 1120 }: { width?: number }) {
  return (
    <div style={{ maxWidth: width, width: "100%" }}>
      <HomePricingSection action={action} />
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
  title: "Home/HomePricingSection",
} satisfies Meta<typeof Example>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Narrow: Story = { args: { width: 360 } };
export const Wide: Story = { args: { width: 1440 } };
