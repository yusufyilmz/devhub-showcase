import { type CSSProperties, useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "../../buttons/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../cards";
import { AgentCompanion } from "./AgentCompanion";
import type { AgentCompanionProps } from "./types";

const meta = {
  args: { agent: "studio", label: "Open Studio assistant" },
  component: Preview,
  parameters: { layout: "fullscreen" },
  title: "UI/Display/Agent Companion",
} satisfies Meta<typeof Preview>;

export default meta;

type Story = StoryObj<typeof meta>;

function Preview(props: Pick<AgentCompanionProps, "agent" | "label" | "notice">) {
  const [open, setOpen] = useState(false);

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Assistant companion</h1>
      <p>Select the character to open its chat.</p>
      {!open && props.notice && (
        <Card id="activity" style={{ marginBlockStart: "1rem", maxWidth: "24rem" }} tabIndex={-1}>
          <CardHeader>
            <CardTitle>Today’s activity</CardTitle>
          </CardHeader>
          <CardContent>{props.notice.message}</CardContent>
        </Card>
      )}
      <section aria-label="Assistant chat preview" hidden={!open}>
        <h2>{props.label.replace(/^Open /, "")}</h2>
        <p>How can I help you today?</p>
        <Button onClick={() => setOpen(false)} type="button" variant="outline">
          Close chat
        </Button>
      </section>
      <div hidden={open}>
        <AgentCompanion {...props} onOpen={() => setOpen(true)} />
      </div>
    </main>
  );
}

export const Studio: Story = {};

export const Portfolio: Story = {
  args: { agent: "portfolio", label: "Open portfolio assistant" },
};

export const FitnessReminder: Story = {
  args: {
    agent: "fitness",
    label: "Open Fitness assistant",
    notice: {
      action: { href: "#activity", label: "View activity" },
      id: "afternoon-walk",
      message: "Afternoon walk",
      title: "Activity reminder",
    },
  },
};

const motionCharacters = [
  { agent: "studio", label: "Studio" },
  { agent: "portfolio", label: "Portfolio" },
  { agent: "fitness", label: "Fitness" },
] as const;

function MotionPreview() {
  const [replay, setReplay] = useState(0);
  const [chat, setChat] = useState("");

  return (
    <main style={{ display: "grid", gap: "1.25rem", justifyItems: "center", padding: "2rem 1rem" }}>
      <h1>Meet the assistant companions</h1>
      <div
        key={replay}
        style={
          {
            "--agent-launcher-size": "clamp(3.5rem, 20vw, 6rem)",
            display: "flex",
            flexWrap: "wrap",
            gap: "clamp(0.75rem, 5vw, 2rem)",
            justifyContent: "center",
            paddingBlock: "1.25rem",
          } as CSSProperties
        }
      >
        {motionCharacters.map(({ agent, label }) => (
          <div key={agent} style={{ display: "grid", gap: "0.75rem", justifyItems: "center" }}>
            <AgentCompanion
              agent={agent}
              label={`Open ${label} assistant`}
              onOpen={() => setChat(label)}
              placement="inline"
            />
            <span>{label}</span>
          </div>
        ))}
      </div>
      <Button onClick={() => setReplay((value) => value + 1)} type="button" variant="outline">
        Replay entrance
      </Button>
      {chat && (
        <Card aria-label="Assistant chat preview" role="region">
          <CardHeader>
            <CardTitle>{chat} assistant</CardTitle>
          </CardHeader>
          <CardContent>
            <p>How can I help you today?</p>
            <Button onClick={() => setChat("")} type="button" variant="outline">
              Close chat
            </Button>
          </CardContent>
        </Card>
      )}
    </main>
  );
}

export const Motion: Story = {
  render: () => <MotionPreview />,
};
