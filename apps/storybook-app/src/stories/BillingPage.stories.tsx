import type { Meta, StoryObj } from "@storybook/react-vite";

import { StudioHeading, StudioShell } from "@shared/assistant/portfolio";
import { BillingSettings } from "@shared/billing/components";
import type { BillingRequest } from "@shared/billing/types";
import { ThemeToggle } from "@shared/ui/theme";

const request: BillingRequest = async (input, init) => {
  if (init?.method && init.method !== "GET") {
    return Response.json({ code: "unavailable" }, { status: 503 });
  }
  if (input.endsWith("/pricing")) {
    return Response.json({
      amount: 1800,
      available: true,
      chatLimit: 100,
      currency: "usd",
      editorLimit: 30,
      interval: "month",
      mode: "test",
    });
  }
  if (input.endsWith("/profile")) {
    return Response.json({ id: "fixture", isPublic: false });
  }
  return Response.json({
    access: "free",
    aiConfigured: true,
    assignedProfileId: null,
    chatEnabled: false,
    limits: { portfolio_chat: 0, studio_assistant: 0 },
    periodEnd: null,
    periodStart: null,
    plan: "free",
    usage: { portfolio_chat: 0, studio_assistant: 0 },
  });
};

const meta = {
  args: {
    heading: (
      <StudioHeading
        description="Review your plan and usage."
        eyebrow="Account and billing"
        title="Subscription settings"
      />
    ),
    request,
  },
  component: BillingSettings,
  decorators: [
    (Story) => (
      <StudioShell
        contentId="admin-content"
        tools={
          <div className="admin-tools">
            <ThemeToggle />
          </div>
        }
      >
        <Story />
      </StudioShell>
    ),
  ],
  parameters: { layout: "fullscreen", pageCanvas: true },
  title: "Pages/Billing",
} satisfies Meta<typeof BillingSettings>;

export default meta;
type Story = StoryObj<typeof meta>;
export const FreePlan: Story = {};
export const ReturnedFromCheckout: Story = { args: { returned: true } };
