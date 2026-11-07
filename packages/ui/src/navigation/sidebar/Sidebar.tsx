"use client";

import React from "react";

import { useRender } from "@base-ui/react/use-render";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "cn";
import { PanelLeftIcon } from "lucide-react";

import { useIsMobile } from "@shared/runtime/browser";

import { Button } from "../../buttons/button";
import { Button as LibraryButton } from "../../buttons/button/Button";
import { Skeleton } from "../../feedback/skeleton";
import { Input } from "../../forms/input";
import { Separator } from "../../layout/seperator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../../overlays/sheet";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../overlays/tooltip";
import { sidebarMenuButtonVariants, sidebarStyles } from "./styles";
import type {
  SidebarContextProps,
  SidebarGroupActionOptions,
  SidebarGroupLabelOptions,
  SidebarMenuActionOptions,
  SidebarMenuButtonOptions,
  SidebarMenuSkeletonOptions,
  SidebarMenuSubButtonOptions,
  SidebarOptions,
  SidebarOptions2,
  SidebarProviderOptions,
} from "./types";

const SIDEBAR_COOKIE_NAME = "sidebar_state";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = "16rem";
const SIDEBAR_WIDTH_MOBILE = "18rem";
const SIDEBAR_WIDTH_ICON = "3rem";
const SIDEBAR_KEYBOARD_SHORTCUT = "b";

const SidebarContext = React.createContext<SidebarContextProps | null>(null);

function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }

  return context;
}

function SidebarProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange: setOpenProp,
  className,
  style,
  children,
  ...props
}: SidebarProviderOptions) {
  const isMobile = useIsMobile();
  const mobileWidth =
    (style as React.CSSProperties & { "--sidebar-width-mobile"?: string })?.[
      "--sidebar-width-mobile"
    ] ?? SIDEBAR_WIDTH_MOBILE;
  const [openMobile, setOpenMobile] = React.useState(false);

  // This is the internal state of the sidebar.
  // We use openProp and setOpenProp for control from outside the component.
  const [_open, _setOpen] = React.useState(defaultOpen);
  const open = openProp ?? _open;
  const setOpen = React.useCallback(
    (value: SidebarOptions) => {
      const openState = typeof value === "function" ? value(open) : value;
      if (openProp === undefined) _setOpen(openState);
      setOpenProp?.(openState);

      // This sets the cookie to keep the sidebar state.
      document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
    },
    [setOpenProp, open, openProp],
  );

  // Helper to toggle the sidebar.
  const toggleSidebar = React.useCallback(() => {
    return isMobile ? setOpenMobile((open) => !open) : setOpen((open) => !open);
  }, [isMobile, setOpen]);

  // Adds a keyboard shortcut to toggle the sidebar.
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        toggleSidebar();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleSidebar]);

  // We add a state so that we can do data-state="expanded" or "collapsed".
  // This makes it easier to style the sidebar with Tailwind classes.
  const state = open ? "expanded" : "collapsed";

  const contextValue = React.useMemo<SidebarContextProps>(
    () => ({
      isMobile,
      mobileWidth,
      open,
      openMobile,
      setOpen,
      setOpenMobile,
      state,
      toggleSidebar,
    }),
    [state, open, setOpen, isMobile, mobileWidth, openMobile, toggleSidebar],
  );

  return (
    <SidebarContext.Provider value={contextValue}>
      <TooltipProvider delayDuration={0}>
        <div
          className={cn(sidebarStyles.sidebarProvider, className)}
          data-slot="sidebar-wrapper"
          style={
            {
              "--sidebar-width": SIDEBAR_WIDTH,
              "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
              ...style,
            } as React.CSSProperties
          }
          {...props}
        >
          {children}
        </div>
      </TooltipProvider>
    </SidebarContext.Provider>
  );
}

