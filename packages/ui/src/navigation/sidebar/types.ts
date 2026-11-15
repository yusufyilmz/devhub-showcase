import type * as React from "react";

import type { useRender } from "@base-ui/react/use-render";
import type { VariantProps } from "class-variance-authority";

import type { TooltipContent } from "../../overlays/tooltip";
import type { sidebarMenuButtonVariants } from "./styles";

export type SidebarContextProps = {
  state: "expanded" | "collapsed";
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  mobileWidth: React.CSSProperties["width"];
  toggleSidebar: () => void;
};

export type SidebarProviderOptions = React.ComponentProps<"div"> & {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export type SidebarOptions = boolean | ((value: boolean) => boolean);

export type SidebarOptions2 = React.ComponentProps<"div"> & {
  side?: "left" | "right";
  variant?: "sidebar" | "floating" | "inset";
  collapsible?: "offcanvas" | "icon" | "none";
};

export type SidebarGroupLabelOptions = useRender.ComponentProps<"div"> & { asChild?: boolean };

export type SidebarGroupActionOptions = useRender.ComponentProps<"button"> & { asChild?: boolean };

export type SidebarMenuButtonOptions = useRender.ComponentProps<"button"> & {
  asChild?: boolean;
  isActive?: boolean;
  tooltip?: string | React.ComponentProps<typeof TooltipContent>;
} & VariantProps<typeof sidebarMenuButtonVariants>;

export type SidebarMenuActionOptions = useRender.ComponentProps<"button"> & {
  asChild?: boolean;
  showOnHover?: boolean;
};

export type SidebarMenuSkeletonOptions = React.ComponentProps<"div"> & {
  showIcon?: boolean;
};

export type SidebarMenuSubButtonOptions = useRender.ComponentProps<"a"> & {
  asChild?: boolean;
  size?: "sm" | "md";
  isActive?: boolean;
};
