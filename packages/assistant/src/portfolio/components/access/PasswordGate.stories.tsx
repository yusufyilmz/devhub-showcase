import type { Meta, StoryObj } from "@storybook/react-vite";

import { PasswordGate } from "./PasswordGate";

const meta = {
  component: PasswordGate,
  parameters: { layout: "fullscreen", pageCanvas: true },
  title: "Assistant/Portfolio/Access/Password Gate",
} satisfies Meta<typeof PasswordGate>;
export default meta;
export const Locked: StoryObj<typeof meta> = {
  args: {
    unlock: async () => {
      throw new Error("Could not unlock this portfolio.");
    },
  },
};
