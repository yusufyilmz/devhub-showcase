import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./Table";

function Example({ width = 560 }: { width?: number }) {
  return (
    <div style={{ maxWidth: width, padding: 24, width: "100%" }}>
      <Table>
        <TableCaption>Fictional projects</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Project</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Studio website</TableCell>
            <TableCell>Published</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Brand concept</TableCell>
            <TableCell>Draft</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
const meta = { component: Example, tags: ["autodocs"], title: "UI/table" } satisfies Meta<
  typeof Example
>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Narrow: Story = { args: { width: 320 } };
export const Wide: Story = { args: { width: 960 } };
