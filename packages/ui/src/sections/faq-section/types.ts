import type { ComponentProps, ReactNode } from "react";

import type { SectionItem } from "../../layout/section";

export type FAQBlockProps = Omit<ComponentProps<"section">, "title"> & {
  title: ReactNode;
  headingId: string;
  eyebrow?: ReactNode;
  description?: ReactNode;
  items: SectionItem[];
  variant?: "standard" | "landing";
};
