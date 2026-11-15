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
  title: "UI/Navigation/Footer",
} satisfies Meta<typeof Footer>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Spanish: Story = { args: { profile: { ...fictional, portfolioLanguage: "es" } } };
export const Turkish: Story = { args: { profile: { ...fictional, portfolioLanguage: "tr" } } };
export const Platform: Story = {
  args: {
    brand: <a href="/">MyDevStudio</a>,
    credit: "© MyDevStudio",
    description: "A place for your portfolio and CV.",
    groups: [
      { links: [{ href: "/#examples", label: "Portfolio examples" }], title: "Product" },
      { links: [{ href: "/#questions", label: "Questions and answers" }], title: "Resources" },
      { links: [{ href: "/login", label: "Sign in" }], title: "Account" },
    ],
  },
};
export const Compact: Story = {
  args: { brand: <a href="/">MyDevStudio</a>, credit: "© MyDevStudio" },
};