function Sidebar({
  side = "left",
  variant = "sidebar",
  collapsible = "offcanvas",
  className,
  children,
  ...props
}: SidebarOptions2) {
  const { isMobile, mobileWidth, state, openMobile, setOpenMobile } = useSidebar();
  const previousFocus = React.useRef<HTMLElement | null>(null);

  if (collapsible === "none") {
    return (
      <div className={cn(sidebarStyles.sidebar, className)} data-slot="sidebar" {...props}>
        {children}
      </div>
    );
  }

  if (isMobile) {
    return (
      <Sheet onOpenChange={setOpenMobile} open={openMobile}>
        <SheetContent
          {...props}
          className={cn(sidebarStyles.element1, className)}
          data-mobile="true"
          data-sidebar="sidebar"
          data-slot="sidebar"
          onCloseAutoFocus={(event) => {
            if (previousFocus.current?.isConnected) {
              event.preventDefault();
              previousFocus.current.focus();
            }
          }}
          onOpenAutoFocus={() => {
            previousFocus.current =
              document.activeElement instanceof HTMLElement ? document.activeElement : null;
          }}
          side={side}
          style={
            {
              "--sidebar-width": mobileWidth,
              ...props.style,
            } as React.CSSProperties
          }
        >
          <SheetHeader className={sidebarStyles.element2}>
            <SheetTitle>Sidebar</SheetTitle>
            <SheetDescription>Displays the mobile sidebar.</SheetDescription>
          </SheetHeader>
          <div className={sidebarStyles.element3}>{children}</div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div
      className={sidebarStyles.element4}
      data-collapsible={state === "collapsed" ? collapsible : ""}
      data-side={side}
      data-slot="sidebar"
      data-state={state}
      data-variant={variant}
    >
      {/* This is what handles the sidebar gap on desktop */}
      <div
        className={cn(
          sidebarStyles.sidebar2,
          sidebarStyles.sidebar3,
          sidebarStyles.sidebar4,
          variant === "floating" || variant === "inset"
            ? sidebarStyles.sidebar5
            : sidebarStyles.sidebar6,
        )}
        data-slot="sidebar-gap"
      />
      <div
        className={cn(
          sidebarStyles.sidebar7,
          side === "left" ? sidebarStyles.sidebar8 : sidebarStyles.sidebar9,
          // Adjust the padding for floating and inset variants.
          variant === "floating" || variant === "inset"
            ? sidebarStyles.sidebar10
            : sidebarStyles.sidebar11,
          className,
        )}
        data-slot="sidebar-container"
        {...props}
      >
        <div className={sidebarStyles.element5} data-sidebar="sidebar" data-slot="sidebar-inner">
          {children}
        </div>
      </div>
    </div>
  );
}

function SidebarTrigger({ className, onClick, ...props }: React.ComponentProps<typeof Button>) {
  const { isMobile, open, openMobile, toggleSidebar } = useSidebar();

  return (
    <Button
      aria-expanded={isMobile ? openMobile : open}
      className={cn(sidebarStyles.sidebarTrigger, className)}
      data-sidebar="trigger"
      data-slot="sidebar-trigger"
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) toggleSidebar();
      }}
      size="icon"
      variant="ghost"
      {...props}
    >
      <PanelLeftIcon className="rtl:rotate-180" />
      <span className={sidebarStyles.element6}>Toggle Sidebar</span>
    </Button>
  );
}

function SidebarRail({ className, ...props }: React.ComponentProps<"button">) {
  const { toggleSidebar } = useSidebar();

  return (
    <LibraryButton
      aria-label="Toggle Sidebar"
      className={cn(
        sidebarStyles.sidebarRail,
        sidebarStyles.sidebarRail2,
        sidebarStyles.sidebarRail3,
        sidebarStyles.sidebarRail4,
        sidebarStyles.sidebarRail5,
        sidebarStyles.sidebarRail6,
        className,
      )}
      data-sidebar="rail"
      data-slot="sidebar-rail"
      onClick={toggleSidebar}
      tabIndex={-1}
      title="Toggle Sidebar"
      type="button"
      variant="unstyled"
      {...props}
    />
  );
}

