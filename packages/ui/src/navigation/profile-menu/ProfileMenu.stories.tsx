import type { Meta, StoryObj } from "@storybook/react-vite";
import { CreditCard, Folders, Pencil } from "lucide-react";

import { ProfileMenu } from "./ProfileMenu";

const groups = [
  {
    id: "portfolio",
    items: [
      { href: "/portfolio", icon: Folders, label: "My portfolio" },
      { href: "/edit", icon: Pencil, label: "Edit profile" },
    ],
    label: "Portfolio",
  },
  {
    id: "billing",
    items: [{ href: "/billing", icon: CreditCard, label: "Plan and billing" }],
  },
];

function Example({ width = 560 }: { width?: number }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end",
        maxWidth: width,
        padding: 24,
        width: "100%",
      }}
    >
      <ProfileMenu
        groups={groups}
        initials="AY"
        signOut={{ onSignOut: () => undefined }}
        subtitle="@ada"
        title="My profile"
      />
    </div>
  );
}

const meta = {
  component: Example,
  tags: ["autodocs"],
  title: "UI/Navigation/Profile Menu",
} satisfies Meta<typeof Example>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Narrow: Story = { args: { width: 320 } };
export const Wide: Story = { args: { width: 960 } };
