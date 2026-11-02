import type * as React from "react";

export type BreadcrumbLinkOptions = React.ComponentProps<"a"> & {
  asChild?: boolean;
};
