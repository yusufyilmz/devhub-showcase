import type { Meta, StoryObj } from "@storybook/react-vite";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./Accordion";

/**
 * A vertically stacked set of interactive headings that each reveal a section
 * of content.
 */
const meta: Meta<typeof Accordion> = {
  args: {
    collapsible: true,
    disabled: false,
    type: "single",
  },
  argTypes: {
    collapsible: {
      control: "boolean",
      description: "Can an open accordion be collapsed using the trigger",
      if: { arg: "type", eq: "single" },
    },
    disabled: {
      control: "boolean",
    },
    type: {
      control: "radio",
      description: "Type of accordion behavior",
      options: ["single", "multiple"],
    },
  },
  component: Accordion,
  render: (args) => (
    <Accordion {...args}>
      <AccordionItem value="item-1">
        <AccordionTrigger>Is it accessible?</AccordionTrigger>
        <AccordionContent>Yes. It adheres to the WAI-ARIA design pattern.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Is it styled?</AccordionTrigger>
        <AccordionContent>
          Yes. It comes with default styles that matches the other components' aesthetic.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Is it animated?</AccordionTrigger>
        <AccordionContent>
          Yes. It's animated by default, but you can disable it if you prefer.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
  tags: ["autodocs"],
  title: "UI/Layout/Accordion",
};

export default meta;

/**
 * The default behavior of the accordion allows only one item to be open.
 */
export const Default: StoryObj<typeof Accordion> = {};

export const NarrowCanvas = {
  ...Default,
  decorators: [
    (Story: any) => (
      <div style={{ maxWidth: 320, width: "100%" }}>
        <Story />
      </div>
    ),
  ],
};

export const WideCanvas = {
  ...Default,
  decorators: [
    (Story: any) => (
      <div style={{ maxWidth: 960, width: "100%" }}>
        <Story />
      </div>
    ),
  ],
};
