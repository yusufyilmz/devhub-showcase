import type { Meta, StoryObj } from "@storybook/react-vite";
import { BellRing } from "lucide-react";

import { Button } from "../button/Button";
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
  title: "UI Components/Card",
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card className="ui:w-[350px]">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description goes here</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="ui:text-sm">This is the card content. You can put any content here.</p>
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
  className: "ui:w-[350px]",
};

export const WithAction: Story = {
  render: () => (
    <Card className="ui:w-[350px]">
      <CardHeader>
        <CardTitle>Create Account</CardTitle>
        <CardDescription>Enter your details to create an account</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="ui:text-sm ui:text-muted-foreground">
          Your account will be created instantly.
        </p>
      </CardContent>
      <CardFooter className="ui:gap-2">
        <Button className="ui:flex-1" variant="outline">
          Cancel
        </Button>
        <Button className="ui:flex-1">Continue</Button>
      </CardFooter>
    </Card>
  ),
};

export const WithActionAndFooter: Story = {
  render: () => (
    <Card className="ui:w-[350px]">
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
        <p className="ui:text-sm ui:text-muted-foreground">
          You will receive notifications for important updates.
        </p>
      </CardContent>
    </Card>
  ),
};

export const Multiple: Story = {
  render: () => (
    <div className="ui:grid ui:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ui:gap-4 ui:max-w-5xl">
      <Card>
        <CardHeader>
          <CardTitle>Analytics</CardTitle>
          <CardDescription>View your analytics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="ui:text-2xl ui:font-bold ui:text-foreground">12,345</div>
          <p className="ui:text-xs ui:text-muted-foreground">Total visitors this month</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Revenue</CardTitle>
          <CardDescription>Monthly revenue</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="ui:text-2xl ui:font-bold ui:text-foreground">$54,231</div>
          <p className="ui:text-xs ui:text-muted-foreground">+12% from last month</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Active Users</CardTitle>
          <CardDescription>Currently online</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="ui:text-2xl ui:font-bold ui:text-foreground">573</div>
          <p className="ui:text-xs ui:text-muted-foreground">+201 since yesterday</p>
        </CardContent>
      </Card>
    </div>
  ),
};

export const FullExample: Story = {
  render: () => (
    <Card className="ui:w-[400px]">
      <CardHeader>
        <CardTitle>Premium Plan</CardTitle>
        <CardDescription>Unlock all features with our premium plan</CardDescription>
        <CardAction>
          <div className="ui:bg-primary ui:text-primary-foreground ui:px-2 ui:py-1 ui:rounded ui:text-xs ui:font-semibold">
            Popular
          </div>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="ui:space-y-4">
          <div>
            <div className="ui:text-3xl ui:font-bold ui:text-foreground">
              $29<span className="ui:text-sm ui:font-normal ui:text-muted-foreground">/month</span>
            </div>
          </div>
          <ul className="ui:space-y-2 ui:text-sm">
            <li className="ui:flex ui:items-center ui:gap-2">
              <span className="ui:text-primary">✓</span>
              <span>Unlimited projects</span>
            </li>
            <li className="ui:flex ui:items-center ui:gap-2">
              <span className="ui:text-primary">✓</span>
              <span>Advanced analytics</span>
            </li>
            <li className="ui:flex ui:items-center ui:gap-2">
              <span className="ui:text-primary">✓</span>
              <span>Priority support</span>
            </li>
            <li className="ui:flex ui:items-center ui:gap-2">
              <span className="ui:text-primary">✓</span>
              <span>Custom integrations</span>
            </li>
          </ul>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="ui:w-full">Get Started</Button>
      </CardFooter>
    </Card>
  ),
};

export const ThemeAdaptive: Story = {
  render: () => (
    <div className="ui:space-y-4 ui:max-w-md">
      <p className="ui:text-sm ui:text-muted-foreground ui:text-center">
        Use the theme controls in Storybook toolbar to see cards adapt!
      </p>
      <Card>
        <CardHeader>
          <CardTitle>Theme Adaptive Card</CardTitle>
          <CardDescription>This card adapts to all theme settings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="ui:space-y-2">
            <p className="ui:text-sm">
              <strong>Colors:</strong> Background, text, and borders change with theme and brand
            </p>
            <p className="ui:text-sm">
              <strong>Spacing:</strong> Padding adapts to spacing scale
            </p>
            <p className="ui:text-sm">
              <strong>Borders:</strong> Border radius changes with border setting
            </p>
            <p className="ui:text-sm">
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
