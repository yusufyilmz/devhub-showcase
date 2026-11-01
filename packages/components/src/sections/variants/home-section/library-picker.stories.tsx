import type { Meta, StoryObj } from "@storybook/react-vite";

import { PortfolioStoryFrame } from "../../__fixtures__/portfolio-story-frame";
import { LibraryPicker } from "./library-picker";

function Example({ width = 1120 }: { width?: number }) {
  return (
    <div style={{ width: "100%", maxWidth: width }}>
      <LibraryPicker
        items={[
          {
            id: "first",
            title: "Services",
            description: "What you offer",
            content: <p>Design and development.</p>,
          },
          {
            id: "second",
            title: "Timeline",
            description: "Your journey",
            content: <p>Your next chapter.</p>,
          },
        ]}
      />
    </div>
  );
}
const meta = {
  title: "Home/LibraryPicker",
  component: Example,
  tags: ["autodocs"],
  decorators: [
    (Story, context) => (
      <PortfolioStoryFrame mode={context.globals.mode === "dark" ? "dark" : "light"}>
        <Story />
      </PortfolioStoryFrame>
    ),
  ],
} satisfies Meta<typeof Example>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Narrow: Story = { args: { width: 360 } };
export const Wide: Story = { args: { width: 1440 } };
