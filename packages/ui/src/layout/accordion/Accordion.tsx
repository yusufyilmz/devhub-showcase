"use client";

import type * as React from "react";

import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { cn } from "cn";
import { ChevronDownIcon } from "lucide-react";

import { accordionStyles } from "./styles";

function Accordion({ ...props }: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return <AccordionPrimitive.Root data-slot="accordion" {...props} />;
}

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      className={cn(accordionStyles.accordionItem, className)}
      data-slot="accordion-item"
      {...props}
    />
  );
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className={accordionStyles.element1}>
      <AccordionPrimitive.Trigger
        className={cn(accordionStyles.accordionTrigger, className)}
        data-slot="accordion-trigger"
        {...props}
      >
        {children}
        <ChevronDownIcon aria-hidden="true" className={accordionStyles.element2} />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      className={accordionStyles.element3}
      data-slot="accordion-content"
      {...props}
    >
      <div className={cn(accordionStyles.accordionContent, className)}>{children}</div>
    </AccordionPrimitive.Content>
  );
}

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger };
