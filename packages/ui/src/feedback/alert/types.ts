import type * as React from "react";

import type { VariantProps } from "class-variance-authority";

import type { alertVariants } from "./styles";

export type AlertOptions = React.ComponentProps<"div"> & VariantProps<typeof alertVariants>;
