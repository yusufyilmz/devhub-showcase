import type { Meta, StoryObj } from "@storybook/react-vite";

import { ContactForm } from "./ContactForm";

function Example({ width = 560, preview = false }: { width?: number; preview?: boolean }) {
  return (
    <div style={{ maxWidth: width, padding: 24, width: "100%" }}>
      <ContactForm email="hello@example.com" preview={preview} />
    </div>
  );
}
const meta = {
  component: Example,
  tags: ["autodocs"],
  title: "UI/Forms/Contact Form",
} satisfies Meta<typeof Example>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Narrow: Story = { args: { width: 320 } };
export const Wide: Story = { args: { width: 960 } };

export const Preview: Story = { args: { preview: true, width: 320 } };
