import type { Meta, StoryObj } from "@storybook/react-vite";

import { Card } from "../../cards";
import { Badge } from "../../feedback";
import { FlexCol, FlexWrap } from "../../layout";
import { Typography } from "../typography";
import { Avatar, AvatarFallback, AvatarImage } from "./Avatar";
import { AvatarVariants, AvatarWithText, GroupAvatar, UserAvatar } from "./AvatarVariants";

/**
 * An image element with a fallback for representing the user.
 */
const meta: Meta<typeof Avatar> = {
  argTypes: {},
  component: Avatar,
  parameters: {
    layout: "centered",
  },
  render: (args) => (
    <Avatar {...args}>
      <AvatarImage src="https://github.com/shadcn.png" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  ),
  tags: ["autodocs"],
  title: "UI/Avatar",
};

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form of the avatar.
 */
export const Default: Story = {};

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

export const AvatarDemo: React.FC = () => {
  const sampleUsers = [
    {
      name: "John Doe",
      src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    },
    {
      name: "Jane Smith",
      src: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
    },
    {
      name: "Mike Johnson",
      src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    },
    {
      name: "Sarah Wilson",
      src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    },
    {
      name: "Alex Brown",
      src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    },
  ];

  return (
    <FlexCol gap="xl" className="p-8">
      <div>
        <Typography variant="h1" className="font-bold mb-4">
          Avatar Component Demo
        </Typography>
        <Typography variant="body1" className="text-[var(--muted-foreground)] mb-8">
          Flexible avatar component with multiple sizes, variants, and specialized avatar types.
        </Typography>
      </div>

      {/* Basic Avatar Sizes */}
      <Card className="p-6">
        <Typography variant="h3" className="font-semibold mb-4">
          📏 Avatar Sizes
        </Typography>
        <FlexWrap gap="md" align="center">
          <div className="flex flex-col items-center gap-2">
            <AvatarVariants size="xs" fallback="XS" />
            <span className="text-xs text-[var(--muted-foreground)]">XS</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <AvatarVariants size="sm" fallback="SM" />
            <span className="text-xs text-[var(--muted-foreground)]">SM</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <AvatarVariants size="default" fallback="MD" />
            <span className="text-xs text-[var(--muted-foreground)]">Default</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <AvatarVariants size="lg" fallback="LG" />
            <span className="text-xs text-[var(--muted-foreground)]">LG</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <AvatarVariants size="xl" fallback="XL" />
            <span className="text-xs text-[var(--muted-foreground)]">XL</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <AvatarVariants size="2xl" fallback="2XL" />
            <span className="text-xs text-[var(--muted-foreground)]">2XL</span>
          </div>
        </FlexWrap>
      </Card>

      {/* Avatar Variants */}
      <Card className="p-6">
        <Typography variant="h3" className="font-semibold mb-4">
          🎨 Avatar Variants
        </Typography>
        <FlexWrap gap="md">
          <AvatarVariants variant="default" fallback="Default" />
          <AvatarVariants variant="primary" fallback="Primary" />
          <AvatarVariants variant="secondary" fallback="Secondary" />
          <AvatarVariants variant="accent" fallback="Accent" />
          <AvatarVariants variant="success" fallback="Success" />
          <AvatarVariants variant="warning" fallback="Warning" />
          <AvatarVariants variant="destructive" fallback="Error" />
          <AvatarVariants variant="info" fallback="Info" />
        </FlexWrap>
      </Card>

      {/* Status Indicators */}
      <Card className="p-6">
        <Typography variant="h3" className="font-semibold mb-4">
          🟢 Status Indicators
        </Typography>
        <FlexWrap gap="md">
          <div className="flex flex-col items-center gap-2">
            <AvatarVariants showStatus status="online" fallback="Online" />
            <span className="text-xs text-[var(--muted-foreground)]">Online</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <AvatarVariants showStatus status="offline" fallback="Offline" />
            <span className="text-xs text-[var(--muted-foreground)]">Offline</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <AvatarVariants showStatus status="away" fallback="Away" />
            <span className="text-xs text-[var(--muted-foreground)]">Away</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <AvatarVariants showStatus status="busy" fallback="Busy" />
            <span className="text-xs text-[var(--muted-foreground)]">Busy</span>
          </div>
        </FlexWrap>
      </Card>

      {/* User Avatars */}
      <Card className="p-6">
        <Typography variant="h3" className="font-semibold mb-4">
          👤 User Avatars
        </Typography>
        <FlexWrap gap="md">
          <UserAvatar name="John Doe" src={sampleUsers[0].src} showStatus status="online" />
          <UserAvatar name="Jane Smith" src={sampleUsers[1].src} showStatus status="away" />
          <UserAvatar name="Mike Johnson" showStatus status="busy" />
          <UserAvatar name="Sarah Wilson" src={sampleUsers[3].src} showStatus status="offline" />
        </FlexWrap>
      </Card>

      {/* Group Avatars */}
      <Card className="p-6">
        <Typography variant="h3" className="font-semibold mb-4">
          👥 Group Avatars
        </Typography>
        <FlexCol gap="md">
          <div>
            <Typography variant="h6" className="font-medium mb-2">
              Small Group (3 people)
            </Typography>
            <GroupAvatar users={sampleUsers.slice(0, 3)} size="sm" />
          </div>
          <div>
            <Typography variant="h6" className="font-medium mb-2">
              Large Group (5 people, max 3 visible)
            </Typography>
            <GroupAvatar users={sampleUsers} size="default" maxVisible={3} />
          </div>
          <div>
            <Typography variant="h6" className="font-medium mb-2">
              Single User
            </Typography>
            <GroupAvatar users={[sampleUsers[0]]} size="lg" />
          </div>
        </FlexCol>
      </Card>

      {/* Avatar with Text */}
      <Card className="p-6">
        <Typography variant="h3" className="font-semibold mb-4">
          📝 Avatar with Text
        </Typography>
        <FlexCol gap="md">
          <AvatarWithText
            name="John Doe"
            description="Software Engineer"
            src={sampleUsers[0].src}
            showStatus
            status="online"
          />
          <AvatarWithText
            name="Jane Smith"
            description="Product Manager"
            src={sampleUsers[1].src}
            showStatus
            status="away"
          />
          <AvatarWithText name="Mike Johnson" description="Designer" showStatus status="busy" />
        </FlexCol>
      </Card>

      {/* Real-world Examples */}
      <Card className="p-6">
        <Typography variant="h3" className="font-semibold mb-4">
          🌟 Real-world Examples
        </Typography>
        <FlexCol gap="md">
          {/* Team Members */}
          <div className="p-4 border border-[var(--border)] rounded-lg">
            <Typography variant="h6" className="font-semibold mb-3">
              Team Members
            </Typography>
            <FlexCol gap="sm">
              {sampleUsers.slice(0, 3).map((user, index) => (
                <div key={index} className="flex items-center justify-between">
                  <AvatarWithText
                    name={user.name}
                    description={`Member ${index + 1}`}
                    src={user.src}
                    showStatus
                    status={index === 0 ? "online" : index === 1 ? "away" : "offline"}
                  />
                  <Badge variant="outline">Active</Badge>
                </div>
              ))}
            </FlexCol>
          </div>

          {/* Chat Participants */}
          <div className="p-4 border border-[var(--border)] rounded-lg">
            <Typography variant="h6" className="font-semibold mb-3">
              Chat Participants
            </Typography>
            <div className="flex items-center gap-2">
              <GroupAvatar users={sampleUsers.slice(0, 4)} size="sm" maxVisible={4} />
              <span className="text-sm text-[var(--muted-foreground)]">
                {sampleUsers.length} participants
              </span>
            </div>
          </div>

          {/* User Profile */}
          <div className="p-4 border border-[var(--border)] rounded-lg">
            <Typography variant="h6" className="font-semibold mb-3">
              User Profile
            </Typography>
            <div className="flex items-center gap-4">
              <UserAvatar
                name="Alex Brown"
                src={sampleUsers[4].src}
                size="xl"
                showStatus
                status="online"
              />
              <div>
                <Typography variant="h6" className="font-semibold">
                  Alex Brown
                </Typography>
                <Typography variant="body2" className="text-[var(--muted-foreground)]">
                  Senior Developer
                </Typography>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="success" size="sm">
                    Online
                  </Badge>
                  <Badge variant="outline" size="sm">
                    Available
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </FlexCol>
      </Card>
    </FlexCol>
  );
};
