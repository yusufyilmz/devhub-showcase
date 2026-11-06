import type { Meta, StoryObj } from "@storybook/react-vite";

import { Timeline, TimelineBody, TimelineHeader, TimelineIcon, TimelineItem } from "./Timeline";

function Example({ width = 560 }: { width?: number }) {
  return (
    <div style={{ maxWidth: width, padding: 24, width: "100%" }}>
      <Timeline>
        <TimelineItem>
          <TimelineHeader>
            <TimelineIcon />
            <h3>Today</h3>
          </TimelineHeader>
          <TimelineBody>Your next chapter begins here.</TimelineBody>
        </TimelineItem>
        <TimelineItem>
          <TimelineHeader>
            <TimelineIcon />
            <h3>2024</h3>
          </TimelineHeader>
          <TimelineBody>A fictional milestone.</TimelineBody>
        </TimelineItem>
      </Timeline>
    </div>
  );
}
const meta = {
  component: Example,
  tags: ["autodocs"],
  title: "UI/Display/timeline",
} satisfies Meta<typeof Example>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Narrow: Story = { args: { width: 320 } };
export const Wide: Story = { args: { width: 960 } };
