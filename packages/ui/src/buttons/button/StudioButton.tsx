import { cn } from "cn";

import { Button } from "./Button";
import { studioButtonClass } from "./studio-button";
import type { ButtonOptions } from "./types";

export { studioButtonClass } from "./studio-button";

export function StudioButton({
  tone = "primary",
  className,
  variant: _variant,
  ...props
}: ButtonOptions & { tone?: keyof typeof studioButtonClass }) {
  return (
    <Button
      className={cn(studioButtonClass[tone], className)}
      data-studio-button={tone}
      variant="unstyled"
      {...props}
    />
  );
}
