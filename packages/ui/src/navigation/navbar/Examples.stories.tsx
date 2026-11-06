import type { Meta, StoryObj } from "@storybook/react-vite";

import { profile } from "@shared/config";

import { Navbar } from "./Navbar";

const fictional = {
  ...profile,
  github: "https://example.com",
  name: "Alex Morgan",
  portfolioLanguage: "en" as const,
};
const meta = {
  args: { profile: fictional },
  component: Navbar,
  tags: ["autodocs"],
  title: "UI/Navigation/navbar",
} satisfies Meta<typeof Navbar>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Spanish: Story = { args: { profile: { ...fictional, portfolioLanguage: "es" } } };
export const Turkish: Story = { args: { profile: { ...fictional, portfolioLanguage: "tr" } } };