function SidebarInset({ className, ...props }: React.ComponentProps<"main">) {
  return (
    <main
      className={cn(sidebarStyles.sidebarInset, sidebarStyles.sidebarInset2, className)}
      data-slot="sidebar-inset"
      {...props}
    />
  );
}

function SidebarInput({ className, ...props }: React.ComponentProps<typeof Input>) {
  return (
    <Input
      className={cn(sidebarStyles.sidebarInput, className)}
      data-sidebar="input"
      data-slot="sidebar-input"
      {...props}
    />
  );
}

function SidebarHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(sidebarStyles.sidebarHeader, className)}
      data-sidebar="header"
      data-slot="sidebar-header"
      {...props}
    />
  );
}

function SidebarFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(sidebarStyles.sidebarFooter, className)}
      data-sidebar="footer"
      data-slot="sidebar-footer"
      {...props}
    />
  );
}

function SidebarSeparator({ className, ...props }: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      className={cn(sidebarStyles.sidebarSeparator, className)}
      data-sidebar="separator"
      data-slot="sidebar-separator"
      {...props}
    />
  );
}

function SidebarContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(sidebarStyles.sidebarContent, className)}
      data-sidebar="content"
      data-slot="sidebar-content"
      {...props}
    />
  );
}

function SidebarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(sidebarStyles.sidebarGroup, className)}
      data-sidebar="group"
      data-slot="sidebar-group"
      {...props}
    />
  );
}

function SidebarGroupLabel({
  className,
  asChild = false,
  render,
  ...props
}: SidebarGroupLabelOptions) {
  return useRender({
    defaultTagName: "div",
    props: {
      className: cn(sidebarStyles.sidebarGroupLabel, sidebarStyles.sidebarGroupLabel2, className),
      "data-sidebar": "group-label",
      "data-slot": "sidebar-group-label",
      ...props,
    },
    render: render ?? (asChild ? <Slot /> : undefined),
  });
}

function SidebarGroupAction({
  className,
  asChild = false,
  render,
  ...props
}: SidebarGroupActionOptions) {
  return useRender({
    defaultTagName: "button",
    props: {
      className: cn(
        sidebarStyles.sidebarGroupAction,
        // Increases the hit area of the button on mobile.
        sidebarStyles.sidebarGroupAction2,
        sidebarStyles.sidebarGroupAction3,
        className,
      ),
      "data-sidebar": "group-action",
      "data-slot": "sidebar-group-action",

      type: asChild || render ? undefined : "button",
      ...props,
    },
    render: render ?? (asChild ? <Slot /> : undefined),
  });
}

function SidebarGroupContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(sidebarStyles.sidebarGroupContent, className)}
      data-sidebar="group-content"
      data-slot="sidebar-group-content"
      {...props}
    />
  );
}

function SidebarMenu({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      className={cn(sidebarStyles.sidebarMenu, className)}
      data-sidebar="menu"
      data-slot="sidebar-menu"
      {...props}
    />
  );
}

function SidebarMenuItem({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      className={cn(sidebarStyles.sidebarMenuItem, className)}
      data-sidebar="menu-item"
      data-slot="sidebar-menu-item"
      {...props}
    />
  );
}

function SidebarMenuButton({
  asChild = false,
  render,
  isActive = false,
  variant = "default",
  size = "default",
  tooltip,
  className,
  ...props
}: SidebarMenuButtonOptions) {
  const { isMobile, state } = useSidebar();

  const button = useRender({
    defaultTagName: "button",
    props: {
      "aria-current": isActive ? "page" : undefined,
      className: cn(sidebarMenuButtonVariants({ size, variant }), className),
      "data-active": isActive,
      "data-sidebar": "menu-button",
      "data-size": size,
      "data-slot": "sidebar-menu-button",
      type: asChild || render ? undefined : "button",
      ...props,
    },
    render: render ?? (asChild ? <Slot /> : undefined),
  });

  if (!tooltip) {
    return button;
  }

  if (typeof tooltip === "string") {
    tooltip = {
      children: tooltip,
    };
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent
        align="center"
        hidden={state !== "collapsed" || isMobile}
        side="right"
        {...tooltip}
      />
    </Tooltip>
  );
}

