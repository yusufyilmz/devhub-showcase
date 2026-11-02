"use client";

import type * as React from "react";

import { Slot } from "@radix-ui/react-slot";
import { cn } from "cn";
import { ChevronRight, MoreHorizontal } from "lucide-react";

import { breadcrumbStyles } from "./styles";
import type { BreadcrumbLinkOptions } from "./types";

function Breadcrumb({ ...props }: React.ComponentProps<"nav">) {
  return <nav aria-label="breadcrumb" data-slot="breadcrumb" {...props} />;
}

function BreadcrumbList({ className, ...props }: React.ComponentProps<"ol">) {
  return (
    <ol
      className={cn(breadcrumbStyles.breadcrumbList, className)}
      data-slot="breadcrumb-list"
      {...props}
    />
  );
}

function BreadcrumbItem({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      className={cn(breadcrumbStyles.breadcrumbItem, className)}
      data-slot="breadcrumb-item"
      {...props}
    />
  );
}

function BreadcrumbLink({ asChild, className, ...props }: BreadcrumbLinkOptions) {
  const Comp = asChild ? Slot : "a";

  return (
    <Comp
      className={cn(breadcrumbStyles.breadcrumbLink, className)}
      data-slot="breadcrumb-link"
      {...props}
    />
  );
}

function BreadcrumbPage({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      aria-current="page"
      aria-disabled="true"
      className={cn(breadcrumbStyles.breadcrumbPage, className)}
      data-slot="breadcrumb-page"
      {...props}
    />
  );
}

function BreadcrumbSeparator({ children, className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      aria-hidden="true"
      className={cn(breadcrumbStyles.breadcrumbSeparator, className)}
      data-slot="breadcrumb-separator"
      role="presentation"
      {...props}
    >
      {children ?? <ChevronRight />}
    </li>
  );
}

function BreadcrumbEllipsis({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden="true"
      className={cn(breadcrumbStyles.breadcrumbEllipsis, className)}
      data-slot="breadcrumb-ellipsis"
      role="presentation"
      {...props}
    >
      <MoreHorizontal className={breadcrumbStyles.element1} />
      <span className={breadcrumbStyles.element2}>More</span>
    </span>
  );
}

export {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
};
