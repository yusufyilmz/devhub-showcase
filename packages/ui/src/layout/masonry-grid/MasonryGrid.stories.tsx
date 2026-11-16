import type { Meta, StoryObj } from "@storybook/react-vite";

import { Card, CardContent, CardHeader, CardTitle } from "../../cards";
import { MasonryGrid } from "..";

const meta = {
  component: MasonryGrid,
  title: "UI/Layout/Masonry Grid",
} satisfies Meta<typeof MasonryGrid>;

export default meta;

export const Responsive: StoryObj<typeof meta> = {
  render: () => (
    <MasonryGrid aria-label="Selected projects" columns={3} gap="md" m={{ columns: 2 }}>
      {[
        "Research notes",
        "Prototype",
        "Design system",
        "Case study",
        "Release notes",
        "Archive",
      ].map((title, index) => (
        <Card key={title}>
          <CardHeader>
            <CardTitle>{title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {index % 2
                ? "A short project summary."
                : "A longer project summary with enough detail to create a staggered layout."}
            </p>
          </CardContent>
        </Card>
      ))}
    </MasonryGrid>
  ),
};
