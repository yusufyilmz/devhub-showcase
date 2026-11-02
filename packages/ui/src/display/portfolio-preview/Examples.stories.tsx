import type { Meta, StoryObj } from "@storybook/react-vite";

import { ResponsivePortfolioPreview } from "./ResponsivePortfolioPreview";

const meta = {
  args: {
    children: (
      <main>
        <h1>A private draft</h1>
        <p>Resize this preview without saving.</p>
      </main>
    ),
  },
  component: ResponsivePortfolioPreview,
  tags: ["autodocs"],
  title: "UI/Responsive portfolio preview",
} satisfies Meta<typeof ResponsivePortfolioPreview>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Dark: Story = {
  args: { appearance: { accent: "violet", defaultTheme: "dark", theme: "studio" } },
};
export const Empty: Story = { args: { children: null } };
