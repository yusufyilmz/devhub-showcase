import type { Meta, StoryObj } from "@storybook/react-vite";

import { LoginPanel } from "./login-panel";

const meta = {
  args: {
    description: "Manage and publish your portfolio.",
    googleAction: "#storybook-google",
    sessionEndpoint: "#storybook-session",
    successPath: "#storybook-success",
    title: "Sign in to your studio",
  },
  component: LoginPanel,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
  title: "UI/Forms/Site Login",
} satisfies Meta<typeof LoginPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithError: Story = {
  args: { initialError: "The sign-in session expired. Please try again." },
};
export const Branded: Story = { args: { brand: "MyDevStudio", eyebrow: "YOUR PRIVATE WORKSPACE" } };
