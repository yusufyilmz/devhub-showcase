import { useForm } from "react-hook-form";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "../../buttons/button";
import { Input } from "../input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./Form";

function FormExample({ empty }: { empty: boolean }) {
  const form = useForm({ defaultValues: { name: empty ? "" : "Alex Morgan" } });
  return (
    <Form {...form}>
      <form className="grid gap-md" onSubmit={form.handleSubmit(() => undefined)}>
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
              <FormMessage />
            </FormItem>
          )}
          rules={{ required: "Enter the name you want to display on your portfolio." }}
        />
        <Button className="justify-self-start" type="submit">
          Save profile
        </Button>
      </form>
    </Form>
  );
}

function Example({ width = 560, empty = false }: { width?: number; empty?: boolean }) {
  return (
    <div style={{ maxWidth: width, padding: 24, width: "100%" }}>
      <FormExample empty={empty} />
    </div>
  );
}
const meta = {
  component: Example,
  tags: ["autodocs"],
  title: "UI/Forms/Form",
} satisfies Meta<typeof Example>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Narrow: Story = { args: { width: 320 } };
export const Wide: Story = { args: { width: 960 } };

export const Validation: Story = { args: { empty: true, width: 320 } };
