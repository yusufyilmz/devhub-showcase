import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "../../buttons/button";
import { Typography } from "../../display/typography";
import { PageShell } from "./page-shell";

const meta = {
  component: PageShell,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  title: "UI/Layout/Page Shell",
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
  },
  render: Studio.render,
};

export const LightPaper: Story = {
  args: {
    ...PaperDark.args,
    appearance: { accent: "emerald", defaultTheme: "light" },
  },
  render: Studio.render,
};

function EmbeddedPreview() {
  const [visible, setVisible] = useState(false);
  return (
    <div className="grid justify-items-start gap-sm p-md">
      <Button
        aria-expanded={visible}
        onClick={() => setVisible(!visible)}
        type="button"
        variant="outline"
      >
        Toggle embedded preview
      </Button>
      {visible && (
        <PageShell
          appearance={{ accent: "violet", defaultTheme: "light" }}
          documentLanguage="en"
          embed
          portfolioTheme="paper"
        >
          <p>Paper preview</p>
        </PageShell>
      )}
    </div>
  );
}

export const EmbeddedLifecycle: Story = { ...Studio, render: () => <EmbeddedPreview /> };
