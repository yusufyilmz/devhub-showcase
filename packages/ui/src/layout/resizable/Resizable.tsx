"use client";

import type * as React from "react";
import * as ResizablePrimitive from "react-resizable-panels";

import { cn } from "cn";
import { GripVerticalIcon } from "lucide-react";

import { resizableStyles } from "./styles";
import type { ResizableHandleOptions } from "./types";

function ResizablePanelGroup({
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelGroup>) {
  return (
    <ResizablePrimitive.PanelGroup
      className={cn(resizableStyles.resizablePanelGroup, className)}
      data-slot="resizable-panel-group"
      {...props}
    />
  );
}

function ResizablePanel({ ...props }: React.ComponentProps<typeof ResizablePrimitive.Panel>) {
  return <ResizablePrimitive.Panel data-slot="resizable-panel" {...props} />;
}

function ResizableHandle({ withHandle, className, ...props }: ResizableHandleOptions) {
  return (
    <ResizablePrimitive.PanelResizeHandle
      className={cn(resizableStyles.resizableHandle, className)}
      data-slot="resizable-handle"
      {...props}
    >
      {withHandle && (
        <div className={resizableStyles.element1}>
          <GripVerticalIcon className={resizableStyles.element2} />
        </div>
      )}
    </ResizablePrimitive.PanelResizeHandle>
  );
}

export { ResizableHandle, ResizablePanel, ResizablePanelGroup };
