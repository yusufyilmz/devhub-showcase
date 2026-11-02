import type { CSSProperties } from "react";

import type { IconsInlineStyle1Values } from "./types";

export function iconsClassName(...values: unknown[]): string {
  return `w-6 h-6 ${values[0]}`;
}

export function iconsInlineStyle1(...values: IconsInlineStyle1Values): CSSProperties {
  return { height: values[0], width: values[1] };
}
