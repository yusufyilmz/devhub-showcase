import type { Meta, StoryObj } from "@storybook/react-vite";

import { DataTable } from "./DataTable";

const data = [
  {
    header: "Cover page",
    id: 1,
    limit: "5",
    reviewer: "Eddie Lake",
    status: "In Process",
    target: "18",
    type: "Cover page",
  },
  {
    header: "Table of contents",
    id: 2,
    limit: "24",
    reviewer: "Eddie Lake",
    status: "Done",
    target: "29",
    type: "Table of contents",
  },
  {
    header: "Executive summary",
    id: 3,
    limit: "13",
    reviewer: "Eddie Lake",
    status: "Done",
    target: "10",
    type: "Narrative",
  },
  {
    header: "Technical approach",
    id: 4,
    limit: "23",
    reviewer: "Jamik Tashpulatov",
    status: "Done",
    target: "27",
    type: "Narrative",
  },
  {
    header: "Design",
    id: 5,
    limit: "16",
    reviewer: "Jamik Tashpulatov",
    status: "In Process",
    target: "2",
    type: "Narrative",
  },
  {
    header: "Capabilities",
    id: 6,
    limit: "8",
    reviewer: "Jamik Tashpulatov",
    status: "In Process",
    target: "20",
    type: "Narrative",
  },
  {
    header: "Integration with existing systems",
    id: 7,
    limit: "21",
    reviewer: "Jamik Tashpulatov",
    status: "In Process",
    target: "19",
    type: "Narrative",
  },
  {
    header: "Innovation and Advantages",
    id: 8,
    limit: "26",
    reviewer: "Assign reviewer",
    status: "Done",
    target: "25",
    type: "Narrative",
  },
];

const meta = {
  args: {
    data,
  },
  component: DataTable,
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-background p-4">
        <div className="mx-auto max-w-6xl">
          <Story />
        </div>
      </div>
    ),
  ],
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  title: "UI/Display/Data Table",
} satisfies Meta<typeof DataTable>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithCustomData: Story = {
  args: {
    data: data.map((item, index) => ({
      ...item,
      header: `${item.header} (Row ${index + 1})`,
    })),
  },
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
