import type { ComponentProps, ReactNode } from "react";

export type CTABlockProps = Omit<ComponentProps<"section">, "title"> & {
  title: ReactNode;
  headingId: string;
  eyebrow?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  note?: ReactNode;
  variant?: "standard" | "landing";
};
