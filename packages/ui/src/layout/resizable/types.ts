import type * as React from "react";
import type * as ResizablePrimitive from "react-resizable-panels";

export type ResizableHandleOptions = React.ComponentProps<
  typeof ResizablePrimitive.PanelResizeHandle
> & {
  withHandle?: boolean;
};