function SidebarMenuAction({
  className,
  asChild = false,
  render,
  showOnHover = false,
  ...props
}: SidebarMenuActionOptions) {
  return useRender({
    defaultTagName: "button",
    props: {
      className: cn(
        sidebarStyles.sidebarMenuAction,
        // Increases the hit area of the button on mobile.
        sidebarStyles.sidebarMenuAction2,
        sidebarStyles.sidebarMenuAction3,
        sidebarStyles.sidebarMenuAction4,
        sidebarStyles.sidebarMenuAction5,
        sidebarStyles.sidebarMenuAction6,
        showOnHover && sidebarStyles.sidebarMenuAction7,
        className,
      ),
      "data-sidebar": "menu-action",
      "data-slot": "sidebar-menu-action",

      type: asChild || render ? undefined : "button",
      ...props,
    },
    render: render ?? (asChild ? <Slot /> : undefined),
  });
}

function SidebarMenuBadge({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        sidebarStyles.sidebarMenuBadge,
        sidebarStyles.sidebarMenuBadge2,
        sidebarStyles.sidebarMenuBadge3,
        sidebarStyles.sidebarMenuBadge4,
        sidebarStyles.sidebarMenuBadge5,
        sidebarStyles.sidebarMenuBadge6,
        className,
      )}
      data-sidebar="menu-badge"
      data-slot="sidebar-menu-badge"
      {...props}
    />
  );
}

function SidebarMenuSkeleton({
  className,
  showIcon = false,
  ...props
}: SidebarMenuSkeletonOptions) {
  return (
    <div
      className={cn(sidebarStyles.sidebarMenuSkeleton, className)}
      data-sidebar="menu-skeleton"
      data-slot="sidebar-menu-skeleton"
      {...props}
    >
      {showIcon && (
        <Skeleton className={sidebarStyles.element7} data-sidebar="menu-skeleton-icon" />
      )}
      <Skeleton
        className={sidebarStyles.element8}
        data-sidebar="menu-skeleton-text"
        style={{ "--skeleton-width": "70%" } as React.CSSProperties}
      />
    </div>
  );
}

function SidebarMenuSub({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      className={cn(sidebarStyles.sidebarMenuSub, sidebarStyles.sidebarMenuSub2, className)}
      data-sidebar="menu-sub"
      data-slot="sidebar-menu-sub"
      {...props}
    />
  );
}

function SidebarMenuSubItem({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      className={cn(sidebarStyles.sidebarMenuSubItem, className)}
      data-sidebar="menu-sub-item"
      data-slot="sidebar-menu-sub-item"
      {...props}
    />
  );
}

function SidebarMenuSubButton({
  asChild = false,
  render,
  size = "md",
  isActive = false,
  className,
  ...props
}: SidebarMenuSubButtonOptions) {
  return useRender({
    defaultTagName: "a",
    props: {
      "aria-current": isActive ? "page" : undefined,
      className: cn(
        sidebarStyles.sidebarMenuSubButton,
        sidebarStyles.sidebarMenuSubButton2,
        size === "sm" && sidebarStyles.sidebarMenuSubButton3,
        size === "md" && sidebarStyles.sidebarMenuSubButton4,
        sidebarStyles.sidebarMenuSubButton5,
        className,
      ),
      "data-active": isActive,
      "data-sidebar": "menu-sub-button",
      "data-size": size,
      "data-slot": "sidebar-menu-sub-button",
      ...props,
    },
    render: render ?? (asChild ? <Slot /> : undefined),
  });
}

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
};
