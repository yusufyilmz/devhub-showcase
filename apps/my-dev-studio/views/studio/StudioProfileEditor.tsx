"use client";

import type { ComponentProps } from "react";

import { ProfileEditor } from "@shared/assistant/studio-workspace";

import { PreviewContent } from "./PreviewContent";

export function StudioProfileEditor(props: Omit<ComponentProps<typeof ProfileEditor>, "preview">) {
  return <ProfileEditor {...props} preview={PreviewContent} />;
}
