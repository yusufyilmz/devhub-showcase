/** biome-ignore-all lint/a11y/noSvgWithoutTitle: <explanation> */
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Tooltip, TooltipList } from "./Tooltip";

const meta: Meta<typeof Tooltip> = {
  argTypes: {
    arrow: {
      control: "boolean",
      description: "Show arrow pointing to trigger",
    },
    delay: {
      control: "number",
      description: "Delay before showing tooltip (ms)",
    },
    disabled: {
      control: "boolean",
      description: "Disable tooltip",
    },
    placement: {
      control: "select",
      description: "Tooltip placement relative to trigger",
      options: ["top", "bottom", "left", "right"],
    },
    title: {
      control: "text",
      description: "Tooltip content",
    },
    variant: {
      control: "select",
      description: "Visual style variant",
      options: ["default", "dark", "light", "minimal"],
    },
  },
  component: Tooltip,
  parameters: {
    docs: {
      description: {
        component:
          "A versatile tooltip component with smooth animations, multiple variants, and flexible positioning.",
      },
    },
    layout: "centered",
  },
  title: "Components/Tooltip",
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

// Button component for examples
const Button = ({ children, ...props }: any) => (
  <button
    className="rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
    {...props}
  >
    {children}
  </button>
);

const IconButton = ({ children, ...props }: any) => (
  <button className="rounded-full bg-gray-100 p-2 transition-colors hover:bg-gray-200" {...props}>
    {children}
  </button>
);

// Phone icon
const PhoneIcon = () => (
  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
  </svg>
);

export const Default: Story = {
  args: {
    arrow: true,
    delay: 0,
    disabled: false,
    placement: "top",
    title: "This is a tooltip",
    variant: "default",
  },
  render: (args) => (
    <Tooltip {...args}>
      <Button>Hover me</Button>
    </Tooltip>
  ),
};

export const Placements: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-8 p-8">
      <Tooltip title="Top tooltip" placement="top">
        <Button>Top</Button>
      </Tooltip>
      <Tooltip title="Bottom tooltip" placement="bottom">
        <Button>Bottom</Button>
      </Tooltip>
      <Tooltip title="Left tooltip" placement="left">
        <Button>Left</Button>
      </Tooltip>
      <Tooltip title="Right tooltip" placement="right">
        <Button>Right</Button>
      </Tooltip>
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="flex gap-4 p-8">
      <Tooltip title="Default variant" variant="default">
        <Button>Default</Button>
      </Tooltip>
      <Tooltip title="Dark variant" variant="dark">
        <Button>Dark</Button>
      </Tooltip>
      <Tooltip title="Light variant" variant="light">
        <Button>Light</Button>
      </Tooltip>
      <Tooltip title="Minimal variant" variant="minimal">
        <Button>Minimal</Button>
      </Tooltip>
    </div>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <div className="flex gap-4 p-8">
      <Tooltip title="Call us" placement="top">
        <IconButton>
          <PhoneIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Email us" placement="top">
        <IconButton>
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
          </svg>
        </IconButton>
      </Tooltip>
      <Tooltip title="Settings" placement="top">
        <IconButton>
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
              clipRule="evenodd"
            />
          </svg>
        </IconButton>
      </Tooltip>
    </div>
  ),
};

export const WithDelay: Story = {
  render: () => (
    <div className="flex gap-4 p-8">
      <Tooltip title="No delay" delay={0}>
        <Button>No delay</Button>
      </Tooltip>
      <Tooltip title="500ms delay" delay={500}>
        <Button>500ms delay</Button>
      </Tooltip>
      <Tooltip title="1000ms delay" delay={1000}>
        <Button>1s delay</Button>
      </Tooltip>
    </div>
  ),
};

export const RichContent: Story = {
  render: () => (
    <div className="flex gap-4 p-8">
      <Tooltip
        title={
          <div className="text-center">
            <div className="font-bold">Rich Content</div>
            <div className="text-xs opacity-75">With multiple lines</div>
          </div>
        }
        variant="light"
      >
        <Button>Rich tooltip</Button>
      </Tooltip>
    </div>
  ),
};

// AnimatedTooltip Stories
const animatedMeta: Meta<typeof Tooltip> = {
  component: Tooltip,
  parameters: {
    docs: {
      description: {
        component: "Advanced tooltip with cursor following, rich animations, and gradient effects.",
      },
    },
    layout: "centered",
  },
  title: "Components/AnimatedTooltip",
};

type AnimatedStory = StoryObj<typeof Tooltip>;

export const AnimatedDefault: AnimatedStory = {
  args: {
    arrow: true,
    title: "This follows your cursor!",
    variant: "default",
  },
  render: (args) => (
    <Tooltip {...args}>
      <Button>Animated Tooltip</Button>
    </Tooltip>
  ),
};

export const AnimatedVariants: AnimatedStory = {
  render: () => (
    <div className="flex gap-4 p-8">
      <Tooltip title="Default variant" variant="default">
        <Button>Default</Button>
      </Tooltip>
      <Tooltip title="Dark variant" variant="dark">
        <Button>Default</Button>
      </Tooltip>
      <Tooltip title="Minimal variant" variant="minimal">
        <Button>Minimal</Button>
      </Tooltip>
    </div>
  ),
};

export const CursorFollowing: AnimatedStory = {
  render: () => (
    <div className="p-16">
      <Tooltip title="I follow your mouse!" variant="dark">
        <div className="flex h-32 w-64 cursor-pointer items-center justify-center rounded-lg bg-gradient-to-r from-purple-400 to-pink-400 font-semibold text-white">
          Move your mouse over me
        </div>
      </Tooltip>
    </div>
  ),
};

// TooltipList Story
const listMeta: Meta<typeof TooltipList> = {
  component: TooltipList,
  parameters: {
    layout: "centered",
  },
  title: "Components/TooltipList",
};

type ListStory = StoryObj<typeof TooltipList>;

export const TeamTooltips: ListStory = {
  args: {
    items: [
      {
        designation: "Frontend Developer",
        id: 1,
        image:
          "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3387&q=80",
        name: "John Doe",
      },
      {
        designation: "Backend Developer",
        id: 2,
        image:
          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80",
        name: "Jane Smith",
      },
      {
        designation: "UI/UX Designer",
        id: 3,
        image:
          "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2061&q=80",
        name: "Mike Johnson",
      },
      {
        designation: "Product Manager",
        id: 4,
        image:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        name: "Sarah Wilson",
      },
    ],
  },
};

export { animatedMeta as AnimatedTooltipMeta, listMeta as TooltipListMeta };
