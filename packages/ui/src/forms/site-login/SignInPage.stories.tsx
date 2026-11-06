import type { Meta, StoryObj } from "@storybook/react-vite";

import { copy } from "@shared/config";

import { ThemeToggle } from "../../theme/theme-toggle";
import { LoginPanel } from "./login-panel";
import { LoginTitle } from "./login-title";

const content = copy.loginSites["my-dev-studio"];
const meta = {
  args: {
    backHref: content.backHref,
    backLabel: content.backLabel,
    brand: content.brand,
    brandActions: <ThemeToggle />,
    description: content.description,
    eyebrow: content.eyebrow,
    googleAction: "#storybook-google",
    sessionEndpoint: "#storybook-session",
    submitLabel: content.submitLabel,
    successPath: "#storybook-success",
    title: <LoginTitle emphasis={content.titleEmphasis} lines={content.titleLines} />,
  },
  component: LoginPanel,
  parameters: { layout: "fullscreen", pageCanvas: true },
  title: "Pages/Sign In",
} satisfies Meta<typeof LoginPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const SignInError: Story = { args: { initialError: content.errors.google_failed } };
