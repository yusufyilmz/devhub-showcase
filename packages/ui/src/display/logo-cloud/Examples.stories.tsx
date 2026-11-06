import type { Meta, StoryObj } from "@storybook/react-vite";

import { LogoCloud } from "./LogoCloud";

const mark =
  "data:image/svg+xml," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="120" height="40"><text x="10" y="28" font-size="22">Studio</text></svg>',
  );
const meta = {
  args: { logos: [{ alt: "Fictional studio", src: mark }] },
  component: LogoCloud,
  tags: ["autodocs"],
  title: "UI/Display/Logo cloud",
} satisfies Meta<typeof LogoCloud>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Linked: Story = {
  args: { logos: [{ alt: "Fictional studio", href: "https://example.com", src: mark }] },
};
export const Empty: Story = { args: { logos: [] } };
