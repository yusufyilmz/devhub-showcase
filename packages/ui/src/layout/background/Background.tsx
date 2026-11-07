import "../../styles/components/layout/background.css";

import { cn } from "cn";

import { backgroundVariants } from "./styles";
import type { BackgroundProps } from "./types";

export function Background({
  className,
  effect,
  variant,
  pattern,
  gradient,
  overlay,
  animation,
  blur,
  radius,
  shadow,
  children,
  ...props
}: BackgroundProps) {
  return (
    <div
      className={cn(
        backgroundVariants({
          animation,
          blur,
          className,
          gradient,
          overlay,
          pattern,
          radius,
          shadow,
          variant,
        }),
      )}
      data-effect={effect}
      data-slot="background"
      {...props}
    >
      {children}
    </div>
  );
}

// Convenience components for common background patterns
export function PrimaryBackground({
  className,
  children,
  ...props
}: Omit<BackgroundProps, "variant">) {
  return (
    <Background className={className} variant="default" {...props}>
      {children}
    </Background>
  );
}

export function CardBackground({
  className,
  children,
  ...props
}: Omit<BackgroundProps, "variant">) {
  return (
    <Background className={className} variant="card" {...props}>
      {children}
    </Background>
  );
}

export function GradientBackground({
  className,
  children,
  ...props
}: Omit<BackgroundProps, "gradient">) {
  return (
    <Background className={className} gradient="primary" {...props}>
      {children}
    </Background>
  );
}

export function PatternBackground({
  className,
  children,
  ...props
}: Omit<BackgroundProps, "pattern">) {
  return (
    <Background className={className} pattern="dots" {...props}>
      {children}
    </Background>
  );
}

export function AnimatedBackground({
  className,
  children,
  ...props
}: Omit<BackgroundProps, "animation">) {
  return (
    <Background animation="pulse" className={className} {...props}>
      {children}
    </Background>
  );
}

export type { BackgroundProps } from "./types";
