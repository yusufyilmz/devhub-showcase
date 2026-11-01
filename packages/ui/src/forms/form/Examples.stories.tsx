import type { Meta, StoryObj } from "@storybook/react-vite";

function FormExample() {
  const form = useForm({ defaultValues: { name: "Alex Morgan" } });
  return (
    <Form {...form}>
      <form>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>Shown on your portfolio.</FormDescription>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}

import { useForm } from "react-hook-form";

import { Input } from "../input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "./Form";

function Example({ width = 560 }: { width?: number }) {
  return (
    <div style={{ maxWidth: width, padding: 24, width: "100%" }}>
      <FormExample />
    </div>
  );
}
const meta = { component: Example, tags: ["autodocs"], title: "UI/form" } satisfies Meta<
  typeof Example
>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Narrow: Story = { args: { width: 320 } };
export const Wide: Story = { args: { width: 960 } };
