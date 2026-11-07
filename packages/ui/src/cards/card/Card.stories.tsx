import type { Meta, StoryObj } from "@storybook/react-vite";
import { BellRing } from "lucide-react";

import { Button } from "../../buttons/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./Card";

const meta = {
  component: Card,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  title: "UI/Cards/Card",
} satisfies Meta<typeof Card>;

export default meta;
export const CardTypes = {
  render: () => (
    <div className="grid max-w-3xl gap-6 sm:grid-cols-2">
      <Card
        brief="A short introduction"
        heading={<h3>Case study</h3>}
        title="Case study"
        type="reveal"
      >
        The full story, revealed on focus, hover or activation.
      </Card>
      <Card type="variants" variant="glass">
        Glass variant
      </Card>
      <Card appearance="muted" type="appearance">
        Muted appearance
      </Card>
      <Card
        description="Content card with a title and description."
        title="A new chapter"
        type="content"
        variant="solid"
      />
      <Card trigger={<a href="#project">Preview a project</a>} type="hover">
        Additional project details
      </Card>
      <Card type="tilt">
        <CardContent>A subtle, motion-aware tilt.</CardContent>
      </Card>
      <Card type="animated">
        <CardContent>A short entrance animation.</CardContent>
      </Card>
    </div>
  ),
};
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card className="w-[min(85vw,350px)]">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description goes here</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm">This is the card content. You can put any content here.</p>
      </CardContent>
    </Card>
  ),
};

const notifications = [
  {
    description: "1 hour ago",
    title: "Your call has been confirmed.",
  },
  {
    description: "1 hour ago",
    title: "You have a new message!",
  },
  {
    description: "2 hours ago",
    title: "Your subscription is expiring soon!",
  },
];

export const WithFooter = () => (
  <Card {...argsWithFooter}>
    <CardHeader>
      <CardTitle>Notifications</CardTitle>
      <CardDescription>You have 3 unread messages.</CardDescription>
    </CardHeader>
    <CardContent className="grid gap-4">
      {notifications.map((notification) => (
        <div className="flex items-center gap-4" key={notification.title}>
          <BellRing className="size-6" />
          <div>
            <p>{notification.title}</p>
            <p className="text-foreground/60">{notification.description}</p>
          </div>
        </div>
      ))}
    </CardContent>
    <CardFooter>
      <Button variant="link">Close</Button>
    </CardFooter>
  </Card>
);

const argsWithFooter = {
  className: "w-[min(85vw,350px)]",
};

export const WithAction: Story = {
  render: () => (
    <Card className="w-[min(85vw,350px)]">
      <CardHeader>
        <CardTitle>Create Account</CardTitle>
        <CardDescription>Enter your details to create an account</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">Your account will be created instantly.</p>
      </CardContent>
      <CardFooter className="gap-2">
        <Button className="flex-1" variant="outline">
          Cancel
        </Button>
        <Button className="flex-1">Continue</Button>
      </CardFooter>
    </Card>
  ),
};

export const WithActionAndFooter: Story = {
  render: () => (
    <Card className="w-[min(85vw,350px)]">
      <CardHeader>
        <CardTitle>Notification Settings</CardTitle>
        <CardDescription>Manage your notification preferences</CardDescription>
        <CardAction>
          <Button size="sm" variant="ghost">
            Edit
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          You will receive notifications for important updates.
        </p>
      </CardContent>
    </Card>
  ),
};

export const Multiple: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl">
      <Card>
        <CardHeader>
          <CardTitle>Analytics</CardTitle>
          <CardDescription>View your analytics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">12,345</div>
          <p className="text-xs text-muted-foreground">Total visitors this month</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Revenue</CardTitle>
          <CardDescription>Monthly revenue</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">$54,231</div>
          <p className="text-xs text-muted-foreground">+12% from last month</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Active Users</CardTitle>
          <CardDescription>Currently online</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">573</div>
          <p className="text-xs text-muted-foreground">+201 since yesterday</p>
        </CardContent>
      </Card>
    </div>
  ),
};

export const FullExample: Story = {
  render: () => (
    <Card className="w-[min(85vw,400px)]">
      <CardHeader>
        <CardTitle>Premium Plan</CardTitle>
        <CardDescription>Unlock all features with our premium plan</CardDescription>
        <CardAction>
          <div className="bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-semibold">
            Popular
          </div>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="text-3xl font-bold text-foreground">
              $29<span className="text-sm font-normal text-muted-foreground">/month</span>
            </div>
          </div>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <span className="text-primary">✓</span>
              <span>Unlimited projects</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-primary">✓</span>
              <span>Advanced analytics</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-primary">✓</span>
              <span>Priority support</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-primary">✓</span>
              <span>Custom integrations</span>
            </li>
          </ul>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Get Started</Button>
      </CardFooter>
    </Card>
  ),
};

export const ThemeAdaptive: Story = {
  render: () => (
    <div className="space-y-4 max-w-md">
      <p className="text-sm text-muted-foreground text-center">
        Use the theme controls in Storybook toolbar to see cards adapt!
      </p>
      <Card>
        <CardHeader>
          <CardTitle>Theme Adaptive Card</CardTitle>
          <CardDescription>This card adapts to all theme settings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm">
              <strong>Colors:</strong> Background, text, and borders change with theme and brand
            </p>
            <p className="text-sm">
              <strong>Spacing:</strong> Padding adapts to spacing scale
            </p>
            <p className="text-sm">
              <strong>Borders:</strong> Border radius changes with border setting
            </p>
            <p className="text-sm">
              <strong>Shadows:</strong> Shadow depth adapts to shadow setting
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  ),
};

/** Compare static and interactive elevation using the brand and mode toolbar. */
export const ProductSurfaces: Story = {
  render: () => (
    <div className="grid max-w-3xl gap-6 p-6 sm:grid-cols-2">
      <Card interaction="static">
        <CardHeader>
          <CardTitle>Portfolio settings</CardTitle>
          <CardDescription>Quiet depth for editing surfaces.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Your draft stays private until you publish.</p>
        </CardContent>
        <CardFooter>
          <Button>Save changes</Button>
        </CardFooter>
      </Card>
      <Card asChild interaction="lift">
        <article>
          <CardHeader>
            <CardTitle>Selected work</CardTitle>
            <CardDescription>Hover or focus the link to lift this card.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Soft elevation and a defined border in every palette.</p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline">
              <a href="#project">View project ↗</a>
            </Button>
          </CardFooter>
        </article>
      </Card>
    </div>
  ),
};

export const AccentBackdrop: Story = {
  render: () => (
    <Card backdrop="accent" className="w-[min(85vw,30rem)]">
      <CardHeader>
        <CardTitle>Ready to review</CardTitle>
        <CardDescription>Three new portfolio sections are in your draft.</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button variant="outline">Review draft</Button>
      </CardFooter>
    </Card>
  ),
};

export const Shortcuts: Story = {
  render: () => (
    <Card
      className="w-[min(85vw,30rem)]"
      withBackdrop
      withFooter={<Button variant="outline">Review draft</Button>}
      withHeader={
        <>
          <CardTitle>Ready to review</CardTitle>
          <CardDescription>Three new portfolio sections are in your draft.</CardDescription>
        </>
      }
      withScale
      withShadow={false}
    >
      <CardContent>Review the changes before publishing.</CardContent>
    </Card>
  ),
};
