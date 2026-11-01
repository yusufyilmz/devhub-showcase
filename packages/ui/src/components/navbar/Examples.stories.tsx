import type { Meta, StoryObj } from "@storybook/react-vite";

import { profile } from "@shared/config";

import { Navbar } from "./Navbar";

const fictional = {
  ...profile,
  name: "Alex Morgan",
  github: "https://example.com",
  portfolioLanguage: "en" as const,
};
const meta = {
  title: "UI/navbar",
  component: Navbar,
  args: { profile: fictional },
  tags: ["autodocs"],
} satisfies Meta<typeof Navbar>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Spanish: Story = { args: { profile: { ...fictional, portfolioLanguage: "es" } } };
export const Turkish: Story = { args: { profile: { ...fictional, portfolioLanguage: "tr" } } };
