import type { Meta, StoryObj } from "@storybook/react-vite";

import { Typography } from "../../display/typography";
import { PageShell } from "./page-shell";

const meta = {
  component: PageShell,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  title: "Components/Layout/PageShell",
} satisfies Meta<typeof PageShell>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Studio: Story = {
  args: {
    appearance: { accent: "cyan", defaultTheme: "light" },
    children: null,
    documentLanguage: "en",
    embed: true,
    portfolioTheme: "studio",
    storageKey: "storybook-document-shell",
  },
  render: (args) => (
    <PageShell {...args}>
      <main className="min-h-screen p-8">
        <Typography variant="h3">Document shell</Typography>
        <Typography className="mt-2" color="muted" variant="body2">
          Theme, accent, and notification providers used by the app root layout.
        </Typography>
      </main>
    </PageShell>
  ),
};

export const PaperDark: Story = {
  args: {
    ...Studio.args,
    appearance: { accent: "violet", defaultTheme: "dark" },
    portfolioTheme: "paper",
    storageKey: "storybook-document-shell-paper",
  },
  render: Studio.render,
};
