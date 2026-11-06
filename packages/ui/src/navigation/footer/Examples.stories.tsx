import type { Meta, StoryObj } from "@storybook/react-vite";

import { profile } from "@shared/config";

import { Footer } from "./Footer";

const fictional = {
  ...profile,
  github: "https://example.com",
  name: "Alex Morgan",
  portfolioLanguage: "en" as const,
};
const meta = {
  args: { profile: fictional },
  component: Footer,
  tags: ["autodocs"],
  title: "UI/Navigation/footer",
} satisfies Meta<typeof Footer>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Spanish: Story = { args: { profile: { ...fictional, portfolioLanguage: "es" } } };
export const Turkish: Story = { args: { profile: { ...fictional, portfolioLanguage: "tr" } } };
