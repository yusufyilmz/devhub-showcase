import type { Meta, StoryObj } from "@storybook/react-vite";

import { profile } from "@shared/config";

import { Header } from "./Header";

const fictional = {
  ...profile,
  github: "https://example.com",
  name: "Alex Morgan",
  portfolioLanguage: "en" as const,
};
const meta = {
  args: { profile: fictional },
  component: Header,
  tags: ["autodocs"],
  title: "UI/header",
} satisfies Meta<typeof Header>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Spanish: Story = { args: { profile: { ...fictional, portfolioLanguage: "es" } } };
export const Turkish: Story = { args: { profile: { ...fictional, portfolioLanguage: "tr" } } };
