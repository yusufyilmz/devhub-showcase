import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "../../buttons/button";
import { ComponentCustomizer } from "./ComponentCustomizer";

const meta = {
  args: {
    children: <Button>Preview action</Button>,
    componentDescription: "Inspect the shared action button.",
    componentName: "Button",
  },
  component: ComponentCustomizer,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
  title: "UI/Customizers/Component Customizer",
} satisfies Meta<typeof ComponentCustomizer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const PreviewOnly: Story = { args: { showCode: false, showProps: false, showTheme: false } };
export const WithProps: Story = { args: { propsConfig: { disabled: false, variant: "outline" } } };
