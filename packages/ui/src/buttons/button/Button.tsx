import "../../styles/components/cards/surfaces.css";

import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { Slot } from "@radix-ui/react-slot";

import { buttonClasses, buttonVariants } from "./styles";
import type { ButtonIconOptions, ButtonOptions } from "./types";

function ButtonIcon({ icon, position }: ButtonIconOptions) {
  return (
    <span aria-hidden="true" data-icon={position}>
      {icon}
    </span>
  );
}

function nativeButtonProps(options: Pick<ButtonOptions, "asChild" | "type" | "variant">) {
  if (options.asChild) return {};
  return {
    type:
      options.type ?? (options.variant === "unstyled" ? ("submit" as const) : ("button" as const)),
  };
}

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  startIcon,
  endIcon,
  href,
  target,
  rel,
  children,
  ...props
}: ButtonOptions) {
  const classes = buttonClasses({ className, size, variant });
  const content = (
    <>
      {startIcon && !asChild ? <ButtonIcon icon={startIcon} position="inline-start" /> : null}
      {children}
      {endIcon && !asChild ? <ButtonIcon icon={endIcon} position="inline-end" /> : null}
    </>
  );

  if (href && !asChild) {
    return (
      <a
        className={classes}
        data-slot="button"
        href={props.disabled ? undefined : href}
        rel={rel}
        target={target}
        {...(props as React.ComponentProps<"a">)}
        aria-disabled={props.disabled || undefined}
        data-variant={variant}
        onClick={props.disabled ? undefined : (props as React.ComponentProps<"a">).onClick}
        tabIndex={props.disabled ? -1 : props.tabIndex}
      >
        {content}
      </a>
    );
  }

  const Comp = asChild ? Slot : ButtonPrimitive;

  return (
    <Comp
      className={classes}
      data-slot="button"
      data-variant={variant}
      {...props}
      {...nativeButtonProps({ asChild, type: props.type, variant })}
    >
      {asChild ? children : content}
    </Comp>
  );
}

export { Button, buttonVariants };
