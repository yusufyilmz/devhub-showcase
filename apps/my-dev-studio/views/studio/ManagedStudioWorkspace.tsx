"use client";

import type { ComponentProps } from "react";

import { ManagedWorkspace } from "@shared/assistant/management-ui";

import { PreviewContent } from "./PreviewContent";

export function ManagedStudioWorkspace(
  props: Omit<ComponentProps<typeof ManagedWorkspace>, "preview">,
) {
  return <ManagedWorkspace {...props} preview={PreviewContent} />;
}
