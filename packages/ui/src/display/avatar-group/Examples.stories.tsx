import type { Meta, StoryObj } from "@storybook/react-vite";

import { AvatarGroup } from "./AvatarGroup";

function Example({ width = 560 }: { width?: number }) {
  return (
    <div style={{ maxWidth: width, padding: 24, width: "100%" }}>
      <AvatarGroup
        avatars={[
          { alt: "Alex Morgan", value: "AM" },
          { alt: "Jamie Rivera", value: "JR" },
          { alt: "Sam Kim", value: "SK" },
        ]}
      />
    </div>
  );
}
const meta = {
  component: Example,
  tags: ["autodocs"],
  title: "UI/Display/avatar-group",
} satisfies Meta<typeof Example>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Narrow: Story = { args: { width: 320 } };
export const Wide: Story = { args: { width: 960 } };
