import type { Meta, StoryObj } from "@storybook/react-vite";
import { AlertTriangle, Info } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "./Alert";

const meta: Meta<typeof Alert> = {
  component: Alert,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  title: "UI/Feedback/Alert",
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Alert role="status">
      <Info aria-hidden="true" />
      <AlertTitle>Draft is private</AlertTitle>
      <AlertDescription>
        Only you can see these changes until you publish your portfolio.
      </AlertDescription>
    </Alert>
  ),
};

export const Destructive: Story = {
  render: () => (
    <Alert variant="destructive">
      <AlertTriangle aria-hidden="true" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>Your session has expired. Please log in again.</AlertDescription>
    </Alert>
  ),
};

export const NarrowCanvas: StoryObj<typeof meta> = {
  ...Default,
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 320, width: "100%" }}>
        <Story />
      </div>
    ),
  ],
};

export const WideCanvas: StoryObj<typeof meta> = {
  ...Default,
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 960, width: "100%" }}>
        <Story />
      </div>
    ),
  ],
};

export const WithoutIcon: Story = {
  render: () => (
    <Alert role="status">
      <AlertTitle>Draft saved</AlertTitle>
      <AlertDescription>Your changes are ready to review.</AlertDescription>
    </Alert>
  ),
};
