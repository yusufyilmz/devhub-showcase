import type { Meta, StoryObj } from "@storybook/react-vite";

import { InputOTP, InputOTPGroup, InputOTPSlot } from "./InputOTP";

function Example({ width = 560, invalid = false }: { width?: number; invalid?: boolean }) {
  return (
    <div className="mx-auto w-full" style={{ maxWidth: width }}>
      <InputOTP aria-invalid={invalid || undefined} aria-label="Verification code" maxLength={6}>
        <InputOTPGroup>
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <InputOTPSlot index={index} key={index} />
          ))}
        </InputOTPGroup>
      </InputOTP>
    </div>
  );
}
const meta = {
  component: Example,
  tags: ["autodocs"],
  title: "UI/Forms/Input OTP",
} satisfies Meta<typeof Example>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Narrow: Story = { args: { width: 320 } };
export const Wide: Story = { args: { width: 960 } };

export const Invalid: Story = { args: { invalid: true, width: 320 } };
