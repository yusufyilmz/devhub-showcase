import type { Meta, StoryObj } from "@storybook/react-vite";

import { profile } from "@shared/config";

import { Button } from "../../buttons/button";
import { ThemeToggle } from "../../theme/theme-toggle";
import { Brand } from "../brand";
import { SkipLink } from "../skip-link/SkipLink";
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
  title: "UI/Navigation/Header",
} satisfies Meta<typeof Header>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Spanish: Story = { args: { profile: { ...fictional, portfolioLanguage: "es" } } };
export const Turkish: Story = { args: { profile: { ...fictional, portfolioLanguage: "tr" } } };

export const Branded: Story = {
  args: {
    actions: (
      <>
        <Button href="#sign-in" variant="outline">
          Sign in
        </Button>
        <ThemeToggle />
      </>
    ),
    brand: <Brand />,
    links: [
      { href: "#examples", label: "Portfolio examples" },
      { href: "#questions", label: "Questions and answers" },
    ],
  },
  render: (args) => (
    <>
      <SkipLink href="#examples">Skip to content</SkipLink>
      <Header {...args} />
      <main id="examples" tabIndex={-1}>
        Portfolio examples
      </main>
    </>
  ),
};
