import type { Meta, StoryObj } from "@storybook/react-vite";

import { ErrorPage } from "../../feedback/error-page";
import { NotFoundPage } from "../not-found-page/NotFoundPage";

const meta = {
  component: NotFoundPage,
  parameters: { layout: "fullscreen", pageCanvas: true },
  title: "Pages/Recovery",
} satisfies Meta<typeof NotFoundPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NotFound: Story = {};
export const ServerError: Story = { render: () => <ErrorPage /> };
